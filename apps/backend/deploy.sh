echo "Starting production deployment..."
npm run build

# Build the application
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm test

# Build Docker image
echo "Building Docker image..."
docker build -t backend-api:latest .

# Tag for production
docker tag backend-api:latest backend-api:production

# Push to registry (configure your registry)
# docker push your-registry/backend-api:production

echo "Deployment completed successfully!"
