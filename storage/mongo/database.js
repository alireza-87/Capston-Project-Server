const mongoDb = require('mongoose')
mongoDb.Promise = global.Promise;

let database = function () {
    let mdb = null;

    function database_connect() {
        try {
            let db_uri;
            if (process.env.NODE_ENV === 'development') {
                db_uri = process.env.DB_CONNECTION_DEV_URL
            }
            if (process.env.NODE_ENV === 'test') {
                db_uri = process.env.DB_CONNECTION_TEST_URL
            }
            if (process.env.NODE_ENV === 'production') {
                db_uri = process.env.DB_CONNECTION_PROD_URL
            }
            //TODO change later it was db_uri
            mongoDb.connect(db_uri,
                {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
                () => {
                    console.log('MonogoDB is connected successfully')
                });
            mdb = mongoDb.connection;
            mdb.on('error', console.error.bind(console, 'connection error:'));
            mdb.once('open', function callback() {
                console.log("database opened ...");
            });
            return mdb
        } catch (e) {
            console.log("database_connect ..." + e);
            return e;
        }
    }


    function get() {
        try {
            if (mdb != null) {
                return mdb;
            } else {
                mdb = new database_connect();
                return mdb;
            }
        } catch (e) {
            console.log("return error " + e)
            return e;
        }
    }

    return {
        get: get
    }
}
module.exports = database();
