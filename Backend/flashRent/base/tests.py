from django.test import TestCase, override_settings
from django.core import mail
from base.models import MaintenanceRequest, Property, Tenant, User
from base.emails import send_completion_email
from django.contrib.auth.models import User
from datetime import date

class EmailTests(TestCase):
    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_send_completion_email(self):
        # Set up a sample property, tenant, and maintenance request
        user = User.objects.create(username='testuser', email='omarhemed94@gmail .com', password='password')
        property = Property.objects.create(name='Test Property')
        tenant = Tenant.objects.create(user=user, property=property, lease_start=date.today(), lease_end=date.today())
        maintenance_request = MaintenanceRequest.objects.create(
            property=property,
            issue='Sample issue',
            description='Sample description',
            tenant=tenant,
            completed_date='2024-07-16'
        )

        # Call the email function
        send_completion_email(maintenance_request)

        # Check that one message has been sent
        self.assertEqual(len(mail.outbox), 1)

        # Verify email details
        email = mail.outbox[0]
        self.assertEqual(email.subject, 'Maintenance Request Completed')
        self.assertIn('Your maintenance request for', email.body)
        self.assertIn(maintenance_request.property.name, email.body)
        self.assertIn(str(maintenance_request.completed_date), email.body)
        self.assertEqual(email.to, [maintenance_request.tenant.user.email])


