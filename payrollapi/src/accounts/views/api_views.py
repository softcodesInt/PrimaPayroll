from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm
from django.conf import settings
from rest_framework import viewsets
from django.contrib.auth import login

from accounts.serializers import (
    RegistrationSerializer,
    UserSerializer,
    UserProfileCompanySerializer,
    AdminUserSerializer
)
from accounts.models import AdminUser
from company.models import Company
from ess.serializers import EmployeeSerializer


class CreateOrganisationAdmin(GenericAPIView):
    serializer_class = RegistrationSerializer
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        try:
            company = Company.objects.get(id=data['company_id'])
        except Company.DoesNotExist:
            return Response({'non_field_errors'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(first_name=data['first_name'],
                                   last_name=data['last_name'],
                                   email=data['email'],
                                   username=data['email'])
        user.set_password(data['password'])
        user.save()
        AdminUser.objects.create(user=user, has_all_access=True, main_company=company,
                                 license_code=company.license_code)
        user.adminuser.save()
        company.admin = user.adminuser
        company.created_by = user.adminuser
        company.save()

        return Response({'success': 'User Created Successfully'}, status=status.HTTP_201_CREATED)


class UserLoginView(GenericAPIView):
    """
    Login for both dashboard and app.
    """
    serializer_class = None
    authentication_classes = ()
    permission_classes = ()

    def get_company(self, user):
        try:
            company = Company.objects.get(admin=user.adminuser)
        except Company.DoesNotExist:
            return Response({'non_field_errors': ['User does not belong to any company']},
                            status=status.HTTP_400_BAD_REQUEST)

        return company

    def post(self, request):
        request_data = {
            'username': request.data.get('email'),
            'password': request.data.get('password')
        }
        serializer = AuthTokenSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        data = UserSerializer(user).data
        if hasattr(user, 'adminuser'):
            data.update({
                'user_level': 1
            })
        else:
            data.update({
                'user_level': 2
            })
        token, _ = Token.objects.get_or_create(user=user)
        # set cookie in the middleware
        response = Response({'token': token.key, 'user': data})
        return response


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


class ProfileView(GenericAPIView):
    """
    Get Logged in user's profile
    """
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_admin_data(self, user):
        return {
            'user': UserSerializer(user).data,
            # revisit how to get user company
            'company': UserProfileCompanySerializer(user.adminuser.main_company).data
        }

    def get_ess_data(self, user):
        return {
            'user': EmployeeSerializer(user.employee).data,
            'company': UserProfileCompanySerializer(user.employee.main_company).data
        }

    def get(self, request):
        user = request.user
        if hasattr(user, 'adminuser'):
            data = self.get_admin_data(user)
        else:
            data = self.get_ess_data(user)
        return Response(data)


class UserAccessView(viewsets.ModelViewSet):
    """
    Create new admin user
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = AdminUserSerializer
    permission_classes = (IsAuthenticated,)
    queryset = AdminUser.objects.all()

    def get_license_code(self):
        license_code = Company.objects.filter(admin=self.request.user.adminuser).first().license_code
        return license_code

    def get_queryset(self):
        return AdminUser.objects.filter(license_code=self.get_license_code())

    def perform_create(self, serializer, *args, **kwargs):
        data = self.request.data
        user = User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email']
        )
        admin_user = AdminUser.objects.create(user=user,
                                              has_all_access=data['has_all_access'],
                                              license_code=self.get_license_code())
        return admin_user

    def create(self, request, *args, **kwargs):
        instance = self.perform_create(self.serializer_class, args, kwargs)
        return Response(AdminUserSerializer(instance=instance).data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        data = self.request.data
        instance = self.get_object()
        instance.user.first_name = data['first_name']
        instance.user.last_name = data['last_name']
        instance.user.email = data['email']
        instance.user.save()
        instance.has_all_access = data['has_all_access']
        instance.save()
        return instance

    def update(self, request, *args, **kwargs):
        instance = self.perform_update(self.serializer_class)
        return Response(AdminUserSerializer(instance=instance).data, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.user.is_active = False
        instance.user.save()
        return instance
