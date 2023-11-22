#! /bin/bash
git pull
npm install
export ACCESS_TOKEN_SECRET=`aws ssm get-parameter --name "/Zenith/config/prod/accessToken" --with-decryption --output text --query Parameter.Value`
export COOKIE_DOMAIN=`aws ssm get-parameter --name "/KisanMitra/config/prod/cookieDomain" --with-decryption --output text --query Parameter.Value`
export FRONT_END_URL=`aws ssm get-parameter --name "/Zenith/config/prod/frontend" --with-decryption --output text --query Parameter.Value`
export MONGODB_URI=`aws ssm get-parameter --name "/Zenith/config/prod/mondoDB" --with-decryption --output text --query Parameter.Value`
export REFRESH_TOKEN_SECRET=`aws ssm get-parameter --name "/Zenith/config/prod/refreshToken" --with-decryption --output text --query Parameter.Value`
npm start
