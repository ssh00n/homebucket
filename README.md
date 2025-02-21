# homebucket

# Build Docker Image
docker build -t homebucket .

# Run Container
docker run -d -p ${port}:${port} homebucket
