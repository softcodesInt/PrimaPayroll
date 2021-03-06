# Generated by Django 2.2.10 on 2021-12-23 10:46

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_auto_20211223_0104'),
        ('company', '0008_auto_20211222_2336'),
        ('payroll', '0006_auto_20211223_0104'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('earnings', django.contrib.postgres.fields.jsonb.JSONField()),
                ('deductions', django.contrib.postgres.fields.jsonb.JSONField()),
                ('is_active', models.BooleanField(default=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.Company')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employees.Employee')),
            ],
            options={
                'ordering': ['date_created'],
            },
        ),
    ]
