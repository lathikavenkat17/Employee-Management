from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    # meta is builtin 
    class Meta:
        model = Employee
        fields = '__all__'

class EmployeeNameIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'firstName', 'lastName']
