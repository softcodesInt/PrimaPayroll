from django.contrib.auth.signals import user_logged_out
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from django.template import loader
from rest_framework import viewsets
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm
from django_rest_passwordreset.models import ResetPasswordToken
from django.conf import settings

from accounts.models import User
from accounts.serializers import LoginSerializer, UserSerializer
from accounts.utils import generate_token
from auditlog.serializers import StaffLogSerializer, CompanyLogSerializer
from auditlog.models import StaffLog, CompanyLog
from company.models import Company
from company.serializers import CompanySerializer
from lib.tasks import send_email_task


class UserLoginView(GenericAPIView):
    """
    Login for both dashboard and app.
    """
    serializer_class = LoginSerializer
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'], is_active=True)
            if not user.check_password(serializer.validated_data.get('password')):
                return Response({'non_field_errors': ['Invalid email/password']}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'non_field_errors': ['User does not exist']}, status=status.HTTP_404_NOT_FOUND)

        token = generate_token(user)
        data = UserSerializer(user).data
        return Response({
            'token': token,
            'user': data
        })


class ResetPasswordView(ResetPasswordRequestToken):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
        except Exception as e:
            if e.detail.get('email'):
                return Response({'non_field_errors': ['User does not exist']}, status=status.HTTP_404_NOT_FOUND)
            return Response({'non_field_errors': ['Unknown error occurred, try again later']},
                            status=status.HTTP_400_BAD_REQUEST)

        return response


class SetPasswordView(ResetPasswordConfirm):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
        except Exception as e:
            if e.detail.get('password'):
                return Response({'non_field_errors': ['Password did not pass validation. Use a strong password']},
                                status=status.HTTP_400_BAD_REQUEST)
            return Response({'non_field_errors': ['Unknown error occurred, try again later']},
                            status=status.HTTP_400_BAD_REQUEST)

        if response.status_code == status.HTTP_200_OK:
            return response

        return Response({'non_field_errors': ['Link has expired']}, status=status.HTTP_400_BAD_REQUEST)


class UserView(viewsets.ModelViewSet):
    """
    Fetch All user's view for the dashboard.

    Search by first_name, last_name or email
    """
    serializer_class = UserSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('first_name', 'last_name', 'email',)
    queryset = User.objects.filter(is_active=True)

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        token = ResetPasswordToken.objects.create(
            user=instance,
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            ip_address=self.request.META.get('REMOTE_ADDR', ''),
        )
        StaffLog.objects.create(action=StaffLog.PRIMERLOG_CREATE,
                                blamer=self.request.user,
                                meta=serializer.validated_data,
                                staff=instance)
        html = loader.render_to_string('emails/email_verification.html', {
            'user': instance.get_full_name(),
            'invitee': self.request.user.get_full_name(),
            'setup_link': '{}reset-password/{}'.format(settings.FRONTEND_URL, token.key)
        })
        send_email_task(instance.email, 'Welcome to PrimalFIT', html)

    def perform_update(self, serializer):
        instance = serializer.save()
        StaffLog.objects.create(action=StaffLog.PRIMERLOG_UPDATE,
                                blamer=self.request.user,
                                meta=serializer.validated_data,
                                staff=instance)

    def perform_destroy(self, instance):
        """Delete a user"""
        instance.is_active = False
        instance.save()
        StaffLog.objects.create(action=StaffLog.PRIMERLOG_DELETE,
                                blamer=self.request.user,
                                staff=instance)

    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'non_field_errors': ['User does not exist']}, status=status.HTTP_404_NOT_FOUND)

        staff_activity = StaffLog.objects.filter(blamer=user)
        company_activity = CompanyLog.objects.filter(blamer=user)
        company_managing = Company.objects.filter(blame=user)

        return Response({
            'user': UserSerializer(user).data,
            'staff_activity': StaffLogSerializer(staff_activity, many=True).data,
            'company_activity': CompanyLogSerializer(company_activity, many=True).data,
            'company_managing': CompanySerializer(company_managing, many=True).data
        })


class ProfileView(GenericAPIView):
    """
    Get Logged in user's profile
    """
    serializer_class = UserSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user

        return Response({
            'user': UserSerializer(user).data
        })


class LogoutView(GenericAPIView):
    """
    Log the user out of all sessions
    I.E. deletes all auth tokens for the user
    """
    serializer_class = None
    authentication_classes = ()
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        request._auth.delete()
        user_logged_out.send(sender=request.user.__class__, request=request, user=request.user)
        return Response(None, status=status.HTTP_204_NO_CONTENT)
