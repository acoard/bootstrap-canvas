import Canvas from "./models/Canvas";
import ImageCollection from "./models/ImageCollection";

class API{
    constructor(divID){
        this.$container = $('#' + divID);

        var canvasTemplate = `<canvas id="es6-bootstrap-canvas" width="600" height="300"></canvas>`
        this.$container.append(canvasTemplate);
        this.canvas = new Canvas('es6-bootstrap-canvas');

        window.canvas = this.canvas; //DEBUGGING
    }
}



document.addEventListener("DOMContentLoaded", function(event) { 
    window.api = new API('es6-bootstrap-container');
    //This is the 'init', and also I've made canvas a global for dev.
    // window.canvas = new Canvas('canvas');
    // window.ImageCollection = ImageCollection;
});
