let { dbManager } = require('../conf/db');
let mysql = require('mysql');
// let moment = require('../conf/moment');

class TodoService{

    static selectAll(callback){
        let dbModule = new dbManager();
        // dbModule.query("select * from todolist ORDER BY id DESC;", function (err,rows) {
        dbModule.query("select * from todolist ORDER BY is_urgent DESC, deadline;", function (err,rows) {
            if(err){throw  err;}
            console.log('selectAll rows = ',rows);
            callback(rows);     // on renvoie le résultat vers la fonction d'appel du TodoController
            });
        dbModule.end();
    }

    static selectOneById(idSaisi,callback){
        let dbModule = new dbManager();
        dbModule.query("select * from todolist where id=?;", [idSaisi], function (err,row) {
            if(err){throw  err;}
            callback(row);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    static selectOneByTitle(title,callback){
        let dbModule = new dbManager();
        dbModule.query("select * from todolist where title like ? ORDER BY is_urgent DESC, deadline;", ["%"+title+"%"], function (err,row) {
            if(err){throw  err;}
            callback(row);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    };

    static selectCurrentTodos(callback){
        let dbModule = new dbManager();
        dbModule.query("select * from todolist where is_checked=false ORDER BY is_urgent DESC, deadline;", function (err,rows) {
            if(err){throw  err;}
            console.log('selectCurrentTodos rows = ', rows);
            callback(rows);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    static selectCompletedTodos(callback){
        let dbModule = new dbManager();
        dbModule.query("select * from todolist where is_checked=true ORDER BY id;", function (err,rows) {
            if(err){throw  err;}
            console.log('selectCompletedTodos rows = ', rows);
            callback(rows);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    static addOne(data, callback){
        console.log("addOne data = ", data);
        let dbModule = new dbManager();
        let isUrgent = false;
        if(data.is_urgent === "true"){
            isUrgent = true;
        }
        dbModule.query("INSERT INTO todolist SET title=?, body=?, is_urgent=?, deadline=?, is_checked=?, created_at=?, modified_at=?;", [data.title, data.body, isUrgent, data.deadline, data.is_checked, data.created_at, data.modified_at], function (err,insertResult) {
            if(err){throw  err;}
            callback(insertResult);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    // static addMany(data,callback){
    //     let sqlStr = [];
    //     for(let i=0; i<data.length; i++){
    //         let str = mysql.format("( ?, ?)",[data[i].titre,data[i].body]);
    //         sqlStr.push(str);
    //     }
    //     console.log(sqlStr.join(' , '));
    //     let dbModule = new dbManager();
    //     dbModule.query("INSERT INTO todolist (titre,body) VALUES" + sqlStr.join(' , ') + ";", data, function (err,insertResult) {
    //         if(err){throw err;}
    //         callback(insertResult);
    //     });
    //     dbModule.end();
    // }
    static deleteOne(id, callback){
        console.log('deleteOne, id = ', id);
        let dbModule = new dbManager();
        dbModule.query("DELETE FROM todolist where id=?;", [id], function (err,deleteResult) {
            if(err){
                console.log('error deleteOne : error ', err);
                throw err;
            }
            callback(deleteResult);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }

    // static deleteMany(ids, callback){
    //     let dbModule = new dbManager();
    //     dbModule.query("DELETE FROM todolist where id in ( ? );", [ids], function (err,deleteResult) {
    //         if(err){throw err;}
    //         callback(deleteResult);
    //     });
    //     dbModule.end();
    // }

    static updateOne(data,callback){
        let dbModule = new dbManager();
        console.log("updateOne data = ", data);
        dbModule.query("UPDATE todolist SET title=?, body=?, is_urgent=?, deadline=?, is_checked=?, modified_at=? where id=?;", [data.title, data.body, data.is_urgent, data.deadline, data.is_checked, data.modified_at, data.id], function (err,updateResult) {
            if(err){throw err;}
            callback(updateResult);     // on renvoie le résultat vers la fonction d'appel du TodoController
        });
        dbModule.end();
    }
}

module.exports = TodoService;