# API endpoints
from django.conf.urls import url

from CertAPI import views

urlpatterns = [
    url(r'^$', views.api_root),
]

# URLs
urlpatterns += [
    url(r'^certificates/$',
        views.CertificateList.as_view(),
        name='certificate-list'),
    url(r'^users/(?P<pk>[a-z]+)/$',
        views.UserDetail.as_view(),
        name='user-detail'),
]