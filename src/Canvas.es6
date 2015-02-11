

class Canvas {
    
   constructor(idOfCanvas){
        this.canvasElement = document.getElementById(idOfCanvas);
        this.ctx = this.canvasElement.getContext("2d");
        this.elements = [];
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.fabric = new fabric.Canvas(idOfCanvas);
        
        this.canvasElement.addEventListener('click', this.canvasClickHandler, false);

        // this.render();
   }

   render(){
    this.fabric.setHeight(this.height);
    this.fabric.setWidth(this.width);
    this.fabric.renderAll();
   }

   drawGreenSquare(){
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(10, 10, 100, 100);
   }

  //todo - rename to "import"
  //extend to a 'try/catch', and revert adding it to elements if it doesn't work.
   drawImageToCanvas(imageHandler){
        //rewrite with this.fabric
        var canvas = this.fabric;
        var fabricImage = new fabric.Image(imageHandler.img);
        imageHandler.fabricImage = fabricImage; //@todo - get this monstrosity out of here.
        this.elements.push(imageHandler);
        ui.drawImagesList(this.elements)
        
        var [defaultWidth, defaultHeight] = this.calculateDrawingDefaultDimensions(imageHandler.img);
        [fabricImage.width, fabricImage.height] = [defaultWidth, defaultHeight];
        // debugger;
        canvas.add(fabricImage);
        fabricImage.center();
        fabricImage.setCoords();
        
   }

   calculateDeadCenterPlacement(image){
    //returns x, y, for an image.  
    //the centre of the image will be the centre of the canvas.
    //
    //so, set
   }


   calculateDrawingDefaultDimensions(image){
    //@todo - make sure the image is centred, in the middle, and is 50% width or height (whichever is higher) of total.
    // var imgWidth = this.img.width;
    // var imgHeight = this.img.height;
    var imgWidth = image.width;
    var imgHeight = image.height;
    var aspectRatio = imgWidth / imgHeight;
    var longerDimension = imgWidth > imgHeight ? imgWidth : imgHeight;
    // var maxImageSizePercentage = 50;

    if (imgWidth <= canvas.width / 2 && imgHeight <= canvas.height / 2){
     // return {width: imgWidth, height: imgHeight};
       return [imgWidth, imgHeight]
    }

    //just height first
    if (imgHeight > canvas.height / 2){
     imgHeight = canvas.height / 2;
     imgWidth = imgHeight * aspectRatio;
    }

   // return {width: imgWidth, height: imgHeight};
     return [imgWidth, imgHeight]
   }


   canvasClickHandler(ev){
    console.log(ev);
   }

}


//@todo - refactor so that imageHandler and imageElementUploadHandler are different objects
class ImageElementHandler {

    constructor(idOfUploadInputElement, canvas){
        this.element = document.getElementById(idOfUploadInputElement);
        this.element.addEventListener('change', this.handleImageChangeEvent.bind(this), false);
        this.canvas = canvas;
    }

    readFileAsync(file){
        return new Promise((resolve, reject) => {  
            this.fileReader = new FileReader();
            this.img = new Image();
            this.fileReader.onload = fileReadEvent => {
                this.img = new Image();
                this.img.src = fileReadEvent.target.result;
                resolve(this.img);
            }
            this.fileReader.readAsDataURL( file );
        });
    }

    handleImageChangeEvent(ev){
        return new Promise((resolve, reject) => {

            if ( ev.target.files && ev.target.files[0] ){
                this.readFileAsync(ev.target.files[0]).then( (data) => {
                    var name = ev.target.files[0].name;
                    var img = new ImageHandler(this, data, name);
                    this.canvas.drawImageToCanvas(img)
                    // resolve();
                });
            }
            else {
                reject( Error('No file found, nothing to read.') );
            }

        });

    }




    getImage(){
        return this.img ? this.img : false;
    }
    

}

class ImageHandler{
  constructor(imageElementHandler, file, name ){
    this.name = name;
    this.img = file;
    this.imageElementHandler = imageElementHandler;
  }
}

//The Canvas class is for the whole canvas, whereas this is for the individual elemenets drawn on the canvas.
class CanvasElement{
    constructor(canvas, width, height, top, left){
        this.width = width;
        this.height = height;
        this.top =  top;
        this.left =  left;

        this.selectionHandles = [0, 1, 2, 3, 4, 5, 6, 7];
    }

    draw(){

    }


}

class UIController{
    constructor(options){
        //options should include: 
        //  which view to load (@todo is there a es6 template import from file?)
        //  target, i.e. how it selects the element (just use jquery?)
            //RIGHT NOW: it's selecting by data-canvascontrolstargetid
        this.target = $('div[data-canvascontrolstargetid]')[0];
        this.template = `
            <label class='imageUploadLabel btn btn-primary'> ye upload
              <input type='file' id='imageUpload' style='visibility: hidden' />
            </label>
            <div class="btn-group" role="group" aria-label="...">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Left</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Middle</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Right</button>
              </div>
            </div>
            <ul id="imagesListTemplate" class="list-group">
            </ul>`;


        this.initControls().then(() => {
          image = new ImageElementHandler('imageUpload', c);
        });
        //debug - image is a global variable.
        //image = new ImageHandler('imageUpload', c);
    }

    initControls(){
      // $(this.target).html(this.template);
      return new Promise((resolve) => {
        this.target.innerHTML = this.template;
        resolve();
      })
      
    }

    drawImagesList(imagesList, imagesListTemplateID = 'imagesListTemplate'){
      var output = '';
      var element = document.getElementById(imagesListTemplateID);
      imagesList.forEach(function(el){
        let li = `<li class="list-group-item">${ el.name }</li>`;
        output += li + "\n";
      });
      element.innerHTML = output;

      
      
    }






}


var image, c, ui;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    ui = new UIController({});
    
    //c.drawImageToCanvas(image.getImage() )
});

