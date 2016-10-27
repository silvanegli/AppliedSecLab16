"""djangoBackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from ca_auth import views

urlpatterns = [
    url(r'^api/', include('ca_api.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/api-token-auth/', obtain_jwt_token),
    url(r'^api/api-token-refresh/', refresh_jwt_token),
    url(r'^api/ssl-login/', views.ssl_auth),
]
