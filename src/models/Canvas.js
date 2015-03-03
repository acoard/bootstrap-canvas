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
        this.fabric.backgroundColor = '#FFFFFF';
        
        this.canvasElement.addEventListener('click', this.canvasClickHandler, false);
        this.ui = new UIController({canvas: this});


        this.render();
   }

   render(){
    // this.fabric.setHeight(this.height);
    // this.fabric.setWidth(this.width);
    this.fabric.renderAll();
   }


    importImageToCanvas(imageHandler){
      try {      
        var canvas = this.fabric;
        this.imageCollection.addImage(imageHandler);
        this.ui.drawImagesList(this.imageCollection);

        var [defaultWidth, defaultHeight] = this.calculateDrawingDefaultDimensions(imageHandler.img);
        [imageHandler.fabric.width, imageHandler.fabric.height] = [defaultWidth, defaultHeight];
        canvas.add(imageHandler.fabric);
        imageHandler.fabric.center();
        imageHandler.fabric.setCoords();
      }
      catch(ex) {
        imageHandler.remove();
        throw {message: "Could not import image to canvas", exception: ex};
      }
        
   }
   
   calculateDrawingDefaultDimensions(image){
      var imgWidth = image.width;
      var imgHeight = image.height;
      var aspectRatio = imgWidth / imgHeight;
      /**
       * algebra for relationship between aspect ratio and width/height.
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


   convertToBasePng(){
    return this.fabric.toDataURL('png');
   }
   
}

module.exports = Canvas;