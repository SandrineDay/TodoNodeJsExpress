console.log("express.js loaded");

let express = require('express');
let app = express();
let fs = require('fs');                     // fs = File System
let bodyParse = require("body-parser");     // Charge le middleware de gestion des paramètres
let session = require('express-session');   // Charge le middleware de sessions
let cors = require('cors');                 // cors = Cross Origin Resources Sharing

let todo = require('./controller/TodoController');
let users = require('./controller/UsersController');

//définition du générateur de templates à utiliser
app.set('view engine', 'ejs');

//déclaration des middleware (Controllers)
app.use('/static',express.static('assets'));    //déclaration du répertoire des statics
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(cors());
app.use(session({
    secret: 'keyboard cat and dog and snake',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}));
app.use('/todo', todo);
app.use('/users', users);

//Routes
app.get('/',(request,response)=>{
    console.log('app.get express.js');
    request.session.message = "hello world !";
    request.session.name = "sandrine";
    fs.readFile('assets/index.html', (err,data) => {
        if (err) {
            throw err;
        }
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(data);
    });
});

app.get('/ejs',(request,response)=>{
    //appel du service.selectAll
    let todoService = require("./service/TodoService");
    todoService.selectAll((data)=>{
        response.render("index",{datas:data});
    });
});

app.listen(8080);