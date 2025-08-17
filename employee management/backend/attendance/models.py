from django.db import models
from employee.models import Employee  # import Employee from your employee app

class Leave(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('Causal', 'Causal'),
        ('Sick', 'Sick'),
        ('Emergency', 'Emergency'),
        ('Paid', 'Paid'),
        ('Unpaid', 'Unpaid'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    comment = models.TextField(blank=True)
    number_of_days = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True,null=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Pending',
        help_text='Status of the leave request'
    )