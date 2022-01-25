# Generated by Django 2.2.10 on 2021-12-23 12:14

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_auto_20211223_0104'),
        ('company', '0008_auto_20211222_2336'),
        ('payroll', '0010_auto_20211223_1226'),
    ]

    operations = [
        migrations.CreateModel(
            name='Loan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('interest_rate', models.DecimalField(decimal_places=2, max_digits=8)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('when_to_pay', models.CharField(blank=True, choices=[('MONTHLY', 'Monthly'), ('CUSTOM', 'Custom Month')], max_length=30, null=True)),
                ('when_to_pay_months', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=30), blank=True, null=True, size=None)),
                ('is_active', models.BooleanField(default=True)),
                ('company', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='company.Company')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employees.Employee')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]