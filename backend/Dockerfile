# Use official Python slim image
FROM python:3.11-slim
 
# Set working directory
WORKDIR /app
 
# Install dependencies first (for layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy application code
COPY . .
 
# Expose the Flask port
EXPOSE 5000
 
# Run with gunicorn in production; falls back to Flask dev server
CMD ["python", "app.py"]