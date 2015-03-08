import Canvas from "./models/Canvas";
import UIController from "./models/UIController";

// @todo - rename as 'BootstrapCanvas' and make a jQuery plugin
class API{
    constructor(options){

        if (typeof options.target === "undefined") throw "Required property in option object missing: `target`";

        let DEFAULT_WIDTH = 800; //px
        let DEFAULT_HEIGHT = 300; //px
        let CANVAS_WIDTH_DIFFERENCE = 300; //diff between the container width and canvas width;
        
        var width = options.width ? options.width : DEFAULT_WIDTH;
        var height = options.height? options.height : DEFAULT_HEIGHT;


        this.$container = $('#' + options.target);

        var canvasWidth =  width - CANVAS_WIDTH_DIFFERENCE;
        var canvasHeight = height;

        var canvasTemplate = `<canvas id="es6-bootstrap-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
        this.$container.append(canvasTemplate);
        this.$container.css(
            {'margin-bottom' : '175px',
            'position' : 'relative',
        });
        this.canvas = new Canvas('es6-bootstrap-canvas');
        this.ui = new UIController({canvas: this.canvas, container: this.$container, layerWidth: CANVAS_WIDTH_DIFFERENCE});

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
}



document.addEventListener("DOMContentLoaded", function(event) { 
    window.api = new API({
        target: 'es6-bootstrap-container',
        // defaults:
    });
});
