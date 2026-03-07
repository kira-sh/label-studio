def get_user_repr(user):
    """Turn user object into dict with required properties"""
    if user.is_anonymous:
        return {'key': str(user), 'custom': {'organization': None, 'organization_id': None}}
    user_data = {'email': user.email}
    user_data['key'] = user_data['email']
    om = user.om_through.filter(deleted_at__isnull=True).select_related('organization__created_by').first()
    if om is not None:
        org = om.organization
        user_data['custom'] = {
            'organization': org.created_by.email if org.created_by else None,
            'organization_id': org.id,
        }
    else:
        user_data['custom'] = {'organization': None, 'organization_id': None}
    return user_data


def get_user_repr_from_organization(organization):
    """Turn organization object into its owner dict"""
    if organization is None:
        return {
            'key': 'none',
            'custom': {'organization': None, 'organization_id': None},
        }

    email = organization.created_by.email if organization.created_by else None
    return {
        'key': email,
        'custom': {
            'organization': email,
            'organization_id': organization.id,
        },
    }
