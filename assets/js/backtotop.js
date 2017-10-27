function backToTopPlugin($) {
    $.fn.backToTop = function (options) {
        // initialisation des valeurs par défaut (si pas d'options passées)
        let defaults = {
            duration: 500,            // en secondes
            start: 80,                // en px
            position:'right'
        };
        let conf = $.extend(defaults, options);
        // ajout de la div contenant la flèche
        this.append('<div id="backToTop"><img src="/static/img/backtotop_75_brown.png"</div>');
        // cacher la flèche
        $('#backToTop').css(conf.position,'10px');
        _showHideOnScroll(conf.start);

        // ajouter l'évenement scroll : on affiche ou on cache la flèche selon la position du scroll
        $(window).scroll(function () {
            _showHideOnScroll(conf.start);
        });

        // ajouter l'évenement clic : remonter en haut de la page
        $('#backToTop').click(function () {
            let ratio = $(window).scrollTop() / $('body').height();
            // let ratio = $(window).scrollTop() / $('.container').height();
            $("html,body").animate({"scrollTop":0},ratio*conf.duration);            // position d'arrivée et vitesse de défilement
            // $("html,body").animate({scrollTop:'80px'},ratio*conf.duration);        // position d'arrivée et vitesse de défilement
            $('#backToTop').animate({bottom: '87%'}, ratio*conf.duration);
        });
        return this;
    };

    function _showHideOnScroll(start) {                  // on utilise _ pour préciser que la fonction est privée
        if($(window).scrollTop()> start){
            // on affiche la flèche
            $('#backToTop').fadeIn("slow");
        } else {
            // on la cache et on la fait redescendre
            $('#backToTop').fadeOut("slow");
            $('#backToTop').css("bottom",'80px');
        }
    }
}

backToTopPlugin($);