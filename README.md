The Backend part of Capston project. This project develop by nodejs+MongoDb
# Setup
- Install Nodejs , MongoDb
- All dependencies included at package.json
```
npm install
```
- Add your .env file in the root of project
```
DB_CONNECTION_DEV_URL=<insert_URI_to_dev_db>
DB_CONNECTION_TEST_URL=<insert_URI_to_test_db>
DB_CONNECTION_PROD_URL=<insert_URI_to_prod_db>
DIR_UPLOAD=YOUR UPLOAD FOLDER ROOT
DOMAIN=SITE DOMAIN FOR IMAGE 
PORT=PortNumber

JWT_SECRET="fff$%Gfgf56rgkfg%ds"
PROTOCOL_LINK="http://localhost:3000/"
EMAIL_USER="your email"
EMAIL_PASS="your email pass"
HOST="if use gmail : smtp.gmail.com"
EMAIL_FROM="smtp.gmail.com"
EMAIL_PORT="465"
NODE_ENV=development

SMS_ACCOUNT_SID="twilio accoutn"
SMS_AUTH_TOKEN="twilio accoutn"
SMS_NUMBER="twilio accoutn"

```
- Run Project with:
```
node start.js
```
- Or (use nodemon):
```
npm run dev:start
```
- For UnitTesting:
```
npm run test
```
