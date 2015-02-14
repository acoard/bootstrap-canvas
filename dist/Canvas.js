"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Canvas = (function () {
  function Canvas(idOfCanvas) {
    _classCallCheck(this, Canvas);

    this.canvasElement = document.getElementById(idOfCanvas);
    this.ctx = this.canvasElement.getContext("2d");
    this.elements = [];
    this.width = this.canvasElement.width;
    this.height = this.canvasElement.height;
    this.fabric = new fabric.Canvas(idOfCanvas);

    this.canvasElement.addEventListener("click", this.canvasClickHandler, false);
  }

  _prototypeProperties(Canvas, null, {
    render: {
      value: function render() {
        this.fabric.setHeight(this.height);
        this.fabric.setWidth(this.width);
        this.fabric.renderAll();
      },
      writable: true,
      configurable: true
    },
    drawGreenSquare: {
      value: function drawGreenSquare() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(10, 10, 100, 100);
      },
      writable: true,
      configurable: true
    },
    importImageToCanvas: {

      //@todo / refactor - extend to a 'try/catch', and revert adding it to elements if it doesn't work.
      value: function importImageToCanvas(imageHandler) {
        var canvas = this.fabric;
        //By using unshift, we have the newest elements FIRST, which helps with z-index layer logic.
        this.elements.unshift(imageHandler);
        ui.drawImagesList(this.elements);

        var _calculateDrawingDefaultDimensions = this.calculateDrawingDefaultDimensions(imageHandler.img);

        var _calculateDrawingDefaultDimensions2 = _slicedToArray(_calculateDrawingDefaultDimensions, 2);

        var defaultWidth = _calculateDrawingDefaultDimensions2[0];
        var defaultHeight = _calculateDrawingDefaultDimensions2[1];
        var _ref = [defaultWidth, defaultHeight];

        var _ref2 = _slicedToArray(_ref, 2);

        imageHandler.fabric.width = _ref2[0];
        imageHandler.fabric.height = _ref2[1];
        canvas.add(imageHandler.fabric);
        imageHandler.fabric.center();
        imageHandler.fabric.setCoords();
      },
      writable: true,
      configurable: true
    },
    calculateDrawingDefaultDimensions: {
      value: function calculateDrawingDefaultDimensions(image) {
        var imgWidth = image.width;
        var imgHeight = image.height;
        var aspectRatio = imgWidth / imgHeight;

        if (imgWidth <= canvas.width / 2 && imgHeight <= canvas.height / 2) {
          // return {width: imgWidth, height: imgHeight};
          return [imgWidth, imgHeight];
        }

        //just calculating off height now.
        //should do another check for width and scale on aspect ratio!
        if (imgHeight > canvas.height / 2) {
          imgHeight = canvas.height / 2;
          imgWidth = imgHeight * aspectRatio;
        }
        //we want to filter by height first, and only catch cases were width is STILL too long
        if (imgWidth > canvas.width / 2) {
          imgWidth = canvas.width / 2;
          imgHeight = imgWidth * aspectRatio;
        }

        return [imgWidth, imgHeight];
      },
      writable: true,
      configurable: true
    },
    canvasClickHandler: {
      value: function canvasClickHandler(ev) {
        console.log(ev);
      },
      writable: true,
      configurable: true
    },
    findImageByName: {
      value: function findImageByName(name) {
        var list = this.elements;
        return list.filter(function (x) {
          return x.name === name;
        })[0];
      },
      writable: true,
      configurable: true
    }
  });

  return Canvas;
})();

var ImageElementHandler = (function () {
  function ImageElementHandler(idOfUploadInputElement, canvas) {
    _classCallCheck(this, ImageElementHandler);

    this.element = document.getElementById(idOfUploadInputElement);
    this.element.addEventListener("change", this.handleImageChangeEvent.bind(this), false);
    this.canvas = canvas;
  }

  _prototypeProperties(ImageElementHandler, null, {
    readFileAsync: {
      value: function readFileAsync(file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
          _this.fileReader = new FileReader();
          _this.img = new Image();
          _this.fileReader.onload = function (fileReadEvent) {
            _this.img = new Image();
            _this.img.src = fileReadEvent.target.result;
            resolve(_this.img);
          };
          _this.fileReader.readAsDataURL(file);
        });
      },
      writable: true,
      configurable: true
    },
    handleImageChangeEvent: {
      value: function handleImageChangeEvent(ev) {
        var _this = this;
        return new Promise(function (resolve, reject) {
          if (ev.target.files && ev.target.files[0]) {
            _this.readFileAsync(ev.target.files[0]).then(function (data) {
              var name = ev.target.files[0].name;
              var img = new ImageHandler(_this, data, name, _this.canvas);
              _this.canvas.importImageToCanvas(img);
            });
          } else {
            reject(Error("No file found, nothing to read."));
          }
        });
      },
      writable: true,
      configurable: true
    },
    getImage: {
      value: function getImage() {
        return this.img ? this.img : false;
      },
      writable: true,
      configurable: true
    }
  });

  return ImageElementHandler;
})();

var ImageHandler = (function () {
  function ImageHandler(imageElementHandler, file, name, canvas) {
    _classCallCheck(this, ImageHandler);

    this.name = name;
    this.img = file;
    this.imageElementHandler = imageElementHandler;
    this.canvas = canvas;

    this.fabric = new fabric.Image(this.img);
  }

  _prototypeProperties(ImageHandler, null, {
    toggleVisibility: {
      value: function toggleVisibility() {
        this.fabric.visible = !this.fabric.visible;
        this.canvas.render();
      },
      writable: true,
      configurable: true
    },
    _setZIndex: {
      value: function _setZIndex(index) {
        this.fabric.moveTo(index);
      },
      writable: true,
      configurable: true
    },
    setLayer: {
      value: function setLayer(layer) {
        //layer is like the opposite of z-index.
        //layer 0 is the highest layer, as it's the top of the list
        var highestZIndex = this.canvas.elements.length - 1;
        var newZIndex = highestZIndex - layer;
        this._setZIndex(newZIndex);
      },
      writable: true,
      configurable: true
    }
  });

  return ImageHandler;
})();




//todo - inheirit other UI elements from this class, i.e. the 'list' - ListController

var UIController = (function () {
  function UIController(options) {
    _classCallCheck(this, UIController);

    //options should include:
    //  which view to load (@todo is there a es6 template import from file?)
    //  target, i.e. how it selects the element (just use jquery?)
    //RIGHT NOW: it's selecting by data-canvascontrolstargetid
    this.target = $("div[data-canvascontrolstargetid]")[0];
    this.template = "\n            <label class='imageUploadLabel btn btn-primary'> Upload Image\n              <input type='file' id='imageUpload' style='visibility: hidden' />\n            </label>\n            <!-- \n            <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Left</button>\n              </div>\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Middle</button>\n              </div>\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Right</button>\n              </div>\n              -->\n            </div>\n            <ul id=\"imagesListTemplate\" class=\"list-group\">\n            </ul>";
    this.canvas = options.canvas;


    this.initControls().then(function () {
      image = new ImageElementHandler("imageUpload", c);
    });
  }

  _prototypeProperties(UIController, null, {
    initControls: {
      value: function initControls() {
        var _this = this;
        return new Promise(function (resolve) {
          var $target = $(_this.target);
          _this.target.innerHTML = _this.template;
          $target.width(_this.canvas.width);
          _this.$imagesList = $("#imagesListTemplate");


          $target.on("click", "#imagesListTemplate", function (ev) {
            if (ev.target.nodeName === "I") {
              _this.toggleImageVisibility(ev.target);
              return resolve();
            }
          });

          // let listElementsSelector = '.list-group-item';

          // $target.delegate(listElementsSelector, 'drop', this._handleDrop);
          // $target.delegate(listElementsSelector, 'dragstart', this._handleDragStart);
          // $target.delegate(listElementsSelector, 'dragend', this._handleDragEnd);

          resolve();
        });
      },
      writable: true,
      configurable: true
    },
    _handleImageListReorganization: {
      value: function _handleImageListReorganization(e, ui) {
        // var list = $('#imagesListTemplate');
        // var listOfOriginalIndices = list.find('li').map(  (i, e) => e.dataset.index );

        //todo:
        //find the ImageHandler by the moved image
        //  get string from DOM and filter by name?
        // return this.canvas;

        var newPosition = ui.item.index();
        var name = $(ui.item).find(".filename").text();
        var imageElementObj = this.canvas.findImageByName(name);
        imageElementObj.setLayer(newPosition);
      },
      writable: true,
      configurable: true
    },
    drawImagesList: {
      value: function drawImagesList(imagesList) {
        var imagesListTemplateID = arguments[1] === undefined ? "imagesListTemplate" : arguments[1];
        var output = "";
        var element = document.getElementById(imagesListTemplateID);
        imagesList.forEach(function (el, i) {
          var li = "<li class=\"list-group-item\" draggable=\"true\" data-index=" + i + ">\n                    <span class='filename'>" + el.name + "</span>\n                    \n                    <i class='close'>toggle</i> \n                  </li>";
          output += li + "\n";
        });
        element.innerHTML = output;

        this.imageListEvents();
      },
      writable: true,
      configurable: true
    },
    imageListEvents: {
      value: function imageListEvents() {
        $(".list-group").sortable().bind("sortupdate", this._handleImageListReorganization.bind(this));
      },
      writable: true,
      configurable: true
    },
    toggleImageVisibility: {
      value: function toggleImageVisibility(eventTarget) {
        //Get index from DOM to update JS obj.
        //Keeping state (index) in DOM so that all this method needs is the event object.
        var index = eventTarget.parentElement.dataset.index;
        this.canvas.elements[index].toggleVisibility();
      },
      writable: true,
      configurable: true
    },
    _handleDrop: {
      value: function _handleDrop(e) {
        //Currently not getting in this function at all!

        // We want the end result to be re-organizing  this.canvas.elements

        if (e.stopPropagation) {
          e.stopPropagation(); // Stops some browsers from redirecting.
        }
        debugger;

        // Don't do anything if dropping the same column we're dragging.
        if (this.dragSrcEl != this) {
          // Set the source column's HTML to the HTML of the column we dropped on.
          this.dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = e.dataTransfer.getData("text/html");
          debugger;
        }

        return false;
      },
      writable: true,
      configurable: true
    },
    _handleDragStart: {
      value: function _handleDragStart(e) {
        // Target (this) element is the source node.
        e.target.style.opacity = "0.4";

        this.dragSrcEl = e.target;

        e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text/html", e.target.innerHTML);
      },
      writable: true,
      configurable: true
    },
    _handleDragEnd: {
      value: function _handleDragEnd(e) {
        e.target.style.opacity = "1";
      },
      writable: true,
      configurable: true
    }
  });

  return UIController;
})();

//todo  - rename to Selection box
var Box = (function () {
  function Box() {
    _classCallCheck(this, Box);

    this.mySelBoxColor = "darkred";
    this.mySelBoxSize = 6;
  }

  _prototypeProperties(Box, null, {
    draw: {
      value: function draw(context, optionalColor) {},
      writable: true,
      configurable: true
    }
  });

  return Box;
})();

// class SortableImageList {

// }

var image, c, ui;
document.addEventListener("DOMContentLoaded", function (event) {
  c = new Canvas("canvas");
  ui = new UIController({ canvas: c });

  //c.importImageToCanvas(image.getImage() )
});
// resolve();
// ... (draw code) ...