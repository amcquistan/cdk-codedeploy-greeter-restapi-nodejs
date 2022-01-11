#!/bin/bash

apt update -y

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

apt install nodejs git nginx -y

npm i -g pm2

git clone https://github.com/amcquistan/cdk-codedeploy-greeter-restapi-nodejs.git

cd cdk-codedeploy-greeter-restapi-nodejs/src/greeter-api

npm install

pm2 start greeter-api-server.js

