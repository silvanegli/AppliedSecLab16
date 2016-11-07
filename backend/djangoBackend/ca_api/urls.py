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

    url(r'^certificates/(?P<pk>[0-9]+)/$',
        views.CertificateDetails.as_view(),
        name='certificate-details'),

    url(r'^certificates/(?P<cert_pk>[0-9]+)/download/$',
        views.pkcs12_download,
        name='pkcs12-download'),

    url(r'^users/(?P<pk>[a-z0-9]+)/$',
        views.UserDetail.as_view(),
        name='user-detail'),
]