# Generated by Django 2.2.10 on 2020-11-09 19:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_auto_20201109_1854'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='license_code',
            new_name='license',
        ),
    ]
