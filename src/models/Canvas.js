import UIController from "./UIController";
import ImageCollection from "./imageCollection.js";

class Canvas {
    
   constructor(idOfCanvas){
        this.canvasElement = document.getElementById(idOfCanvas);
        this.ctx = this.canvasElement.getContext("2d");
        this.elements = [];
        this.imageCollection = new ImageCollection();
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.fabric = new fabric.Canvas(idOfCanvas);
        
        this.canvasElement.addEventListener('click', this.canvasClickHandler, false);
        this.ui = new UIController({canvas: this});
   }

   render(){
    this.fabric.setHeight(this.height);
    this.fabric.setWidth(this.width);
    this.fabric.renderAll();
   }

  //@todo / refactor - extend to a 'try/catch', and revert adding it to elements if it doesn't work.
   importImageToCanvas(imageHandler){
        var canvas = this.fabric;
        //By using unshift, we have the newest elements FIRST, which helps with z-index layer logic.
        // this.elements.unshift(imageHandler);
        this.imageCollection.addImage(imageHandler);
        // this.ui.drawImagesList(this.elements)
        this.ui.drawImagesList(this.imageCollection);
        
        var [defaultWidth, defaultHeight] = this.calculateDrawingDefaultDimensions(imageHandler.img);
        [imageHandler.fabric.width, imageHandler.fabric.height] = [defaultWidth, defaultHeight];
        canvas.add(imageHandler.fabric);
        imageHandler.fabric.center();
        imageHandler.fabric.setCoords();
        
   }
   
   calculateDrawingDefaultDimensions(image){
    var imgWidth = image.width;
    var imgHeight = image.height;
    var aspectRatio = imgWidth / imgHeight;
    /**
     * r=w/h
     * w = rh
     * h = w/r
     */

    if (imgWidth <= canvas.width / 2 && imgHeight <= canvas.height / 2){
       return [imgWidth, imgHeight]
    }

    //just calculating off height now.
    //should do another check for width and scale on aspect ratio!
    if (imgHeight > canvas.height / 2){
     imgHeight = canvas.height / 2;
     imgWidth = imgHeight * aspectRatio; //w = hr
    }
    //we want to filter by height first, and only catch cases were width is STILL too long
    if (imgWidth > canvas.width / 2){
      imgWidth = canvas.width / 2;
      imgHeight = imgWidth / aspectRatio; // h = w/r
    }
     return [imgWidth, imgHeight]
   }

   //todo - refactor into an 'ImageCollection' object.
   findImageByName(name){
    // let list = this.elements;
    let list = this.imageCollection;
    return list.filter( x => x.name === name)[0];
   }
}

module.exports = Canvas;