from django.test import TestCase

from dispenser.tasks import perform_long_running_operation


class YourAsyncTaskTestCase(TestCase):
    def test_your_async_task(self):
        # Call the Celery shared task synchronously using apply()
        result = perform_long_running_operation.apply(args=(10, 20)).get()

        # Assertions to check the task result
        self.assertEqual(result, 30)
