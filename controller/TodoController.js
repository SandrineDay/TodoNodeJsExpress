/**
 * Middle ware Controller pour les todos
 */
let { Controller } = require('./AbstractController');
let TodoControl = new Controller('../service/TodoService');


module.exports = TodoControl.getRouteur();

//
//
// let app = express();
//
// let routeur = express.Router();
// let todoService = require('../service/TodoService');
//
// routeur.get('/',(request,response)=>{
//     console.log(request.session);
//     todoService.selectAll(function (dbData) {
//         // response.send("get all");
//         response.json(dbData); //on récupère le résultat de la fonction du TodoService
//     });
// });
//
// routeur.get('/:id',(request,response)=>{
//     let idSaisi = request.params.id;
//     console.log(idSaisi);
//     todoService.selectOneById(idSaisi,function (selected) {
//         console.log(selected);
//         response.json(selected);
//         // response.send("get one by id ok");
//     });
//     // response.send("get one by id");
// });
//
// //findByTitle
// routeur.get('/search/:titre',(request,response)=>{
//   todoService.findByTitle(request.params.titre,function (selected) {
//       response.json(selected);
//   })
// });
//
// // routeur.put('/',(request,response)=>{
// //     // cas 1 : request.body = {id:5};
// //     // cas 2 : request.body = [{id:5}, {id:2},{id:3}];
// //     // si request.body.length est défini et > 0
// //     if(request.body.length && request.body.length > 0){
// //         // put many
// //         let res=[];
// //         for(let i =0; i<request.body.length; i++){
// //             let data = request.body[i];
// //             todoService.addOne(data,function (p){
// //                 res.push(p);
// //                 if(i==request.body.length-1){
// //                     response.json(res);
// //                 }
// //             });
// //         }
// //         console.log("add many todos");
// //     } else {
// //         console.log(request.body);
// //         let data = request.body;
// //         todoService.addOne(data, function (databack) {
// //             data.id = databack.insertId;
// //             console.log("add one todo");
// //             response.json(data);
// //         });
// //     }
// //     // response.send("add todo");
// // });
//
// routeur.put('/',(request,response)=>{
//     // console.log(request.body);
//     let data = request.body;
//     if(request.body.length && request.body.length > 0) {
//         todoService.addMany(data, function (databack) {
//             data.id = databack.insertId;
//             console.log("add many todo");
//             response.json(data);
//         });
//     } else {
//         todoService.addOne(data, function (databack) {
//             data.id = databack.insertId;
//             console.log("add one todo");
//             response.json(data);
//         });
//     }
// });
//
// routeur.post('/',(request,response)=>{
//     response.send("update todo");
// });
//
// routeur.delete('/',(request,response)=>{
//     // cas 1 : request.body = {id:5};
//     // cas 2 : request.body = [{id:5}, {id:2},{id:3}];
//     // si request.body.length est défini et > 0
//         if(request.body.length && request.body.length > 0){
//         // delete many
//         let ids=[];
//         for(let i =0; i<request.body.length; i++){
//             ids.push(request.body[i].id);
//         }
//         todoService.deleteMany(ids,function (){
//         console.log(arguments[0]);
//         response.send("delete many todos");
//         });
//     } else {
//         innerDelete(request.body.id,response);
//     }
//         // todoService.deleteOne(request.body.id,function (){
//         // console.log(arguments[0]);
//         // response.send("delete one todo");
//         // });
//     // response.send("delete todo");
// });
//
// routeur.delete('/:id',(request,response)=>{
//     innerDelete(request.params.id, response);
//     // todoService.deleteOne(request.params.id);
//     // response.send("delete todo");
// });
//
// // let innerDelete = function (id, response) {      //version EC5
// //    todoService.deleteOne(id,function () {
// //        console.log(arguments[0]);
// //        response.send("delete one todo");
// //    });
// // };
//
// let innerDelete = (id, response) =>{        //version EC6
//     todoService.deleteOne(id,function (){
//     console.log(arguments[0]);
//     response.send("delete one todo");
//     });
// };
//
// module.exports = TodoControl.getRouteur();