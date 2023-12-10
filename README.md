# PHONE STORE
A website that provides Point of Sale functionality for the purpose of selling at a retail store of phones and accessories. The users of this web app are salespeople and administrator at a phone store.

## Contributors
* Trịnh Lâm Như - 52100916
* Nguyễn Trọng Đạt - 52100176
* Bùi Thái Ngọc- 52100823

## Guidelines

1. Clone this repository

2. Create file .env in the root directory of the project and add the following environment variables:
```
ENV
PORT
URL
DATABASE_URL
JWT_ACCESS_TOKEN
JWT_REFRESH_TOKEN
JWT_ACCESS_EXPIRES
JWT_REFRESH_EXPIRES
JWT_TOKEN_ACTIVE

#Google
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLIENT_CALLBACK_URL

# SMTP
SMTP_HOST
SMTP_PORT
MAIL
MAIL_PASSWORD
```
3. Run the following command to install dependencies:
```
yarn install
```
4. Run the following command to start the server:
```
yarn start
```
5. Truy cập trình duyệt với đường dẫn: http://localhost:3000
6. Đăng nhập với tài khoản admin:
```
username: admin
password: admin
```
7. Đăng nhập với tài khoản nhân viên:
```
username: staff
password: staff
```
8. Truy cập website với đường dẫn: https://pos.alfiee.tech

## Technologies
<a href="#" target="_blank"> 
    <img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/>
</a>
<a href="#" target="_blank"> 
    <img alt="ExpressJS" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge"/>
</a>
<a href="#" target="_blank"> 
    <img alt="MongoDB" src="https://img.shields.io/badge/mongodb-%2343853D.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
</a>
<a href="#" target="_blank"> 
    <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white"/>
</a>
<a href="#" target="_blank"> 
    <img alt="ReactJS" src="	https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"/>
</a>
