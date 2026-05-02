FROM python:3.8-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Only needs this for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn
COPY . .
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "django_project.wsgi"]