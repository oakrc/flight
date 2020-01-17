#!/bin/bash
apt install -y mysql-server npm >/dev/null 2>/dev/null
cp airports.csv /var/lib/mysql-files/
npm i -g nodemon >/dev/null 2>/dev/null
npm i >/dev/null 2>/dev/null
