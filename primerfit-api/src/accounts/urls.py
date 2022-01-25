from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter
from django.urls import include

import accounts.views

router = DefaultRouter()
router.register(r'^users', accounts.views.UserView)

urlpatterns = [
    # url(_(r'^confirm/email/(?P<activation_key>.*)/$'),
    #     accounts.views.UserConfirmEmailView.as_view(),
    #     name='confirm_email'),
    url(_(r'^login/$'),
        accounts.views.UserLoginView.as_view(),
        name='login'),
    url(_(r''),
        include(router.urls),
        name='users'),
    url(_(r'^profile/$'),
        accounts.views.ProfileView.as_view(),
        name='profile'),
    url(_(r'^logout/$'),
        accounts.views.LogoutView.as_view(),
        name='profile'),
]
