# Generated by Django 2.2.10 on 2020-12-01 17:40

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auditlog', '0005_remove_companylog_previous'),
    ]

    operations = [
        migrations.AddField(
            model_name='companylog',
            name='previous',
            field=django.contrib.postgres.fields.jsonb.JSONField(null=True),
        ),
    ]