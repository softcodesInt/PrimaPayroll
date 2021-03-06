# Generated by Django 2.2.10 on 2021-12-23 12:42

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_auto_20211223_0104'),
        ('company', '0008_auto_20211222_2336'),
        ('payroll', '0011_loan'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payslip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField()),
                ('employer_pension', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('tax_paid_year_to_date', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('taxable_earnings_year_to_date', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.Company')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employees.Employee')),
                ('pay_period', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='payroll.PayPeriod')),
                ('transactions', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='payroll.Transactions')),
            ],
            options={
                'ordering': ['date_created'],
            },
        ),
    ]
