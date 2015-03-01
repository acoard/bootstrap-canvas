import ImageHandler from "./ImageHandler";

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
                    var img = new ImageHandler(this, data, name, this.canvas);
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
module.exports = ImageElementHandler;