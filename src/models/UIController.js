import ImageElementHandler from "./ImageElementHandler";

class UIController{
    constructor(options){
        //options should include: 
        //  which view to load (@todo is there a es6 template import from file?)
        //  target, i.e. how it selects the element (just use jquery?)
            //RIGHT NOW: it's selecting by data-canvascontrolstargetid
        this.target = $('div[data-canvascontrolstargetid]')[0];
        this.template = `
            <label class='imageUploadLabel btn btn-primary btn-lg'> 
              <i class="fa fa-picture-o"></i>&nbsp;Upload Image
              <input type='file' id='imageUpload' style='visibility: hidden; height: 0px' />
            </label>

            <button id='submit' class='btn btn-lg btn-default'>
              <i class="fa fa-check"></i>Submit
            </button>

            <div id='imageListContainer' style='max-width: 500px'>
              <h4 style='text-align: center'>Layers</h4>
              <ul id="imagesListTemplate" class="list-group"></ul>
            </div>`;
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
        // $target.width(this.canvas.width);
        this.$imagesList = $('#imagesListTemplate');
        

        $('body').on('click', '#imagesListTemplate', (ev) => {

          if (ev.target.className.indexOf('duplicate') !== -1 ) {
            this.duplicateImageEvent(ev.target);
            return resolve();

          }
          if (ev.target.className.indexOf('toggleVisibility') !== -1 ) {
            // this.toggleImageVisibility(ev.target);
            this.toggleImageVisibility(ev.target);
            return resolve();
          }
          if (ev.target.className.indexOf('delete') !== -1 ) {
            console.log('delete');

          }
        });

        // $('#imageListContainer').remove().insertAfter('canvas')
        // $('#canvas').append('#imageListContainer')
        $('#imageListContainer').detach().appendTo('#es6Container')
        .css('max-width','385px')
        .css('min-width', '385px')
        .css('position','absolute')
        .css('top','0px')
        .css('right','-200px');  

        $('body').on('click', '#submit', (ev) => {
          window.location = this.canvas.fabric.toDataURL('png');
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
        let li = `<li class="list-group-item" draggable="true" data-index=${i}>
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
      var index = eventTarget['parentElement']['parentElement']['dataset']['index'];
      return this.canvas.imageCollection[index];
    }

    toggleImageVisibility(eventTarget){
      this._findImageFromButtonClickEvent(eventTarget).toggleVisibility();
    }

    duplicateImageEvent(eventTarget){
      this._findImageFromButtonClickEvent(eventTarget).duplicateFile();
    }
}

module.exports = UIController;
