import ImageElementHandler from "./ImageElementHandler";

class UIController{
    constructor(options){
        //options should include: 
        //  which view to load (@todo is there a es6 template import from file?)
        //  target, i.e. how it selects the element (just use jquery?)
        //  
        //  GOAL: make imagesListContainer ()
        
        this.container = options.container;
        this.container.append("<div class='canvasControls' data-canvasControlsTargetID='canvas'></div>");
        this.target = $('div[data-canvascontrolstargetid]')[0];
        this.canvas = options.canvas;
        
        //.canvas-container is fabricjs container
        $('.canvas-container').after(`
          <div id='imageListContainer' style='float: right; width : ${options.layerWidth}; max-height: ${options.layerHeight}; overflow: scroll'>
              <h4 style='text-align: center'>Layers</h4>
              <ul id="imagesListTemplate" class="list-group"></ul>
          </div>
          <div class='clearfix'></div>`).css('float', 'left');
        


        this.template = `
            <label class='imageUploadLabel btn btn-primary btn-lg'> 
              <i class="fa fa-picture-o"></i>&nbsp;Upload Image
              <input type='file' id='imageUpload' style='visibility: hidden; height: 0px' />
            </label>

            <button id='submit' class='btn btn-lg btn-default'>
              <i class="fa fa-check"></i>Submit
            </button>`;





        this.initControls().then(() => {
          let image = new ImageElementHandler('imageUpload', this.canvas);
        });
    }

    initControls(){
      return new Promise((resolve) => {
        var $target = $(this.target);
        this.target.innerHTML = this.template;
        // $target.width(this.canvas.width);
        this.$imagesList = $('#imagesListTemplate');

        //We have to use .bind here to overwrite jQuery's use of bind.
        this.$imagesList.on('click', '.duplicate', this.duplicateImageEvent.bind(this));
        this.$imagesList.on('click', '.toggleVisibility', this.toggleImageVisibility.bind(this));
        this.$imagesList.on('click', '.delete', this.deleteImage.bind(this));



        // $('#imageListContainer').remove().insertAfter('canvas')
        // $('#canvas').append('#imageListContainer')
        // $('#imageListContainer')//.detach().appendTo('#es6-bootstrap-container')
        // .css('max-width','385px')
        // .css('min-width', '385px')
        // .css('position','absolute')
        // .css('top','0px')
        // .css('right','-200px');  

        $('body').on('click', '#submit', (ev) => {
          window.open( this.canvas.fabric.toDataURL('png') );
        })


        resolve();
      })
      
    }

    _handleImageListReorganization(e, ui){        
      var newPosition = ui.item.index();
      var name = $(ui.item).find('.filename').text();
      var imageElementObj = this.canvas.imageCollection.findImageByName(name);
      imageElementObj.setLayer(newPosition);

    }

    drawImagesList(imagesList, imagesListTemplateID = 'imagesListTemplate'){
      var output = '';
      var element = document.getElementById(imagesListTemplateID);
      imagesList.forEach(function(el, i){
        let li = `<li class="list-group-item clearfix" draggable="true" data-index=${i}>
                    <span class='filename'>${ el.name }</span>
                    
                    <div class='row-controls'>
                      <button class='btn btn-default duplicate'>
                        <i class="fa fa-files-o"></i>
                      </button>

                      <button class='btn btn-default toggleVisibility'>
                        <i class="fa fa-toggle-on"></i>
                      </button>

                      <button class='btn btn-default delete'>
                        <i class='fa fa-close'></i>
                      </button>
                    </div>

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

    _findImageFromButtonClickEvent(eventTarget){
      //Get index from DOM to update JS obj.
      //Keeping state (index) in DOM so that all this method needs is the event object.
      let el = $(eventTarget).closest("li[data-index]");
      let index = el[0]['dataset']['index'];
      return this.canvas.imageCollection[index];
    }

    toggleImageVisibility(ev){
      this._findImageFromButtonClickEvent(ev.target).toggleVisibility();
    }

    duplicateImageEvent(ev){
      this._findImageFromButtonClickEvent(ev.target).duplicateFile();
    }

    deleteImage(ev){
      this._findImageFromButtonClickEvent(ev.target).remove(); 
    }
}

module.exports = UIController;
