import Canvas from "./models/Canvas";
import UIController from "./models/UIController";

// @todo - rename as 'BootstrapCanvas' and make a jQuery plugin
class API{
    constructor(targetElement, options){

        let CANVAS_WIDTH_DIFFERENCE = 300; //diff between the container width and canvas width;

        this.$container = $(targetElement);

        var canvasWidth =  options.width - CANVAS_WIDTH_DIFFERENCE;
        var canvasHeight = options.height;

        var canvasTemplate = `<canvas id="es6-bootstrap-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
        this.$container.append(canvasTemplate);
        this.$container.css(
            {'margin-bottom' : '175px',
            'position' : 'relative',
        });
        this.canvas = new Canvas('es6-bootstrap-canvas');
        this.ui = new UIController({canvas: this.canvas, container: this.$container, layerWidth: CANVAS_WIDTH_DIFFERENCE, layerHeight: options.height});

        //todo, refactor this tight coupling out
        //right now it's needed for canvas.importImageToCanvas calling ui.drawImagesList
        this.canvas.ui = this.ui; 


        window.canvas = this.canvas; //DEBUGGING
    }

    // @TODO Make sure it actually attaches image data!
    // refactor: passing in a string that conforms to jQuery's selector API is weird.  
    // Think of something better.
    attachToForm(formSelector, inputName = 'es6-bootstrap-canvas'){
        var $form = $(formSelector);
        var png = this.canvas.saveToPNG();

        //todo, verify that below works.
        var input = `<input type='hidden' name='${inputName}' value=${png}>`;
        console.log(input);
        
        //todo: check if it exists first and clears - make sure no duplicates occur.
        $form.append(input);
    }

    ajax(url, name = 'es6-bootstrap-canvas'){
        $.post(url, {name : this.canvas.saveToPNG() } )
    }

    //todo: 
    //  1. Make sure that the format of the API takes arguments as
    //     jquerySelector, {options}
    //  
    //  2. Find a way to properly pass in jQuery.
    // 
    _attachTojQuery($ = undefined){
        
        //THIS IF STATEMENT IS UNTESTED
        if (typeof $ === undefined){
            throw "Bootstrap Canvas needs jQuery to be loaded before being instantiated.  jQuery not found.";
        }

        $.fn.bootstrapCanvas = function(){
            return this;
        }
    }
}



document.addEventListener("DOMContentLoaded", function(event) { 

    /**
     * IMMEDIATE NEXT STEPS:
     *
     * Change name to 'BootstrapCanvas'
     * Change API to be more like Bootstraps
     *     $('div').bootstrapCanvas() //call with defaults
     *     $('div').bootstrapCanvas({width: 500, height: 500}) //set some vars.
     *
     *     Extra:
     *     $('div').bootstrapCanvas('action') //executes action on pre-existing creation
     *
     * http://getbootstrap.com/javascript/
     */
    

    ;(function ( $, window, document, undefined ) {
 
        // undefined is used here as the undefined global
        // variable in ECMAScript 3 and is mutable (i.e. it can
        // be changed by someone else). undefined isn't really
        // being passed in so we can ensure that its value is
        // truly undefined. In ES5, undefined can no longer be
        // modified.
     
        // window and document are passed through as local
        // variables rather than as globals, because this (slightly)
        // quickens the resolution process and can be more
        // efficiently minified (especially when both are
        // regularly referenced in our plugin).
     
        // Create the defaults once
        var pluginName = "bootstrapCanvas",
            defaults = {
                'width': "800",
                'height': '300'
            };
     
        // The actual plugin constructor
        function Plugin( element, options ) {
            this.element = element;
     
            // jQuery has an extend method that merges the
            // contents of two or more objects, storing the
            // result in the first object. The first object
            // is generally empty because we don't want to alter
            // the default options for future instances of the plugin
            this.options = $.extend( {}, defaults, options) ;
     
            this._defaults = defaults;
            this._name = pluginName;
     
            this.init();
        }
     
        Plugin.prototype.init = function () {
            window.apiInstance = new API(this.element, this.options); 
            // Place initialization logic here
            // We already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
        };
     
        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if ( !$.data(this, "plugin_" + pluginName )) {
                    $.data( this, "plugin_" + pluginName,
                    new Plugin( this, options ));
                }
            });
        }
 
    })( jQuery, window, document );
    


     // (function( $ ){
     //    $.fn.bootstrapCanvas = API;
     //   // $.fn.bootstrapCanvas = function () {
         
     //   // };
     // })( jQuery );

    // window.api = new API({
    //     target: 'es6-bootstrap-container',
    //     // defaults:
    // });
    $('#es6-bootstrap-container').bootstrapCanvas()
});
