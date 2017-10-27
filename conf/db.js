let mysql = require('mysql');
let c = require('./conf');

// if(c.env == "dev") connection.connect();
// module.exports = connection;

let dbManager = class databaseManager{
    constructor(){
        this.connection = mysql.createConnection({
            host     : c.db.server,
            user     : c.db.user,
            port     : c.db.port,
            password : c.db.password,
            database : c.db.database
        });
        this.connection.connect();
    }
    query(a,b,c){
        // this.connection.query(arguments[0],arguments[1],arguments[2]);
        this.connection.query(a,b,c);
    }

    /**
     * @deprecated
     */
    connect(){
        this.connection.connect();
    }
    end(){
        this.connection.end();
    }
};

module.exports.dbManager = dbManager;