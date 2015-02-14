

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
        this.elements.push(imageHandler);
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
     // return {width: imgWidth, height: imgHeight};
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

   canvasClickHandler(ev){
    console.log(ev);
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

  setZIndex(index){
    this.fabric.moveTo(index);
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
        

        $target.on('click', '#imagesListTemplate', (ev) => {
          if (ev.target.nodeName === "I"){
            this.toggleImageVisibility(ev.target);
            return resolve();
          }

        });

        $target.delegate('.list-group-item', 'drop', this._handleDrop);
        $target.delegate('.list-group-item', 'dragstart', this._handleDragStart);

        // var cols = document.querySelectorAll('#columns .column');
        // [].forEach.call(cols, function(col) {
        //   col.addEventListener('dragstart', handleDragStart, false);
        //   col.addEventListener('dragenter', handleDragEnter, false)
        //   col.addEventListener('dragover', handleDragOver, false);
        //   col.addEventListener('dragleave', handleDragLeave, false);
        //   col.addEventListener('drop', handleDrop, false);
        //   col.addEventListener('dragend', handleDragEnd, false);
        // });

        resolve();
      })
      
    }

    drawImagesList(imagesList, imagesListTemplateID = 'imagesListTemplate'){
      var output = '';
      var element = document.getElementById(imagesListTemplateID);
      imagesList.forEach(function(el, i){
        let li = `<li class="list-group-item" draggable="true" data-index=${i}>${ el.name } <i class='close'>toggle</i> </li>`;
        output += li + "\n";
      });
      element.innerHTML = output;      
    }

    toggleImageVisibility(eventTarget){
      var index = eventTarget['parentElement']['dataset']['index'];
      this.canvas.elements[index].toggleVisibility()
    }

    _handleDrop(e) {
      // this/e.target is current target element.

      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (this.dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        this.dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
      }

      return false;
    }

    _handleDragStart(e) {
      debugger;
      // Target (this) element is the source node.
      e.target.style.opacity = '0.4';

      this.dragSrcEl = e.target;

      e.originalEvent.dataTransfer.effectAllowed = 'move';
      e.originalEvent.dataTransfer.setData('text/html', e.target.innerHTML);
    }
}



var image, c, ui;
document.addEventListener("DOMContentLoaded", function(event) { 
    c = new Canvas('canvas');
    ui = new UIController({canvas: c});
    
    //c.importImageToCanvas(image.getImage() )
});

