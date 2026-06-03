# PHP 8.3 FPM Installation Guide on Ubuntu 26.04 (Resolute)

> **Context:** Ubuntu 26.04 "Resolute" is too new for the Ondřej PPA and official PHP 8.3 apt packages.
> This guide uses **phpbrew** to compile PHP 8.3 from source with FPM support for use with Nginx + Drupal.

---

## Prerequisites

### Install all build dependencies upfront

```bash
sudo apt install -y \
  build-essential autoconf \
  libxml2-dev libssl-dev libcurl4-openssl-dev \
  libpng-dev libjpeg-dev libonig-dev libzip-dev \
  libsqlite3-dev pkg-config libbz2-dev \
  libreadline-dev libgd-dev libwebp-dev \
  libfreetype6-dev libjpeg-turbo8-dev \
  libintl-perl libicu-dev libxslt1-dev \
  libgmp-dev libtidy-dev libsasl2-dev \
  libldap2-dev libkrb5-dev libargon2-dev \
  libsodium-dev libsystemd-dev libpcre2-dev \
  libmysqlclient-dev default-libmysqlclient-dev \
  re2c software-properties-common curl
```

---

## Step 1: Install phpbrew

```bash
curl -L -O https://github.com/phpbrew/phpbrew/releases/latest/download/phpbrew.phar
chmod +x phpbrew.phar
sudo mv phpbrew.phar /usr/local/bin/phpbrew
```

### Initialize phpbrew

```bash
phpbrew init
echo '[[ -e ~/.phpbrew/bashrc ]] && source ~/.phpbrew/bashrc' >> ~/.bashrc
source ~/.bashrc
```

---

## Step 2: Build PHP 8.3 with FPM and MySQL support

> This takes approximately **20 minutes**.

```bash
phpbrew install 8.3 +default +fpm +mysql +pdo
```

### What each variant provides:
| Variant | Purpose |
|---------|---------|
| `+default` | Common extensions (mbstring, curl, openssl, etc.) |
| `+fpm` | PHP-FPM process manager for Nginx |
| `+mysql` | MySQLi, mysqlnd drivers |
| `+pdo` | PDO base + pdo_mysql (required by Drupal) |

---

## Step 3: Switch to PHP 8.3

```bash
phpbrew switch php-8.3.31
source ~/.bashrc
php -v
```

Expected output:
```
PHP 8.3.31 (cli) (built: ...)
```

---

## Step 4: Configure PHP-FPM

### Edit www.conf to set correct socket path

```bash
nano ~/.phpbrew/php/php-8.3.31/etc/php-fpm.d/www.conf
```

Set the following values:

```ini
user = www-data
group = www-data
listen = /run/php/php8.3-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
```

---

## Step 5: Create socket directory and start FPM

```bash
sudo mkdir -p /run/php
sudo systemctl start php83-fpm 2>/dev/null || \
  sudo ~/.phpbrew/php/php-8.3.31/sbin/php-fpm \
    --fpm-config ~/.phpbrew/php/php-8.3.31/etc/php-fpm.conf \
    --daemonize
```

### Verify socket exists

```bash
ls -la /run/php/php8.3-fpm.sock
```

---

## Step 6: Create systemd service for auto-start on reboot

```bash
sudo tee /etc/systemd/system/php83-fpm.service > /dev/null <<EOF
[Unit]
Description=PHP 8.3 FPM (phpbrew)
After=network.target

[Service]
Type=forking
ExecStart=/home/ubuntu/.phpbrew/php/php-8.3.31/sbin/php-fpm \
  --fpm-config /home/ubuntu/.phpbrew/php/php-8.3.31/etc/php-fpm.conf \
  --daemonize
ExecReload=/bin/kill -USR2 \$MAINPID
PIDFile=/home/ubuntu/.phpbrew/php/php-8.3.31/var/run/php-fpm.pid
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable php83-fpm
sudo systemctl restart php83-fpm
sudo systemctl status php83-fpm
```

---

## Step 7: Update Nginx to use PHP 8.3 FPM

Edit your Drupal backend Nginx config:

```bash
sudo nano /etc/nginx/sites-available/balbharatisolan-backend
```

Find the `fastcgi_pass` line and update it:

```nginx
# FROM:
fastcgi_pass unix:/run/php/php8.5-fpm.sock;

# TO:
fastcgi_pass unix:/run/php/php8.3-fpm.sock;
```

---

## Step 8: Stop PHP 8.5 FPM and reload Nginx

```bash
sudo systemctl stop php8.5-fpm
sudo systemctl disable php8.5-fpm
sudo nginx -t && sudo systemctl reload nginx
```

---

## Step 9: Verify everything

```bash
# Check PHP version
php -v

# Check required extensions are loaded
~/.phpbrew/php/php-8.3.31/bin/php -m | grep -iE "pdo|mysql"
# Expected: mysqli, mysqlnd, PDO, pdo_mysql

# Check FPM service
sudo systemctl status php83-fpm

# Check socket exists
ls -la /run/php/php8.3-fpm.sock

# Test site response
curl -sk https://your-domain.com/api/ | head -5
```

---

## Troubleshooting

### Socket not found after reboot
`/run/php/` is a tmpfs and gets cleared on reboot. Fix by adding socket dir creation to the systemd service:

```bash
sudo nano /etc/systemd/system/php83-fpm.service
```

Add under `[Service]`:
```ini
ExecStartPre=/bin/mkdir -p /run/php
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl restart php83-fpm
```

### pdo_mysql missing
If `php -m` doesn't show `pdo_mysql`, you built without `+mysql +pdo`. Rebuild:
```bash
phpbrew install 8.3 +default +fpm +mysql +pdo
```

### FPM already running error
```bash
sudo pkill -f php-fpm
sudo rm -f /run/php/php8.3-fpm.sock
sudo rm -f ~/.phpbrew/php/php-8.3.31/var/run/php-fpm.pid
sudo systemctl start php83-fpm
```

### Check FPM logs
```bash
tail -50 ~/.phpbrew/php/php-8.3.31/var/log/php-fpm.log
```

---

## php.ini location

| Purpose | Path |
|---------|------|
| CLI | `~/.phpbrew/php/php-8.3.31/etc/cli/php.ini` |
| FPM | `~/.phpbrew/php/php-8.3.31/etc/fpm/php.ini` |
| FPM pool config | `~/.phpbrew/php/php-8.3.31/etc/php-fpm.d/www.conf` |
