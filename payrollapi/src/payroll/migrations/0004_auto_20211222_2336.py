# Generated by Django 2.2.10 on 2021-12-22 22:36

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0008_auto_20211222_2336'),
        ('payroll', '0003_remuneration'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaxReliefGroup',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('company_policy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='company.CompanyPolicy')),
            ],
            options={
                'ordering': ['-date_created'],
            },
        ),
        migrations.CreateModel(
            name='TaxRelief',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('calculation_type', models.CharField(choices=[('PERCENTAGE', 'Percentage'), ('FIXED', 'Fixed'), ('NONE', 'None')], max_length=15)),
                ('calculation_type_value', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('payroll_lines', models.ManyToManyField(null=True, to='payroll.PayrollElements')),
                ('relief_group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payroll.TaxReliefGroup')),
            ],
            options={
                'ordering': ['-date_created'],
            },
        ),
    ]
