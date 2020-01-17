#!/bin/bash
env MYSQL_HOST=localhost MYSQL_USER=root MYSQL_PORT=3306 MYSQL_PASS=MySql@1040secure MYSQL_DB=westflight nodemon app.js
