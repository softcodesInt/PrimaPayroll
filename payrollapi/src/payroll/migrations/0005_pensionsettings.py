# Generated by Django 2.2.10 on 2021-12-22 23:33

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0008_auto_20211222_2336'),
        ('payroll', '0004_auto_20211222_2336'),
    ]

    operations = [
        migrations.CreateModel(
            name='PensionSettings',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('employee_rate', models.DecimalField(decimal_places=2, default=8, max_digits=5)),
                ('employer_rate', models.DecimalField(decimal_places=2, default=10, max_digits=5)),
                ('is_active', models.BooleanField(default=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='company.Company')),
                ('payroll_lines', models.ManyToManyField(null=True, to='payroll.PayrollElements')),
            ],
            options={
                'ordering': ['-date_created'],
            },
        ),
    ]
