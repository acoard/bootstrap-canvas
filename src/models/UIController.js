import ImageElementHandler from "./ImageElementHandler";

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
          let image = new ImageElementHandler('imageUpload', this.canvas);
          // this.canvas.importImageToCanvas(image.getImage() )
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

module.exports = UIController;
