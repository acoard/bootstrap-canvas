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
        this.elements.push(imageHandler);
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
    setZIndex: {
      value: function setZIndex(index) {
        this.fabric.moveTo(index);
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


          $target.on("click", "#imagesListTemplate", function (ev) {
            if (ev.target.nodeName === "I") {
              _this.toggleImageVisibility(ev.target);
            }
          });

          resolve();
        });
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
          var li = "<li class=\"list-group-item\" draggable=\"true\" data-index=" + i + ">" + el.name + " <i class='close'>toggle</i> </li>";
          output += li + "\n";
        });
        element.innerHTML = output;
      },
      writable: true,
      configurable: true
    },
    toggleImageVisibility: {
      value: function toggleImageVisibility(eventTarget) {
        var index = eventTarget.parentElement.dataset.index;
        this.canvas.elements[index].toggleVisibility();
      },
      writable: true,
      configurable: true
    }
  });

  return UIController;
})();




var image, c, ui;
document.addEventListener("DOMContentLoaded", function (event) {
  c = new Canvas("canvas");
  ui = new UIController({ canvas: c });

  //c.importImageToCanvas(image.getImage() )
});
// resolve();