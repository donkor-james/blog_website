FROM python:3.8-alpine
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn
COPY . .
RUN python manage.py collectstatic --noinput
EXPOSE 8000 
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "django_project.wsgi"]