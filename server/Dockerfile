# Use the official Bun image
FROM oven/bun:1.1.34-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]