class ImageHandler{
  constructor(imageElementHandler, file, name, canvas ){
    this.name = name;
    this.img = file;
    this.imageElementHandler = imageElementHandler;
    this.canvas = canvas;

    this.fabric = new fabric.Image(this.img);

    this.canvas.importImageToCanvas(this);
  }

  duplicateFile(){
    // constructor(this.imageElementHandler, this.img, this.name + "(duplicate)", this.canvas)
    new ImageHandler(this.imageElementHandler, this.img, this.name + "(duplicate)", this.canvas);
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
    var highestZIndex = this.canvas.imageCollection.length - 1;
    var newZIndex = highestZIndex - layer;
    this._setZIndex(newZIndex);

  }

}
module.exports = ImageHandler;