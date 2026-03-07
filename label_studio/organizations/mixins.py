from django.utils.functional import cached_property


class OrganizationMixin:
    @cached_property
    def active_members(self):
        return self.members


class OrganizationMemberMixin:
    def has_permission(self, user):
        return user.organizations.filter(pk=self.organization_id, organizationmember__deleted_at__isnull=True).exists()
