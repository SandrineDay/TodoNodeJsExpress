let { dbManager } = require('../conf/db');
let mysql = require('mysql');
class UsersService{
    static selectAll(callback){
        let dbModule = new dbManager();
        dbModule.query("select * from users;", function (err,rows) {
            if(err){throw  err;}
            // dbModule.end();
            callback(rows);     // on renvoie le résultat vers la fonction d'appel du TodoController
            });
        dbModule.end();
    }

    static selectOneById(idSaisi,callback){
        let dbModule = new dbManager();
        dbModule.query("select * from users where id=?;", [idSaisi], function (err,row) {
            if(err){throw  err;}
            callback(row);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    static findByEmail(email,callback){
        let dbModule = new dbManager();
        dbModule.query("select * from users where email like ?;", [email+"%"], function (err,row) {
            if(err){throw  err;}
            callback(row);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    };

    static addOne(data, callback){
        let dbModule = new dbManager();
        dbModule.query("INSERT INTO users SET email=?, password=?;", [data.email, data.password], function (err,insertResult) {
            if(err){throw  err;}
            callback(insertResult);     // on renvoie le résultat vers la fonction d'appel du TodoController
            console.log(data);
        });
        dbModule.end();
    }

    static addMany(data,callback){
        let sqlStr = [];
        for(let i=0; i<data.length; i++){
            let str = mysql.format("( ?, ?)",[data[i].email,data[i].password]);
            sqlStr.push(str);
        }
        console.log(sqlStr.join(' , '));
        let dbModule = new dbManager();
        dbModule.query("INSERT INTO users (email,password) VALUES" + sqlStr.join(' , ') + ";", data, function (err,insertResult) {
            if(err){throw err;}
            callback(insertResult);
        });
        dbModule.end();
    }

    static deleteOne(id, callback){
        let dbModule = new dbManager();
        dbModule.query("DELETE FROM users where id=?;", [id], function (err,deleteResult) {
            if(err){throw err;}
            callback(deleteResult);
        });
        dbModule.end();
    }

    static deleteMany(ids, callback){
        let dbModule = new dbManager();
        dbModule.query("DELETE FROM users where id in ( ? );", [ids], function (err,deleteResult) {
            if(err){throw err;}
            callback(deleteResult);
        });
        dbModule.end();
    }
}

module.exports = UsersService;