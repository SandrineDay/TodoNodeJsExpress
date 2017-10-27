/**
 * Middle ware Controller
 */
let express = require('express');
let app = express();

class AbstractController{
    constructor(Service) {
        this.routeur = express.Router();
        this.service = require(Service);
        this.routeur.delete('/', (request, response) => {
            this.service.deleteOne(request.body.id, function () {
                response.json({id:request.body.id});
            });
        });
        this.routeur.post('/', (request, response) => {
            let data = request.body;
            this.service.updateOne(data, function (databack) {
                response.json(databack);
            });
        });
        this.routeur.put('/', (request, response) => {
            let data = request.body;
            if (request.body.length && request.body.length > 0) {
                this.service.addMany(data, function (databack) {
                    data.id = databack.insertId;
                    response.json(data);
                });
            } else {
                this.service.addOne(data, function (databack) {
                    data.id = databack.insertId;
                    response.json(data);
                });
            }
        });
        this.routeur.get('/', (request, response) => {
            this.service.selectAll(function (dbData) {
                response.json(dbData); //on récupère le résultat de la fonction du TodoService
            });
        });
        this.routeur.get('/id/:id', (request, response) => {
            let idSaisi = request.params.id;
            this.service.selectOneById(idSaisi, function (selected) {
                console.log(selected);
                response.json(selected);
            });
        });
        this.routeur.get('/title/:title', (request, response) => {
            let titreCherche = request.params.title;
            this.service.selectOneByTitle(titreCherche, function (selected) {
                console.log(selected);
                response.json(selected);
            })
        });
        this.routeur.get('/search/done', (request, response) => {
            this.service.selectCompletedTodos(function (dbData) {
                response.json(dbData); //on récupère le résultat de la fonction du TodoService
            });
            // let titreCherche = request.params.titre;
            // this.service.selectOneByTitle(titreCherche, function (selected) {
            //     console.log(selected);
            //     response.json(selected);
            // })
        });
        this.routeur.get('/search/todos', (request, response) => {
            this.service.selectCurrentTodos(function (dbData) {
                response.json(dbData); //on récupère le résultat de la fonction du TodoService
            });
            // this.service.selectOneByTitle(titreCherche, function (selected) {
            //     console.log(selected);
            //     response.json(selected);
            // })
        });
    }
    getRouteur(){
        return this.routeur;
    }
    getService(){
        console.log('AbstractController - getService');
        return this.service;
    }
}

module.exports.Controller = AbstractController;