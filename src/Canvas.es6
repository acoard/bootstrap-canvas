class Canvas {
    
   constructor(idOfCanvas){
        this.canvas = document.getElementById(idOfCanvas);
        this.ctx = this.canvas.getContext("2d");
   }

   drawGreenSquare(){
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(10, 10, 100, 100);
   }

   drawImageToCanvas(image){
        this.ctx.drawImage(image, 0, 0);
   }

}

class ImageHandler {

    constructor(idOfUploadInputElement){
        this.element = document.getElementById(idOfUploadInputElement);
        this.element.addEventListener('change', this.handleChangeEvent.bind(this), false);
    }

    handleChangeEvent(ev){
        console.log(ev);

        if ( ev.target.files && ev.target.files[0] ){
            this.fileReader = new FileReader();

            //todo - convert to es6 promises.
            // FR.onload = function(fileReadEvent){
            this.fileReader.onload = fileReadEvent => {
                this.img = new Image();
                this.img.src = fileReadEvent.target.result;

                // img.onload = function(){
                //     return;
                // }

            }
            this.fileReader.readAsDataURL( ev.target.files[0] );
        }
    }

    getImage(){
        return this.img ? this.img : false;
    }

    //     if (this.files && this.files[0]) {
    //         var FR = new FileReader();
    //         FR.onload = function(e) {
    //            var img = new Image();

    //            img.onload = function() {
    //              context.drawImage(img, 0, 0);
    //            };

    //            img.src = e.target.result;
    //         };       
    //         FR.readAsDataURL( this.files[0] );
    //     }
    // }


    // function handleImage(e){
    //     var reader = new FileReader();
    //     reader.onload = function(event){
    //         var img = new Image();
    //         img.onload = function(){
    //             canvas.width = img.width;
    //             canvas.height = img.height;
    //             ctx.drawImage(img,0,0);
    //         }
    //         img.src = event.target.result;
    //     }
    //     reader.readAsDataURL(e.target.files[0]);     
    // }
    

}



var image, c;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    image = new ImageHandler('imageUpload')
    //c.drawImageToCanvas(image.getImage() )
});

