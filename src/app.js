import UIController from "./models/UIController";
import ImageElementHandler from "./models/ImageElementHandler";
import Canvas from "./models/Canvas";


var image, c, ui;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    ui = new UIController({canvas: c});

    debugger;
    //previous 'image' was a global
    
    //c.importImageToCanvas(image.getImage() )
});
