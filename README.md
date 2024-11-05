# FOEP - Fictional Online Education Platform

FOEP is a modern, fictional online education platform built with [Next.js 14](https://nextjs.org/) and designed to facilitate interactive, real-time education experiences. It includes features such as user authentication, data storage in PostgreSQL, file storage integration with AWS S3, and the ability to send emails. This project is intended to demonstrate advanced usage of modern web technologies and architecture.

## Key Features

- **Next.js 14**: Server-rendered React for optimal performance and scalability.
- **PostgreSQL**: Database to store platform data.
- **AWS S3 / Backblaze B2**: File storage for user content and resources.
- **Authentication**: JWT-based user authentication for secure access control.
- **Responsive UI**: Built with Radix UI and TailwindCSS for modern, responsive design.

## Prerequisites

- **Docker**: FOEP is built to run within a Docker environment.
- **Environment Variables**: Ensure the required environment variables are set as explained in the [Environment Variables](#environment-variables) section.

## Quick Start Guide

1. Clone the repository and navigate to its directory:
    ```bash
    git clone https://github.com/LoV432/foep
    cd foep
    ```

2. **Build the Docker image**:
    ```bash
    docker build -t foep:latest .
    ```

3. **Run FOEP using Docker Compose**: The following Docker Compose configuration is a sample setup; you’ll need to save it in a file (e.g., `docker-compose.yml`) if you don’t already have one.
    ```yaml
    services:
      foep-db:
        image: postgres
        restart: always
        container_name: foep-db
        volumes:
          - ./db:/var/lib/postgresql/data
        environment:
          - POSTGRES_PASSWORD=CHANGE_ME
          - POSTGRES_USER=CHANGE_ME
          - POSTGRES_DB=CHANGE_ME
        networks:
          foep:
            ipv4_address: 172.30.22.10

      foep-front:
        image: foep:latest
        restart: unless-stopped
        environment:
          - JWT_SECRET=CHANGE_ME
          - DB_LINK=postgres://CHANGE_ME:CHANGE_ME@foep-db:5432/CHANGE_ME
          - RESEND_API_KEY=CHANGE_ME
          - EMAIL_DOMAIN=CHANGE_ME
          - HOST_URL=CHANGE_ME
          - B2_APPLICATION_KEY=CHANGE_ME
          - B2_APPLICATION_KEY_ID=CHANGE_ME
          - B2_BUCKET_NAME=CHANGE_ME
          - B2_REGION=CHANGE_ME
          - B2_ENDPOINT=CHANGE_ME
        ports:
          - 3000:3000
        networks:
          foep:
            ipv4_address: 172.30.22.20
        depends_on:
            foep-db

    networks:
      foep:
        name: foep
        driver: bridge
        ipam:
          config:
            - subnet: 172.30.22.0/24
    ```

4. **Start FOEP**:
    ```bash
    docker-compose up -d
    ```

FOEP should now be accessible at `http://localhost:3000`.

## Environment Variables

To ensure the platform functions correctly, set the following environment variables:

| Variable            | Description                                                                                  |
|---------------------|----------------------------------------------------------------------------------------------|
| `JWT_SECRET`        | A secure, minimum 32-character string for JWT authentication.                               |
| `DB_LINK`           | PostgreSQL connection string (e.g., `postgres://username:password@host:port/dbname`).        |
| `RESEND_API_KEY`    | API key from Resend for email service integration.                                          |
| `EMAIL_DOMAIN`      | Domain from which FOEP sends emails, must match the domain registered in Resend.            |
| `HOST_URL`          | The root URL of the platform (e.g., `http://www.example.com`).                              |
| `B2_APPLICATION_KEY`| Backblaze or S3 application key for file storage integration.                                     |
| `B2_APPLICATION_KEY_ID` | Backblaze or S3 application key ID for S3-compatible file storage integration.               |
| `B2_BUCKET_NAME`    | Name of the Backblaze or S3 bucket for storing assets.                                            |
| `B2_REGION`         | The region of the Backblaze or S3 bucket.                                                         |
| `B2_ENDPOINT`       | S3-compatible endpoint for Backblaze or S3 (usually `https://s3.<region>.backblazeb2.com`).       |

### Obtaining Environment Variables

- **JWT_SECRET**: Generate a secure 32+ character string using a password manager or a command like `openssl rand -hex 32`.
- **DB_LINK**: This is your PostgreSQL connection URI. Use `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` from the `docker-compose.yml` to construct this.
- **RESEND_API_KEY**: Sign up at [Resend](https://resend.com/), and create an API key.
- **Backblaze Variables** (`B2_APPLICATION_KEY`, `B2_APPLICATION_KEY_ID`, `B2_BUCKET_NAME`, `B2_REGION`, `B2_ENDPOINT`): Sign up at [Backblaze](https://www.backblaze.com/), create a bucket, and generate API keys.

## Project Structure

- **Next.js Application**: All application logic and UI components are managed by Next.js, including server-side rendering.
- **Dockerfile**: Custom Dockerfile to build and run the Next.js app.
- **Docker Compose**: Example `docker-compose.yml` configuration for seamless setup and deployment with PostgreSQL.
