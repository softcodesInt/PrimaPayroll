# Generated by Django 2.2.10 on 2021-12-20 19:27

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0002_auto_20211220_2027'),
        ('utilities', '0001_initial'),
        ('company', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('action', models.CharField(choices=[('CREATE', 'Create'), ('UPDATE', 'Update'), ('DELETE', 'Delete'), ('CHANGE', 'Change'), ('CHANGE', 'Code Activated')], max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('meta', django.contrib.postgres.fields.jsonb.JSONField(max_length=500, null=True)),
                ('blamer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='blamer', to='accounts.AdminUser')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='JobTitleLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('job_title', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='utilities.JobTitle')),
            ],
            bases=('auditlog.baselog',),
        ),
        migrations.CreateModel(
            name='JobGradeLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('job_grade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='utilities.JobGrade')),
            ],
            bases=('auditlog.baselog',),
        ),
        migrations.CreateModel(
            name='ContractNatureLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('contract_nature', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='utilities.ContractNature')),
            ],
            bases=('auditlog.baselog',),
        ),
        migrations.CreateModel(
            name='CompanyLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.Company')),
            ],
            bases=('auditlog.baselog',),
        ),
        migrations.CreateModel(
            name='BankListLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('bank', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='utilities.BankLists')),
            ],
            bases=('auditlog.baselog',),
        ),
        migrations.CreateModel(
            name='AccountLog',
            fields=[
                ('baselog_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='auditlog.BaseLog')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='accounts.AdminUser')),
            ],
            bases=('auditlog.baselog',),
        ),
    ]
