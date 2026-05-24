FROM nginx:alpine

  # Remove default nginx html
  RUN rm -rf /usr/share/nginx/html/*

  # Copy your static site
  COPY . /usr/share/nginx/html

  # Optional: simple cache/security headers config
  COPY nginx.conf /etc/nginx/conf.d/default.conf

  EXPOSE 80