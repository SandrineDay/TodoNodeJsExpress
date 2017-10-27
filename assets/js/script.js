$(document).ready(function () {
    let frTimezone = 60000*120;
    // backToTop({duration:5000,start:150,position:'left'});
    $('body').backToTop({
        duration:5000,
        start:150,
        position:'right'
    });
    let setResultTitle = 'Vos projets en cours';
    let searchText = '';
    //récupération et affichage des projets en cours (is_checked=false)
    let requestUrl = "http://localhost:8080/todo/search/todos";
    let requestType = 'GET';
    let requestData = {};
    let savedThis = '';
    ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);

    $('.accueil').click(function (e) {
        let requestUrl = "http://localhost:8080/todo/search/todos";
        let requestType = 'GET';
        let requestData = {};
        let savedThis = $(this);
        setResultTitle = 'Vos projets en cours';
        ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);
    });

    $('#search').keyup(function (e) {
        // récupération et affichage des projets par %titre%
        e.preventDefault();
        setResultTitle = 'Vos projets';
        if(e.key === "Enter" && searchText !== '') {
            searchText = this.value;
            let requestData = {
                title: searchText,
            };
            // requête ajax de recherche du projet
            let requestUrl = 'http://localhost:8080/todo/title/' + searchText;
            let requestType = 'GET';
            let savedThis = $(this);
            ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);
            // raz de l'input de recherche
            $(this).val("");
        } else if(e.key !== "Enter"){
            searchText += e.key;
        }
    });

    $('.all').click(function () {
        setResultTitle = "Vos projets";
        // récupération et affichage des tous les projets
        let requestUrl = 'http://localhost:8080/todo';
        let requestType = 'GET';
        let requestData = {};
        let savedThis = $(this);
        ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);
    });

    $('.done').click(function () {
        setResultTitle = "Vos projets réalisés";
        // récupération et affichage des projets clôturés (is_checked=true)
        let requestUrl = 'http://localhost:8080/todo/search/done';
        let requestType = 'GET';
        let requestData = {};
        let savedThis = $(this);
        ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);
    });

    $('#urgent').change(function() {
        if($(this).is(":checked")) {
            console.log("Is checked");
            $('#urgent').val('on');
            $('.switch-on').css({'color':'#c06c84','font-weight':'bold','font-size':'larger'});
            $('.switch-off').css('font-weight','normal');

        }
        else {
            console.log("Is Not checked");
            $('#urgent').val('off');
            $('.switch-on').css({'color':'#5a5050','font-weight':'normal','font-size':'inherit'});
            $('.switch-off').css('font-weight','bold');
        }
    });

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        format: 'dd-mm-yyyy',
        closeOnSelect: false // Close upon selecting a date,
    });

    $('#btnAdd').click(function (e) {
        e.preventDefault();
        // si mode modif, restaurer le bouton "add"
        if($(this).find('i').html() === "check"){
            $(this).find('i').html('add').css('background-color','#3eaca8');
        }
        // récupération des valeurs du formulaire
        let idModif = $('#iDTodo').val();
        let titleInput = $('#title').val();
        let bodyInput = $('#body').val();
        let urgentInput = $('#urgent').prop('checked');         // true or false

        console.log('btnAdd urgentInput = ', urgentInput, ' typeof = ',typeof(urgentInput) );

        let checkInput = $('#check').val();         // 0 or 1

        console.log('btnAdd checkInput = ', checkInput);

        if(checkInput === '1'){
            checkInput = true;
        } else if(checkInput === '0'){
            checkInput = false;
        }

        let deadlineInput = $('#deadline').val();   // format jj-mm-aaaa si mode modification

        // test si deadline a été modifiée ou non:
        // si oui, format Date Picker aaaa-mm-jj, si non format html affiché jj-mm-aaaa à remettre dans le format aaaa-mm-jj avant la mise en db
        // on teste sur la présence éventuelle du "-" en 3ème position du champ
        let wDate = deadlineInput;
        if(deadlineInput.substr(2,1) === "-"){
            deadlineInput = wDate.substr(6,4) + "-" + wDate.substr(3,2) + "-" + wDate.substr(0,2);
        }

        // contrôle des inputs : les champs title, body et deadline sont obligatoires
        verifyTodo($('#title'));
        verifyTodo($('#body'));
        verifyTodo($('#deadline'));

        // test si mode ajout ou modif
        if(idModif !== "" && titleInput !== "" && bodyInput !== ""){
            // idModif != "" => on est en mode modification d'une todo

            console.log('btnAdd / mode modif');

            resetMessage($('#title'));
            resetMessage($('#body'));
            resetMessage($('#deadline'));

            let modifiedDate = new Date(Date.parse(new Date())+frTimezone).toISOString();
            let requestData = {
                id: idModif,
                title: titleInput,
                body: bodyInput,
                is_urgent:urgentInput,
                deadline:deadlineInput,
                is_checked:checkInput,
                modified_at:modifiedDate
            };

            console.log('btnAdd / modif / requestData = ', requestData);

            let requestUrl = 'http://localhost:8080/todo';
            let requestType = "POST";
            let savedThis = '';
            // requête ajax de modification de la tâche saisie dans le formulaire
            $.ajax({
                type: "POST",
                url : 'http://localhost:8080/todo',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function (/*retour de la reponse du controller*/ dataFromServer) {
                    // rafraîchir la liste des todos
                    let rowTache = $('.rowTache[data-id='+requestData.id+ ']');
                    // si le projet est urgent, ajouter l'icône "access_alarm"
                    if(requestData.is_urgent === true) {
                        rowTache.find($('td')).first().find('i').html('access_alarm');
                        rowTache.find('td.urgent').html("1");
                    } else {
                        rowTache.find($('td')).first().find('i').html('');
                        rowTache.find('td.urgent').html("0");
                    }
                    rowTache.find('td.nom').html(requestData.title);
                    rowTache.find('td.libelle').html(requestData.body);
                    let displayDate = '';
                    if(requestData.deadline !== ''){
                        displayDate = requestData.deadline.substr(8,2) + "-" + requestData.deadline.substr(5,2) + "-" + requestData.deadline.substr(0,4);
                    }
                    rowTache.find('td.deadline').html(displayDate);
                    rowTache.find('td.iDTodo').html(requestData.id);
                    rowTache.find('td.check').html(requestData.is_checked);

                    // vider les inputs
                    $('#title').val("");
                    $('#body').val("");
                    $('#deadline').val("");
                    $('#urgent').prop('checked',false).change();
                },
                error: function () {
                    alert("error post ")
                }
            });
        } else if(idModif === "" && titleInput !== "" && bodyInput !== ""){
            // idModif = "" => on est en mode création d'une todo

            console.log('btnAdd / mode ajout');

            resetMessage($('#title'));
            resetMessage($('#body'));
            resetMessage($('#deadline'));

            let createdDate = new Date(Date.parse(new Date())+frTimezone).toISOString();
            // requête ajax d'insertion de la nouvelle tâche saisie dans le formulaire
            let requestData = {
                title: titleInput,
                body: bodyInput,
                is_urgent:urgentInput,
                deadline:deadlineInput,
                is_checked:false,
                created_at:createdDate,
                modified_at:createdDate
            };

            console.log('btnAdd / mode ajout / requestData =  '+requestData);

            let requestType = "PUT";
            let requestUrl = '/todo';
            let savedThis = '';
            setResultTitle = "none";
            ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle);
        }
    });
});

    function ajaxRequest(requestType,requestUrl,requestData,savedThis,setResultTitle){
        $.ajax({
            url: requestUrl,
            type: requestType,
            dataType: 'json',
            accept: 'application/json',
            data:requestData,
            success: function (dataFromServer, success, XMLHttpRequest) {
                switch(requestType){
                    case "GET":
                        if(setResultTitle === 'Votre projet en détail'){

                            console.log('ajaxRequest / get / id / dataFromServer = ', dataFromServer);

                            displayDetails(dataFromServer,setResultTitle);
                        } else {
                            displayTodos(dataFromServer, requestType,setResultTitle);
                        }
                        break;
                    case "DELETE":
                        $(savedThis).parent().parent().hide();
                        break;
                    case "POST":
                        console.log('post / requestData.is_checked = ', requestData.is_checked);
                        if(requestData.is_checked === "1"){
                            iconeStatus = 'done';
                            $(savedThis).find('.is_checked').html(iconeStatus);
                        } else if(requestData.is_checked === "0"){
                            iconeStatus = 'check_box_outline_blank';
                            $(savedThis).find('.is_checked').html(iconeStatus);
                        }
                        break;
                    case "PUT":
                        // vider les inputs
                        $('#title').val("");
                        $('#body').val("");
                        $('#deadline').val("");
                        $('#urgent').prop('checked',false).change();
                        // ajouter la nouvelle tâche à la liste

                        console.log('ajaxRequest / put success / dataFromServer = ',dataFromServer, ' requestType = ', requestType);

                        displayTodos(dataFromServer,requestType,setResultTitle);
                        break;
                    default:
                        alert("error ", requestType);
                }
            },
            error: function () {
                //management error
                alert("error ajaxRequest type ", requestType);
            }
        });
    };

    function displayTodos(data,ajaxType,setResultTitle) {

        console.log('displayTodos data = ', data, ' ajaxType = ', ajaxType, ' setResultTitle = ', setResultTitle);

        let html = '';
        if (data.length === 0) {
            setResultTitle = "Aucun projet à afficher";
            $('.resultTitle').html(setResultTitle);
            $('#result').html(html);
        } else {
            //ajout des todos dans le DOM
            html = '<table id="resultTable" class="highlight"><tr>';
            html += '<th></th><th></th><th>Titre</th><th>Description</th><th>Deadline</th><th>Clôturer</th><th>Modifier</th><th>Supprimer</th></tr>';
            if (ajaxType === 'GET') {
                // mode "get" = afficher la liste des todos trouvées
                for (let i = 0; i < data.length; i++) {
                    html += '<tr class="rowTache" data-id="' + data[i].id + '">';
                    if (data[i].is_urgent === 1) {
                        html += '<td class="urgentIcon"><i class="small material-icons bg-darpink">access_alarm</i></td>';
                    } else {
                        html += '<td class="urgentIcon"><i class="small material-icons bg-darpink"></i></td>';
                    }
                    html += '<td><img src="/static/img/todo3.png" alt="" style="width: 50px; height: 50px;"></td>';
                    html += '<td class="nom">' + data[i].title + '</td><td class="libelle">' + data[i].body + '</td>';
                    let displayDate = '';
                    if (data[i].deadline !== '0000-00-00 00:00:00') {
                        displayDate = new Date(Date.parse(new Date(data[i].deadline)) + (60000 * 120)).toISOString();
                        displayDate = displayDate.substr(8, 2) + "-" + displayDate.substr(5, 2) + "-" + displayDate.substr(0, 4);
                    }
                    html += '<td class="deadline">' + displayDate + '</td>';
                    if (data[i].is_checked === 0) {
                        html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnChecked"><i class="material-icons is_checked bg-green">check_box_outline_blank</i></button></td>'
                    } else {
                        html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnChecked"><i class="material-icons is_checked bg-green">done</i></button></td>'
                    }
                    html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnUpdate"><i class="material-icons bg-blue">update</i></button></td>';
                    html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnDelete"><i class="material-icons bg-grey">clear</i></button></td>';
                    html += '<td class="iDTodo" style="display:none">' + data[i].id + '</td>';
                    html += '<td class="check" style="display:none">' + data[i].is_checked + '</td>';
                    html += '<td class="urgent" style="display:none">' + data[i].is_urgent + '</td>';
                }
                html += "</tr></table>";
                $('#result').html(html);
            } else if (ajaxType === 'PUT') {
                // mode "put" = afficher le nouveau projet au début de la liste des todos

                //test si 1er ajout : créer l'entête du tableau et modifier le titre
                if ($('#resultTable').html() === undefined) {
                    $('.resultTitle').html("Vos projets en cours");
                    $('#result').html(html);
                }

                html = '<tr class="rowTache">';
                if (data.is_urgent === "true") {
                    html += '<td><i class="small material-icons bg-darpink">access_alarm</i></td>';
                } else {
                    html += '<td></td>';
                }
                html += '<td><img src="/static/img/todo3.png" alt="" style="width: 50px; height: 50px;"></td>';
                html += '<td class="nom">' + data.title + '</td><td class="libelle" >' + data.body + '</td>';
                let displayDate = '';
                if (data.deadline !== '0000-00-00 00:00:00' && data.deadline !== '') {
                    displayDate = new Date(Date.parse(new Date(data.deadline)) + (60000 * 120)).toISOString();
                    displayDate = displayDate.substr(8, 2) + "-" + displayDate.substr(5, 2) + "-" + displayDate.substr(0, 4);
                }
                html += '<td class="deadline">' + displayDate + '</td>';
                html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnChecked"><i class="material-icons is_checked bg-green">check_box_outline_blank</i></button></td><td><button id="" class="btn-floating btn-large waves-effect waves-light btnUpdate"><i class="material-icons bg-blue">update</i></button></td>';
                html += '<td><button id="" class="btn-floating btn-large waves-effect waves-light btnDelete"><i class="material-icons bg-grey">clear</i></button></td>';
                html += '<td class="iDTodo" style="display:none">' + data.id + '</td>';
                html += '<td class="check" style="display:none">' + data.is_checked + '</td>';
                html += '<td class="urgent" style="display:none">' + data.is_urgent + '</td></td></tr>';
                $(html).insertAfter($('#result').find('table').find('tr').first());
            }

            $('.btnChecked').click(function () {
                // sauvegarde du this (le bouton)
                let thisTodoToBeChecked = this;
                checkTodo(thisTodoToBeChecked);
            });

            $('.btnUpdate').click(function () {
                // sauvegarde du this
                let thisSearchTodo = $(this);
                updateTodo(thisSearchTodo);
            });

            $('.btnDelete').click(function () {
                // sauvegarde du this
                let thisTodoToBeDestroyed = $(this);
                deleteTodo(thisTodoToBeDestroyed);
            });

            $('.rowTache').find('img').mouseover(function () {
                // récupération de l'id du projet survolé
                let idSelected = $(this).parent().parent().find('td.iDTodo').html();
                // recherche du projet dans la db
                let requestData = {
                    id: idSelected,
                };
                // requête ajax de recherche du projet
                let requestUrl = 'http://localhost:8080/todo/id/' + idSelected;
                let requestType = 'GET';
                let savedThis = $(this);
                let setResultTitle = 'Votre projet en détail';
                ajaxRequest(requestType, requestUrl, requestData, savedThis, setResultTitle);

                // // affichage des détails du projet
                // $('#details').css('display', 'block');
                // let html = '<h3>Votre projet en détail</h3>';
                // html += '<p>Titre :</p>';
                // html += '<p>Description :</p>';
                // html += '<p>Urgent ? :</p>';
                // html += '<p>Deadline :</p>';
                // html += '<p>Date de création :</p>';
                // html += '<p>Date de dernière modification :</p>';
                // html += '<p>Ce projet est :</p>';
                // $('#details').html(html);

            });

            $('.rowTache').find('img').mouseout(function () {
                // effacement du détail du projet
                $('#details').css('display', 'none');
            });
        }
        if (setResultTitle !== "none") {
            $('.resultTitle').html(setResultTitle);
        }
    };

    function displayDetails(dataFromServer,setResultTitle ) {

        console.log('displayDetails dataFromServer = ', dataFromServer, ' setResultTitle = ',setResultTitle);
        console.log('displayDetails is_urgent = ', dataFromServer[0].is_urgent, ' typeof = ',typeof(dataFromServer[0].is_urgent) );
        console.log('displayDetails is_checked = ', dataFromServer[0].is_checked, ' typeof = ',typeof(dataFromServer[0].is_checked) );


        // affichage des détails du projet
        $('#details').css('display', 'block');
        let html = '<h3>' + setResultTitle + '</h3>';
        html += '<hr class="hr-yellow">';
        html += '<p>';
        html += '<span class="détailsLabels">Titre : </span>' + dataFromServer[0].title;
        html += '</p><p>';
        html += '<span class="détailsLabels">Description : </span>' + dataFromServer[0].body;
        html += '</p><p>';
        let deadline = dataFromServer[0].deadline.substr(8,2) + "-" + dataFromServer[0].deadline.substr(5,2) + "-" +dataFromServer[0].deadline.substr(0,4);
        html += '<span class="détailsLabels">Deadline : </span>' + deadline;
        let createdAt = dataFromServer[0].created_at.substr(8,2) + "-" + dataFromServer[0].created_at.substr(5,2) + "-" +dataFromServer[0].created_at.substr(0,4);
        html += '</p><p>';
        html += '<span class="détailsLabels">Crée le : </span>' + createdAt;
        html += '</p><p>';
        let modifiedAt = dataFromServer[0].modified_at.substr(8,2) + "-" + dataFromServer[0].modified_at.substr(5,2) + "-" +dataFromServer[0].modified_at.substr(0,4);
        html += '<span class="détailsLabels">Dernière modification le : </span>' + modifiedAt;
        html += '</p><p>';
        if(dataFromServer[0].is_urgent === 1){
            html += 'Ce projet a été classé urgent, ';
        } else {
            html += "Ce projet n'a pas été classé urgent, ";
        }
        if(dataFromServer[0].is_checked === 0){
            html += 'il est en cours de réalisation';
        }else{
            html += 'il est terminé';
        }
        html += '</p>';
        $('#details').html(html);
    }

    function updateTodo(thisSearchTodo) {
        // récupération les infos de l'élément à modifier
        let idSelected = thisSearchTodo.parent().parent().find('.iDTodo').html();
        let titreSelected = thisSearchTodo.parent().parent().find('.nom').html();
        let bodySelected = thisSearchTodo.parent().parent().find('.libelle').html();
        let deadlineSelected = thisSearchTodo.parent().parent().find('.deadline').html();
        // let urgentInput = thisSearchTodo.parent().parent().find('.urgent').prop('checked');         // true or false
        let urgentInput = thisSearchTodo.parent().parent().find('.urgent').html();         // true or false
        // let checkInput = thisSearchTodo.parent().parent().find('.check').prop('checked');         // true or false
        let checkInput = thisSearchTodo.parent().parent().find('.check').html();         // true or false

        // inititaliser les champs du formulaire avec les valeurs récupérées
        $('#iDTodo').val(idSelected);
        $('#title').val(titreSelected);
        $('#body').val(bodySelected);
        $('#deadline').val(deadlineSelected);
        $('#check').val(checkInput);    // pas affiché
        if(urgentInput === "1") {
            $('#urgent').prop('checked',true).change();
        }  else {
            $('#urgent').prop('checked',false).change();
        }

        // changer l'icône du formulaire "add" en "check"
        $('#btnAdd').find('i').html('check').css('background-color','#c06c84');

        // cacher les labels du formulaire
        $('#title').parent().find('label').hide();
        $('#body').parent().find('label').hide();
        $('#deadline').parent().find('label').hide();
        // $('#urgent').parent().find('label').hide();

        //remonter vers le formulaire
        $('#backToTop').click();
    };

    function deleteTodo(thisTodoToBeDestroyed) {
        let setResultTitle = "none";
        // récupération de l'id de l'élément à supprimer
        let iDSelected = $(thisTodoToBeDestroyed).parent().parent().find('.iDTodo').html();
        let requestData = {
            id: iDSelected
        };
        let requestUrl = '/todo';
        let requestType = 'DELETE';
        ajaxRequest(requestType,requestUrl,requestData,thisTodoToBeDestroyed,setResultTitle)
    };

    function checkTodo(thisTodoToBeChecked) {
        let requestType = 'POST';
        let requestUrl = '/todo';
        // récupération de l'élément à checker ou unchecker
        let idSelected = $(thisTodoToBeChecked).parent().parent().find('.iDTodo').html();
        let titreSelected = $(thisTodoToBeChecked).parent().parent().find('.nom').html();
        let bodySelected = $(thisTodoToBeChecked).parent().parent().find('.libelle').html();
        let isChecked = false;
        let iconeStatus = $(thisTodoToBeChecked).find('.is_checked').html();
        if(iconeStatus === 'check_box_outline_blank'){
            // todo à checker à true : req sql pour mettre is_checked = 1 + modifier l'icône à 'done'
            isChecked = "1";
        } else {
            isChecked = "0";
        }
        let urgentSelected = $(thisTodoToBeChecked).parent().parent().find('.urgent').html();
        let deadlineSelected = $(thisTodoToBeChecked).parent().parent().find('.deadline').html();
        let newDeadline = deadlineSelected.substr(6,4)+"-"+deadlineSelected.substr(3,2)+"-"+deadlineSelected.substr(0,2);
        let modifiedDate = new Date().toISOString();
        let requestData = {
            id:idSelected,
            title:titreSelected,
            body:bodySelected,
            is_urgent:urgentSelected,
            deadline:newDeadline,
            is_checked:isChecked,
            modified_at:modifiedDate
        };
        let setResultTitle = "none";
        ajaxRequest(requestType,requestUrl,requestData,thisTodoToBeChecked,setResultTitle);
    };

    function verifyTodo(champ){
        if(champ.val() === ""){ // si le champ est vide
            $('#erreur').css('display', 'block'); // on affiche le message d'erreur
            champ.css({ // on rend le champ rouge
                borderColor : '#c06c84'
            });
        }
    };

    function resetMessage(input){
        input.css({ // on remet le style des champs comme on l'avait défini dans le style CSS
            borderColor : '#ccc'
        });
        $('#erreur').css('display', 'none'); // on prend soin de cacher le message d'erreur
    };


