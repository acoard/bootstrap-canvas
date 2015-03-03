import Canvas from "./models/Canvas";

class API{
    constructor(options){

        if (typeof options.target === "undefined") throw "Required property in option object missing: `target`";
        
        var width = options.width ? options.width : 600;
        var height = options.height? options.height : 300;

        this.$container = $('#' + options.target);

        var canvasTemplate = `<canvas id="es6-bootstrap-canvas" width="${width}" height="${height}"></canvas>`
        this.$container.append(canvasTemplate);
        this.canvas = new Canvas('es6-bootstrap-canvas');

        window.canvas = this.canvas; //DEBUGGING
    }
}



document.addEventListener("DOMContentLoaded", function(event) { 
    window.api = new API({
        target: 'es6-bootstrap-container',
        // defaults:
        // width: 600,
        // height: 300
    });
    //This is the 'init', and also I've made canvas a global for dev.
    // window.canvas = new Canvas('canvas');
    // window.ImageCollection = ImageCollection;
});
