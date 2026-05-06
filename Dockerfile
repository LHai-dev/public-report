FROM node:22.18.0-alpine AS builder

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app
# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .


ARG DATABASE_URL
ARG SKIP_ENV_VALIDATION=true

ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}
ENV DATABASE_URL=${DATABASE_URL}

# Building app
RUN npm run build

# Copy only standalone server to new image
FROM node:22.18.0-alpine
WORKDIR /app

# Install nginx for better static file serving (optional)
# RUN apk add --no-cache nginx

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]