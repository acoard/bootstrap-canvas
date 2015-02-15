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
module.exports = ImageHandler;