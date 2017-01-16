require.config({
    baseUrl: 'app',
    paths: {
        jquery:       'libs/vendor/jquery-2.0.3.min',
        rAF:          'libs/vendor/rAF',
        json:         'libs/vendor/json-0.3.1',
        underscore:   'libs/vendor/lodash-3.1.0.min',
        backbone:     'libs/vendor/backbone-1.1.2.min',
        backbonenested:'libs/vendor/backbone-nested-2.0.1',
        videojs:      'libs/vendor/videojs-4.12.5.min',
        howl:         'libs/vendor/howler-2.0-beta.min',
        text:         'libs/vendor/text-2.0.10',
        fastclick:    'libs/vendor/fastclick.min',
        tweenmax:     'libs/vendor/TweenMax-1.15.1.min',
        mapbox:       'libs/vendor/mapbox-2.1.2.min',
        matchmedia:   'libs/vendor/matchmedia',
        models:       'models',
        views:        'views',
        utils:        'utils',
        conf:         'conf',
        templates:    '../templates',
        content:      '../content'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
            init: function() {
                Backbone.$ = window.$;
            }
        },
        'underscore': {
            exports: '_'
        }
    },
    waitSeconds: 0
});


define(['jquery',
        'underscore',
        'backbone',
        'fastclick',
        'utils/Logger',
        'routers/router',
        'rAF',
        'backbonenested',
        'videojs',
        'matchmedia'], function($, _,
                            Backbone,
                            FastClick,
                            LOGGER,
                            Router) {

    $(document).ready(function() {

         //Fast click
        FastClick.attach(document.body);

        //Instantiate Router
        var router = new Router();

        //Start app Router
        Backbone.history.start();

        //Videojs config
        videojs.options.flash.swf = "app/libs/vendor/video-js.swf";
        
    });

});