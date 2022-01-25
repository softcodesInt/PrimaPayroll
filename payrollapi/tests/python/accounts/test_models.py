import factory
from django.test import TestCase
from django.utils import timezone

from accounts.models import User, EmploymentInfo, BankInfo


class UserFactory(factory.DjangoModelFactory):
    first_name = 'John'
    last_name = 'Doe'
    is_active = True

    class Meta:
        model = User
        django_get_or_create = ('email',)


class EmploymentInfoFactory(factory.DjangoModelFactory):
    employment_date = timezone.now()
    employee_salary = 12000
    class Meta:
        model = EmploymentInfo
        django_get_or_create = ('status',)


class BankInfoFactory(factory.DjangoModelFactory):
    bank_name = 'Access Bank'
    account_name = 'Raheem Azeez Abiodun'
    bank_code = 1234
    bvn = 1234
    class Meta:
        model = BankInfo
        django_get_or_create = ('account_number',)


class AccountsModelsTests(TestCase):
    def setUp(self):
        self.user = UserFactory.create(email='test@test.com')
        self.employment_info = EmploymentInfoFactory.create(status=EmploymentInfo.EMPLOYMENT_EMPLOYED)
        self.bank_info = BankInfoFactory.create(account_number='012345670')

    def test_unicode(self):
        self.assertEqual(str(self.user), 'test@test.com')

    def test_super_user(self):
        super_user = User.objects.create_superuser(email='email@test.com')
        self.assertEqual(super_user.is_superuser, True)

    def test_user(self):
        user = User.objects.create_user(email='email@test.com',
                                        first_name='user',
                                        last_name='test',
                                        password='test')
        self.assertEqual(user.is_superuser, False)

    def test_get_full_name(self):
        self.assertEqual(self.user.get_full_name(), 'John Doe')

    def test_get_short_name(self):
        self.assertEqual(self.user.get_short_name(), 'John')
