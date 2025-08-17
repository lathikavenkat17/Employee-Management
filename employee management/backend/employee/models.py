from django.db import models

class Employee(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    birthday = models.DateField()
    country = models.CharField(max_length=100)
    university = models.CharField(max_length=200)
    degree = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    message = models.TextField(blank=True)
    role = models.CharField(max_length=100,blank=True)
    password = models.CharField(max_length=100,blank=True,null=True)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"
