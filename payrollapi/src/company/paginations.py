from rest_framework import pagination
from rest_framework.response import Response


class HierarchyPagination(pagination.PageNumberPagination):

    def get_paginated_response(self, data, extra_keys):
        if extra_keys.get('hierarchy'):
            hierachy = extra_keys['hierarchy']
            return Response({
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'total_heads': hierachy.get_total_head,
                'total_items': hierachy.get_total_items,
                'total_head_active': hierachy.get_total_head_active,
                'total_head_inactive': hierachy.get_total_head_inactive,
                'total_item_active': hierachy.get_total_items_active,
                'total_item_inactive': hierachy.get_total_items_inactive,
                'results': data
            })

        return Response({
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'total_heads': 0,
                'total_items': 0,
                'total_head_active': 0,
                'total_head_inactive': 0,
                'total_item_active': 0,
                'total_item_inactive': 0,
                'results': data
            })
