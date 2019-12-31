#!/bin/bash
echo 'Using sudo to move files...'
sudo echo 'Thanks!'
sudo apt install mysql-server
sudo cp airports.csv /var/lib/mysql-files/
