import factory
from core.utils.common import load_func
from django.conf import settings
from organizations.models import Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    title = factory.Faker('company')
    created_by = factory.SubFactory(load_func(settings.USER_FACTORY), active_organization=None)

    class Meta:
        model = Organization

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        return Organization.create_organization(**kwargs)

    @factory.post_generation
    def created_by_active_organization(self, create, extracted, **kwargs):
        pass  # active_organization field removed; membership is tracked via OrganizationMember
