"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
from django.contrib import admin

from .models import Organization, OrganizationMember


class OrganizationMemberInline(admin.TabularInline):
    model = OrganizationMember
    extra = 0
    fields = ('user', 'is_admin', 'deleted_at')
    readonly_fields = ('deleted_at',)


class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    inlines = [OrganizationMemberInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change and obj.created_by:
            OrganizationMember.objects.get_or_create(user=obj.created_by, organization=obj)


admin.site.register(Organization, OrganizationAdmin)
