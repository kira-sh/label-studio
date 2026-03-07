from django.urls import path

from .api import SessionTimeoutPolicyView

app_name = 'session_policy'

urlpatterns = [
    path('api/organizations/<int:pk>/session-policy/', SessionTimeoutPolicyView.as_view(), name='session-policy'),
]
