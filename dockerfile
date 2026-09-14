FROM node:22.5.0-bullseye AS builder
WORKDIR /app
COPY . ./
RUN npm install --force
RUN npm run build

FROM nginx
COPY --from=builder ./app/build /usr/share/nginx/smart-schedule
COPY --from=builder ./app/smart-schedule.conf /etc/nginx/conf.d/default.conf