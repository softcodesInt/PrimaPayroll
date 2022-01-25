import json
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.authtoken.models import Token

from accounts.utils import get_company_employee_count, get_parent_company, get_company_active_employee


class LicenseCodeAccessMiddleWare(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def _http_response(self, request, content='', status_code=400):
        """
        Returns a JSON HTTPResponse
        """
        response = HttpResponse()
        response.status_code = status_code
        if isinstance(content, str):
            content = {
                'message': content
            }
        response['Content-Type'] = 'application/json; charset=utf-8'
        response.content = json.dumps(content)
        return response

    def process_request(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        if request.path in ['/api/v1/accounts/login/',
                            '/api/v1/accounts/register/',
                            '/api/v1/accounts/password-reset/',
                            '/api/v1/accounts/password-reset/confirm/',
                            '/api/v1/company/activate-license/']:
            response = self.get_response(request)
            return response

        if request.path.startswith('/api/v1/ess/'):
            response = self.get_response(request)
            return response

        if 'HTTP_AUTHORIZATION' in request.META and not request.user.is_authenticated:
            try:
                token = Token.objects.get(key=request.META['HTTP_AUTHORIZATION'][6:])
                request.user = token.user
            except:
                return self._http_response(
                    request,
                    content="User is not logged in",
                    status_code=400
                )
        # Verify the user's subscription is enough to create a new user
        company = get_parent_company(request)
        now = timezone.now()
        if company.subscription_expiration_date < now:
            return self._http_response(
                request,
                content="Your subscription package has now expired. Reach out to payroll@softocdes.com.ng",
                status_code=400
            )
        if request.path == "/api/v1/employees/employee-info/" and request.method == "POST":
            employee_count_response = get_company_employee_count(company.license_code)
            if employee_count_response.status_code != 200:
                return self._http_response(
                    request,
                    content="An unexpected error occurred when communicating with the server, please try again."
                            "If this persists, please reach out to us",
                    status_code=400
                )
            if get_company_active_employee(company) < employee_count_response.json()['employee_count']:
                # the subscription might have changed from the source
                company.bought_ess = employee_count_response.json()['bought_ess']
                company.save()
                pass
            else:
                return self._http_response(
                    request,
                    content="Unfortunately, You cannot create a new employee due to your subscription limit.",
                    status_code=400
                )

        response = self.get_response(request)
        return response
