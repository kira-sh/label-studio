from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_user_custom_hotkeys'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='active_organization',
        ),
    ]
