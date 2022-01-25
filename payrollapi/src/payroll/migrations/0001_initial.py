# Generated by Django 2.2.10 on 2021-12-22 12:04

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('company', '0003_taxtable'),
    ]

    operations = [
        migrations.CreateModel(
            name='PayPeriod',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('period_month', models.DateField()),
                ('number_of_days', models.IntegerField()),
                ('status', models.CharField(choices=[('Paid', 'Paid'), ('Live', 'Live'), ('Future', 'Future')], default='Future', max_length=10)),
                ('is_active', models.BooleanField(default=True)),
                ('company_policy', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.CompanyPolicy')),
            ],
            options={
                'ordering': ['date_created'],
            },
        ),
    ]
