

class Canvas {
    
   constructor(idOfCanvas){
        this.canvasElement = document.getElementById(idOfCanvas);
        this.ctx = this.canvasElement.getContext("2d");
        this.elements = [];
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.fabric = new fabric.Canvas(idOfCanvas);
        
        this.canvasElement.addEventListener('click', this.canvasClickHandler, false);
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

  //@todo / refactor - extend to a 'try/catch', and revert adding it to elements if it doesn't work.
   importImageToCanvas(imageHandler){
        var canvas = this.fabric;
        //By using unshift, we have the newest elements FIRST, which helps with z-index layer logic.
        this.elements.unshift(imageHandler);
        ui.drawImagesList(this.elements)
        
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

    if (imgWidth <= canvas.width / 2 && imgHeight <= canvas.height / 2){
       return [imgWidth, imgHeight]
    }

    //just calculating off height now.
    //should do another check for width and scale on aspect ratio!
    if (imgHeight > canvas.height / 2){
     imgHeight = canvas.height / 2;
     imgWidth = imgHeight * aspectRatio;
    }
    //we want to filter by height first, and only catch cases were width is STILL too long
    if (imgWidth > canvas.width / 2){
      imgWidth = canvas.width / 2;
      imgHeight = imgWidth * aspectRatio;
    }

     return [imgWidth, imgHeight]
   }

   //todo - refactor into an 'ImageCollection' object.
   findImageByName(name){
    let list = this.elements;
    return list.filter( x => x.name === name)[0];
   }
}

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
                    this.canvas.importImageToCanvas(img)
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
  constructor(imageElementHandler, file, name, canvas ){
    this.name = name;
    this.img = file;
    this.imageElementHandler = imageElementHandler;
    this.canvas = canvas;

    this.fabric = new fabric.Image(this.img);
  }

  toggleVisibility(){
    this.fabric.visible = !this.fabric.visible;
    this.canvas.render();
  }

  _setZIndex(index){
    this.fabric.moveTo(index);
  }

  setLayer(layer){
    //layer is like the opposite of z-index.
    //layer 0 is the highest layer, as it's the top of the list
    var highestZIndex = this.canvas.elements.length - 1;
    var newZIndex = highestZIndex - layer;
    this._setZIndex(newZIndex);

  }

}


//todo - inheirit other UI elements from this class, i.e. the 'list' - ListController

class UIController{
    constructor(options){
        //options should include: 
        //  which view to load (@todo is there a es6 template import from file?)
        //  target, i.e. how it selects the element (just use jquery?)
            //RIGHT NOW: it's selecting by data-canvascontrolstargetid
        this.target = $('div[data-canvascontrolstargetid]')[0];
        this.template = `
            <label class='imageUploadLabel btn btn-primary'> Upload Image
              <input type='file' id='imageUpload' style='visibility: hidden' />
            </label>
            <!-- 
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
              -->
            </div>
            <ul id="imagesListTemplate" class="list-group">
            </ul>`;
        this.canvas = options.canvas;


        this.initControls().then(() => {
          image = new ImageElementHandler('imageUpload', c);
        });
    }

    initControls(){
      return new Promise((resolve) => {
        var $target = $(this.target);
        this.target.innerHTML = this.template;
        $target.width(this.canvas.width);
        this.$imagesList = $('#imagesListTemplate');
        

        $target.on('click', '#imagesListTemplate', (ev) => {
          if (ev.target.nodeName === "I"){
            this.toggleImageVisibility(ev.target);
            return resolve();
          }

        });
        resolve();
      })
      
    }

    _handleImageListReorganization(e, ui){        
      var newPosition = ui.item.index();
      var name = $(ui.item).find('.filename').text();
      var imageElementObj = this.canvas.findImageByName(name);
      imageElementObj.setLayer(newPosition);

    }

    drawImagesList(imagesList, imagesListTemplateID = 'imagesListTemplate'){
      var output = '';
      var element = document.getElementById(imagesListTemplateID);
      imagesList.forEach(function(el, i){
        let li = `<li class="list-group-item" draggable="true" data-index=${i}>
                    <span class='filename'>${ el.name }</span>
                    
                    <i class='close'>toggle</i> 
                  </li>`;
        output += li + "\n";
      });
      element.innerHTML = output; 

      this.imageListEvents();     
    }


    //This handles the <li> elements being dragable.
    //Must rebind after every time drawImagesList() is called.
    imageListEvents(){
      $('.list-group').sortable().bind('sortupdate', this._handleImageListReorganization.bind(this));
    }

    toggleImageVisibility(eventTarget){
      //Get index from DOM to update JS obj.
      //Keeping state (index) in DOM so that all this method needs is the event object.
      var index = eventTarget['parentElement']['dataset']['index'];
      this.canvas.elements[index].toggleVisibility()
    }
}


// class SortableImageList {

// }

var image, c, ui;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    ui = new UIController({canvas: c});
    
    //c.importImageToCanvas(image.getImage() )
});

