from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from organizations.models import Organization

from .models import SessionTimeoutPolicy
from .serializers import SessionTimeoutPolicySerializer


@method_decorator(
    name='get',
    decorator=extend_schema(
        tags=['Session Policy'],
        summary='Retrieve Session Policy',
        description='Retrieve session timeout policy for the specified organization.',
        responses={
            200: SessionTimeoutPolicySerializer,
        },
        extensions={
            'x-fern-sdk-group-name': 'session_policy',
            'x-fern-sdk-method-name': 'get',
            'x-fern-audiences': ['public'],
        },
    ),
)
@method_decorator(
    name='patch',
    decorator=extend_schema(
        tags=['Session Policy'],
        summary='Update Session Policy',
        description='Update session timeout policy for the specified organization.',
        request=SessionTimeoutPolicySerializer,
        responses={
            200: SessionTimeoutPolicySerializer,
        },
        extensions={
            'x-fern-sdk-group-name': 'session_policy',
            'x-fern-sdk-method-name': 'update',
            'x-fern-audiences': ['public'],
        },
    ),
)
class SessionTimeoutPolicyView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating organization's session timeout policy
    """

    serializer_class = SessionTimeoutPolicySerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']  # Explicitly specify allowed methods

    def get_object(self):
        org = get_object_or_404(Organization, pk=self.kwargs['pk'])
        if not org.has_permission(self.request.user):
            raise PermissionDenied('You do not have access to this organization.')
        policy, _ = SessionTimeoutPolicy.objects.get_or_create(organization=org)
        return policy
