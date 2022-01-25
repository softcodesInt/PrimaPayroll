# Generated by Django 2.2.10 on 2021-12-22 13:29

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20211220_2027'),
        ('company', '0006_hierarchy'),
    ]

    operations = [
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('recurring', models.BooleanField(default=False)),
                ('date_from', models.DateField(blank=True)),
                ('date_to', models.DateField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('company_policy', models.ManyToManyField(related_name='holiday_policy', to='company.CompanyPolicy')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='holiday_created_by', to='accounts.AdminUser')),
            ],
            options={
                'ordering': ['-date_created'],
            },
        ),
    ]