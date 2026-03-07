# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("organizations", "0007_alter_organization_created_by"),
    ]

    operations = [
        migrations.AddField(
            model_name="organizationmember",
            name="is_admin",
            field=models.BooleanField(
                default=False,
                help_text="Whether this member has admin privileges in the organization.",
            ),
        ),
    ]
