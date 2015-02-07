class Canvas {
    
   constructor(idOfCanvas){
        this.canvasElement = document.getElementById(idOfCanvas);
        this.ctx = this.canvasElement.getContext("2d");
        this.elements = [];


        this.canvasElement.addEventListener('click', this.canvasClickHandler, false);
   }

   drawGreenSquare(){
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(10, 10, 100, 100);
   }

   drawImageToCanvas(image){
        var width, height, aspectRatio;
        var [centreX, centreY] = [this.canvasElement.width/2, this.canvasElement.height/2];

        //Keep the aspect ratio, but scale down so that it fits within canvas.
        //the centre of the image should be the centre of the canvas.
        aspectRatio = image.width / image.height;
        if ( image.width > this.canvasElement.width/2 ) {
            width = this.canvasElement.width/2;
        }
        else {
            width = image.width;
        }
        height = aspectRatio * width;

        this.ctx.drawImage(image, centreX, centreY);
        // this.elements.push(new CanvasElement(0, ))
   }

   canvasClickHandler(ev){
    console.log(ev);
   }

}

class ImageHandler {

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
                    this.canvas.drawImageToCanvas(data)
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



var image, c;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    image = new ImageHandler('imageUpload', c);
    //c.drawImageToCanvas(image.getImage() )
});

