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
]