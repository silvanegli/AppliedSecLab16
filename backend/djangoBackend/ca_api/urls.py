# API endpoints
from django.conf.urls import url

from ca_api import views

urlpatterns = [
    url(r'^$', views.api_root, name='root'),
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