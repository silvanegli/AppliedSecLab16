from django.db import models

class Certificate(models.Model):
    user = models.IntegerField(default=0) # todo make foreign key
    name = models.CharField(('cert name'),max_length=100, blank=True)
    cert_path = models.CharField(('path to certificate'),max_length=300, blank=True)
    key_patch = models.CharField(('path to private kay'),max_length=300, blank=True)