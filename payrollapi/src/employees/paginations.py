from rest_framework import pagination
from rest_framework.response import Response


class EmployeePagination(pagination.PageNumberPagination):

    def get_paginated_response(self, data, extra_keys):
        if extra_keys.get('hierarchy'):
            return Response({
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'active_employees': extra_keys.get('active_employees'),
                'terminated_employees': 0,
                'results': data
            })

        return Response({
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'active_employees': extra_keys.get('active_employees'),
                'terminated_employees': 0,
                'results': data
            })
