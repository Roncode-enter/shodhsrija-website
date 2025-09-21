#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run Django collectstatic
python manage.py collectstatic --no-input

# Run Django migrations
python manage.py migrate

# Create superuser if it doesn't exist (optional)
# python manage.py shell -c "
# from django.contrib.auth.models import User;
# User.objects.filter(username='admin').exists() or # User.objects.create_superuser('admin', 'admin@shodhsrija.org', 'admin123')
# "

echo "Build completed successfully!"
