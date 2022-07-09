FROM php:7.4.9-apache

# Install packages
RUN apt update
RUN apt install -y git libz-dev mlocate netcat nmap tree vim libxml2-dev libcurl4-gnutls-dev

# Install PHP extensions
RUN docker-php-ext-install pcntl

# Set up aliases
RUN echo "alias ll='ls -al --color'" >>/root/.bashrc

# Enable Apache 2 rewrite mod
RUN a2enmod rewrite

# Update the document root
RUN sed -i 's!/var/www/html!/var/www/vampire-survivors-tools/src!g' /etc/apache2/sites-available/000-default.conf

# Update some Linux file system index thing
RUN updatedb
