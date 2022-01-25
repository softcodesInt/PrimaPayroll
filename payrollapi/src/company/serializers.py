from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Company, CompanyPolicy, LeaveCategory, Leave, Hierarchy, Holiday
from accounts.serializers import UserSerializer
from company.models import TaxTable


class LicenseCodeActivationSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=255)


class CompanySerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('created_by',)

    def get_admin(self, obj):
        if obj.admin:
            return UserSerializer(instance=obj.admin.user).data
        return {}


class ReferenceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name',)


class ReferencePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPolicy
        fields = ('id', 'name')


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.__class__(value, context=self.context)
        return serializer.data


class HierarchySerializer(serializers.ModelSerializer):
    parent = RecursiveSerializer(read_only=True)
    items_count = serializers.ReadOnlyField(source="get_header_items")

    class Meta:
        model = Hierarchy
        fields = ('id', 'name', 'description', 'parent', 'is_active', 'is_header',
                  'created_by', 'company_policy', 'date_created', 'date_updated', 'items_count',)
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True, many=True)
        return super(HierarchySerializer, self).to_representation(instance)

    def validate(self, attrs):
        company_policy = attrs['company_policy']
        name = attrs['name']

        base_check = Hierarchy.objects.filter(company_policy__in=company_policy, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Company structure: '{}' exists. Use a different name.".format(name))
        return attrs


class LeaveCategorySerializer(serializers.ModelSerializer):
    leave_count = serializers.ReadOnlyField(source="get_leave_count")

    class Meta:
        model = LeaveCategory
        fields = ('id',
                  'name',
                  'description',
                  'is_active',
                  'created_by', 'company_policy', 'date_created', 'date_updated', 'leave_count')
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True, many=True)
        return super(LeaveCategorySerializer, self).to_representation(instance)

    def validate(self, attrs):
        company_policy = attrs['company_policy']
        name = attrs['name']

        base_check = LeaveCategory.objects.filter(company_policy__in=company_policy, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Leave Category: '{}' exists. Use a different name.".format(name))
        return attrs


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ('created_by', 'company',)

    def to_representation(self, instance):
        self.fields['category'] = LeaveCategorySerializer(read_only=True)
        return super(LeaveSerializer, self).to_representation(instance)

    def validate(self, attrs):
        category = attrs['category']
        name = attrs['name']

        base_check = Leave.objects.filter(category__company_policy__in=category.company_policy.values_list('id'),
                                          name=name,
                                          category=category)

        if attrs['is_sick_leave'] and base_check.filter(is_sick_leave=True).exists():
            raise serializers.ValidationError(
                "A sick leave already exists. You cannot have more than one sick leave in the same category")

        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Leave Type: '{}' exists for category '{}'. Use a different name.".format(name, category.name))

        return attrs


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPolicy
        fields = '__all__'
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['company'] = ReferenceCompanySerializer(read_only=True, many=True)
        return super(PolicySerializer, self).to_representation(instance)

    def validate(self, attrs):
        company = attrs['company']
        name = attrs['name']

        base_check = CompanyPolicy.objects.filter(company__in=company, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Company Policy: '{}' exists. Use a different name.".format(name))
        return attrs


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True, many=True)
        return super(HolidaySerializer, self).to_representation(instance)

    def validate(self, attrs):
        company_policy = attrs['company_policy']
        name = attrs['name']

        base_check = Holiday.objects.filter(company_policy__in=company_policy, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Holiday: '{}' exists. Use a different name.".format(name))
        return attrs


class TaxTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTable
        fields = '__all__'
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        return super(TaxTableSerializer, self).to_representation(instance)
