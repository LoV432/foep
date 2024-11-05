FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mv next.config.prod.mjs next.config.mjs

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
ARG JWT_SECRET "THIS-IS-NOT-REAL-THIS-IS-NOT-REAL-THIS-IS-NOT-REAL-THIS-IS-NOT-REAL"
ARG DB_LINK "PG:THIS-IS-NOT-REAL"
ARG B2_APPLICATION_KEY "THIS-IS-NOT-REAL"
ARG B2_APPLICATION_KEY_ID "THIS-IS-NOT-REAL"
ARG B2_BUCKET_NAME "THIS-IS-NOT-REAL"
ARG B2_REGION "THIS-IS-NOT-REAL"
ARG B2_ENDPOINT "THIS-IS-NOT-REAL"


RUN JWT_SECRET=$JWT_SECRET DB_LINK=$DB_LINK \
    B2_APPLICATION_KEY=$B2_APPLICATION_KEY B2_APPLICATION_KEY_ID=$B2_APPLICATION_KEY_ID \
    B2_BUCKET_NAME=$B2_BUCKET_NAME B2_REGION=$B2_REGION B2_ENDPOINT=$B2_ENDPOINT \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/drizzle /migrations/drizzle
RUN mv /migrations/drizzle/package.json /migrations/package.json
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts /migrations/

# Copy entrypoint script and set permissions
COPY entrypoint.sh /app/entrypoint.sh
RUN chown nextjs:nodejs /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
#USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD HOSTNAME="0.0.0.0" node server.js