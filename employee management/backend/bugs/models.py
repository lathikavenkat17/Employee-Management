from django.db import models
from employee.models import Employee
from task.models import TaskDetails

class BugDetails(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Resolved', 'Resolved'),
        ('Reopened', 'Reopened'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    task = models.ForeignKey(TaskDetails, on_delete=models.CASCADE, related_name='bugs')
    title = models.CharField(max_length=100)
    description = models.TextField()
    assigned_to = models.ManyToManyField(Employee, related_name='developer_tasks')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    comments = models.TextField(blank=True, null=True)
    assigned_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='assigned_task')

class BugImage(models.Model):
    bug = models.ForeignKey(BugDetails, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='bug_images/')

class BugHistory(models.Model):
    bug = models.ForeignKey(BugDetails, on_delete=models.CASCADE, related_name='history')
    name = models.CharField(max_length=100, default="Anonymous")
    role = models.CharField(max_length=50, default="unknown")   
    title = models.CharField(max_length=200, default='Unknown Title')
    status = models.CharField(max_length=20, choices=BugDetails.STATUS_CHOICES)
    comments = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.bug.title} - {self.status} at {self.timestamp}"

class BugHistoryImage(models.Model):
    bug_history = models.ForeignKey(BugHistory, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='bug_history_images/')

    def __str__(self):
        return f"Image for history of bug {self.bug_history.bug.title} at {self.bug_history.timestamp}"
