#!/bin/bash

apt update -y

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

apt install nodejs nginx -y

npm i -g pm2

# apt install git -y
# git clone https://github.com/amcquistan/cdk-codedeploy-greeter-restapi-nodejs.git

cd /home/ubuntu/cdk-codedeploy-greeter-restapi-nodejs/src/greeter-api

npm install

pm2 start greeter-api-server.js

cp greeter-api-proxy.conf /etc/nginx/sites-available/

ln -s /etc/nginx/sites-available/greeter-api-proxy.conf /etc/nginx/sites-enabled/greeter-api-proxy.conf
rm /etc/nginx/sites-enabled/default

systemctl restart nginx
