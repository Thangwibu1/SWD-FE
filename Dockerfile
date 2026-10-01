# Tags must match versions in the backend versions.env.
ARG NODE_IMAGE=node:22.19.0-alpine3.22
ARG NGINX_IMAGE=nginx:1.28.0-alpine3.21

FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --fetch-retries=5
COPY . .
# Same-origin API behind nginx proxy.
ENV VITE_API_BASE_URL=/api/v1 VITE_SSE_BASE_URL=/api/v1
RUN npm run build

FROM ${NGINX_IMAGE} AS runtime
# The entrypoint renders templates/*.template into conf.d/ via envsubst and,
# with NGINX_ENTRYPOINT_LOCAL_RESOLVERS set, exports NGINX_LOCAL_RESOLVERS.
ENV BACKEND_UPSTREAM=backend:4000 NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
