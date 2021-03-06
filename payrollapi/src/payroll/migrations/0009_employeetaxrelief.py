# Generated by Django 2.2.10 on 2021-12-23 11:23

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_auto_20211223_0104'),
        ('payroll', '0008_employeedrivenpayroll'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeTaxRelief',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('value', models.DecimalField(decimal_places=2, max_digits=7)),
                ('is_active', models.BooleanField(default=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employees.Employee')),
                ('tax_relief', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payroll.TaxRelief')),
            ],
            options={
                'ordering': ['date_created'],
            },
        ),
    ]
