# Generated by Django 2.2.10 on 2021-12-23 15:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_auto_20211223_0104'),
        ('company', '0008_auto_20211222_2336'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveApplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('date_updated', models.DateTimeField(auto_now=True, null=True)),
                ('number_of_days', models.IntegerField()),
                ('start_date', models.DateField(null=True)),
                ('end_date', models.DateField(null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employees.Employee')),
                ('leave', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.Leave')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
