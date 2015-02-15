(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// UIController = require('UIController');
var UIController = _interopRequire(require("./UIController"));

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
    this.ui = new UIController({ canvas: this });
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
        this.ui.drawImagesList(this.elements);

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
    findImageByName: {

      //todo - refactor into an 'ImageCollection' object.
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





module.exports = Canvas;

//todo - inheirit other UI elements from this class, i.e. the 'list' - ListController


// class SortableImageList {

// }

// var image, c, ui;
// document.addEventListener("DOMContentLoaded", function(event) {
//     c = new Canvas('canvas');
//     ui = new UIController({canvas: c});

//     //c.importImageToCanvas(image.getImage() )
// });

},{"./UIController":undefined}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ImageHandler = _interopRequire(require("./ImageHandler"));

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

module.exports = ImageElementHandler;
// resolve();

},{"./ImageHandler":4}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ImageElementHandler = _interopRequire(require("./ImageElementHandler"));

var UIController = (function () {
  function UIController(options) {
    var _this = this;
    _classCallCheck(this, UIController);

    //options should include:
    //  which view to load (@todo is there a es6 template import from file?)
    //  target, i.e. how it selects the element (just use jquery?)
    //RIGHT NOW: it's selecting by data-canvascontrolstargetid
    this.target = $("div[data-canvascontrolstargetid]")[0];
    this.template = "\n            <label class='imageUploadLabel btn btn-primary'> Upload Image\n              <input type='file' id='imageUpload' style='visibility: hidden' />\n            </label>\n            <!-- \n            <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Left</button>\n              </div>\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Middle</button>\n              </div>\n              <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn btn-default\">Right</button>\n              </div>\n              -->\n            </div>\n            <ul id=\"imagesListTemplate\" class=\"list-group\">\n            </ul>";
    this.canvas = options.canvas;


    this.initControls().then(function () {
      var image = new ImageElementHandler("imageUpload", _this.canvas);
      // this.canvas.importImageToCanvas(image.getImage() )
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
          resolve();
        });
      },
      writable: true,
      configurable: true
    },
    _handleImageListReorganization: {
      value: function _handleImageListReorganization(e, ui) {
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


      //This handles the <li> elements being dragable.
      //Must rebind after every time drawImagesList() is called.
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
    }
  });

  return UIController;
})();

module.exports = UIController;

},{"./ImageElementHandler":undefined}],4:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

module.exports = ImageHandler;

},{}]},{},[1,3,2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9DYW52YXMuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUVsZW1lbnRIYW5kbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvVUlDb250cm9sbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvSW1hZ2VIYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNDTyxZQUFZLDJCQUFNLGdCQUFnQjs7SUFDbkMsTUFBTTtBQUVFLFdBRlIsTUFBTSxDQUVHLFVBQVU7MEJBRm5CLE1BQU07O0FBR0osUUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU1QyxRQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFD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WUFBWTs7QUFFZCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7QUFDL0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUMxQzs7dUJBUkcsWUFBWTtBQVVoQixvQkFBZ0I7YUFBQSw0QkFBRTtBQUNoQixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDdEI7Ozs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFDO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0I7Ozs7QUFFRCxZQUFRO2FBQUEsa0JBQUMsS0FBSyxFQUFDOzs7QUFHYixZQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELFlBQUksU0FBUyxHQUFHLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDdEMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUU1Qjs7Ozs7O1NBMUJHLFlBQVk7OztBQTZCbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gVUlDb250cm9sbGVyID0gcmVxdWlyZSgnVUlDb250cm9sbGVyJyk7XG5pbXBvcnQgVUlDb250cm9sbGVyIGZyb20gXCIuL1VJQ29udHJvbGxlclwiO1xuY2xhc3MgQ2FudmFzIHtcbiAgICBcbiAgIGNvbnN0cnVjdG9yKGlkT2ZDYW52YXMpe1xuICAgICAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDtcbiAgICAgICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkNhbnZhcyhpZE9mQ2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2FudmFzQ2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgVUlDb250cm9sbGVyKHtjYW52YXM6IHRoaXN9KTtcbiAgIH1cblxuICAgcmVuZGVyKCl7XG4gICAgdGhpcy5mYWJyaWMuc2V0SGVpZ2h0KHRoaXMuaGVpZ2h0KTtcbiAgICB0aGlzLmZhYnJpYy5zZXRXaWR0aCh0aGlzLndpZHRoKTtcbiAgICB0aGlzLmZhYnJpYy5yZW5kZXJBbGwoKTtcbiAgIH1cblxuICAgZHJhd0dyZWVuU3F1YXJlKCl7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICdncmVlbidcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMTAsIDEwLCAxMDAsIDEwMCk7XG4gICB9XG5cbiAgLy9AdG9kbyAvIHJlZmFjdG9yIC0gZXh0ZW5kIHRvIGEgJ3RyeS9jYXRjaCcsIGFuZCByZXZlcnQgYWRkaW5nIGl0IHRvIGVsZW1lbnRzIGlmIGl0IGRvZXNuJ3Qgd29yay5cbiAgIGltcG9ydEltYWdlVG9DYW52YXMoaW1hZ2VIYW5kbGVyKXtcbiAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZmFicmljO1xuICAgICAgICAvL0J5IHVzaW5nIHVuc2hpZnQsIHdlIGhhdmUgdGhlIG5ld2VzdCBlbGVtZW50cyBGSVJTVCwgd2hpY2ggaGVscHMgd2l0aCB6LWluZGV4IGxheWVyIGxvZ2ljLlxuICAgICAgICB0aGlzLmVsZW1lbnRzLnVuc2hpZnQoaW1hZ2VIYW5kbGVyKTtcbiAgICAgICAgdGhpcy51aS5kcmF3SW1hZ2VzTGlzdCh0aGlzLmVsZW1lbnRzKVxuICAgICAgICBcbiAgICAgICAgdmFyIFtkZWZhdWx0V2lkdGgsIGRlZmF1bHRIZWlnaHRdID0gdGhpcy5jYWxjdWxhdGVEcmF3aW5nRGVmYXVsdERpbWVuc2lvbnMoaW1hZ2VIYW5kbGVyLmltZyk7XG4gICAgICAgIFtpbWFnZUhhbmRsZXIuZmFicmljLndpZHRoLCBpbWFnZUhhbmRsZXIuZmFicmljLmhlaWdodF0gPSBbZGVmYXVsdFdpZHRoLCBkZWZhdWx0SGVpZ2h0XTtcbiAgICAgICAgY2FudmFzLmFkZChpbWFnZUhhbmRsZXIuZmFicmljKTtcbiAgICAgICAgaW1hZ2VIYW5kbGVyLmZhYnJpYy5jZW50ZXIoKTtcbiAgICAgICAgaW1hZ2VIYW5kbGVyLmZhYnJpYy5zZXRDb29yZHMoKTtcbiAgICAgICAgXG4gICB9XG5cbiAgIGNhbGN1bGF0ZURyYXdpbmdEZWZhdWx0RGltZW5zaW9ucyhpbWFnZSl7XG4gICAgdmFyIGltZ1dpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgdmFyIGltZ0hlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBpbWdXaWR0aCAvIGltZ0hlaWdodDtcblxuICAgIGlmIChpbWdXaWR0aCA8PSBjYW52YXMud2lkdGggLyAyICYmIGltZ0hlaWdodCA8PSBjYW52YXMuaGVpZ2h0IC8gMil7XG4gICAgICAgcmV0dXJuIFtpbWdXaWR0aCwgaW1nSGVpZ2h0XVxuICAgIH1cblxuICAgIC8vanVzdCBjYWxjdWxhdGluZyBvZmYgaGVpZ2h0IG5vdy5cbiAgICAvL3Nob3VsZCBkbyBhbm90aGVyIGNoZWNrIGZvciB3aWR0aCBhbmQgc2NhbGUgb24gYXNwZWN0IHJhdGlvIVxuICAgIGlmIChpbWdIZWlnaHQgPiBjYW52YXMuaGVpZ2h0IC8gMil7XG4gICAgIGltZ0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICBpbWdXaWR0aCA9IGltZ0hlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgIH1cbiAgICAvL3dlIHdhbnQgdG8gZmlsdGVyIGJ5IGhlaWdodCBmaXJzdCwgYW5kIG9ubHkgY2F0Y2ggY2FzZXMgd2VyZSB3aWR0aCBpcyBTVElMTCB0b28gbG9uZ1xuICAgIGlmIChpbWdXaWR0aCA+IGNhbnZhcy53aWR0aCAvIDIpe1xuICAgICAgaW1nV2lkdGggPSBjYW52YXMud2lkdGggLyAyO1xuICAgICAgaW1nSGVpZ2h0ID0gaW1nV2lkdGggKiBhc3BlY3RSYXRpbztcbiAgICB9XG5cbiAgICAgcmV0dXJuIFtpbWdXaWR0aCwgaW1nSGVpZ2h0XVxuICAgfVxuXG4gICAvL3RvZG8gLSByZWZhY3RvciBpbnRvIGFuICdJbWFnZUNvbGxlY3Rpb24nIG9iamVjdC5cbiAgIGZpbmRJbWFnZUJ5TmFtZShuYW1lKXtcbiAgICBsZXQgbGlzdCA9IHRoaXMuZWxlbWVudHM7XG4gICAgcmV0dXJuIGxpc3QuZmlsdGVyKCB4ID0+IHgubmFtZSA9PT0gbmFtZSlbMF07XG4gICB9XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcblxuLy90b2RvIC0gaW5oZWlyaXQgb3RoZXIgVUkgZWxlbWVudHMgZnJvbSB0aGlzIGNsYXNzLCBpLmUuIHRoZSAnbGlzdCcgLSBMaXN0Q29udHJvbGxlclxuXG5cbi8vIGNsYXNzIFNvcnRhYmxlSW1hZ2VMaXN0IHtcblxuLy8gfVxuXG4vLyB2YXIgaW1hZ2UsIGMsIHVpO1xuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXG4vLyAgICAgYyA9IG5ldyBDYW52YXMoJ2NhbnZhcycpO1xuLy8gICAgIHVpID0gbmV3IFVJQ29udHJvbGxlcih7Y2FudmFzOiBjfSk7XG4gICAgXG4vLyAgICAgLy9jLmltcG9ydEltYWdlVG9DYW52YXMoaW1hZ2UuZ2V0SW1hZ2UoKSApXG4vLyB9KTtcblxuIiwiaW1wb3J0IEltYWdlSGFuZGxlciBmcm9tIFwiLi9JbWFnZUhhbmRsZXJcIjtcblxuY2xhc3MgSW1hZ2VFbGVtZW50SGFuZGxlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihpZE9mVXBsb2FkSW5wdXRFbGVtZW50LCBjYW52YXMpe1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mVXBsb2FkSW5wdXRFbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuaGFuZGxlSW1hZ2VDaGFuZ2VFdmVudC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIH1cblxuICAgIHJlYWRGaWxlQXN5bmMoZmlsZSl7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7ICBcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgdGhpcy5maWxlUmVhZGVyLm9ubG9hZCA9IGZpbGVSZWFkRXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWcuc3JjID0gZmlsZVJlYWRFdmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5maWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoIGZpbGUgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlSW1hZ2VDaGFuZ2VFdmVudChldil7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICggZXYudGFyZ2V0LmZpbGVzICYmIGV2LnRhcmdldC5maWxlc1swXSApe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZEZpbGVBc3luYyhldi50YXJnZXQuZmlsZXNbMF0pLnRoZW4oIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZXYudGFyZ2V0LmZpbGVzWzBdLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2VIYW5kbGVyKHRoaXMsIGRhdGEsIG5hbWUsIHRoaXMuY2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWcpXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCggRXJyb3IoJ05vIGZpbGUgZm91bmQsIG5vdGhpbmcgdG8gcmVhZC4nKSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0SW1hZ2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1nID8gdGhpcy5pbWcgOiBmYWxzZTtcbiAgICB9XG4gICAgXG5cbn1cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VFbGVtZW50SGFuZGxlcjsiLCJpbXBvcnQgSW1hZ2VFbGVtZW50SGFuZGxlciBmcm9tIFwiLi9JbWFnZUVsZW1lbnRIYW5kbGVyXCI7XG5cbmNsYXNzIFVJQ29udHJvbGxlcntcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgLy9vcHRpb25zIHNob3VsZCBpbmNsdWRlOiBcbiAgICAgICAgLy8gIHdoaWNoIHZpZXcgdG8gbG9hZCAoQHRvZG8gaXMgdGhlcmUgYSBlczYgdGVtcGxhdGUgaW1wb3J0IGZyb20gZmlsZT8pXG4gICAgICAgIC8vICB0YXJnZXQsIGkuZS4gaG93IGl0IHNlbGVjdHMgdGhlIGVsZW1lbnQgKGp1c3QgdXNlIGpxdWVyeT8pXG4gICAgICAgICAgICAvL1JJR0hUIE5PVzogaXQncyBzZWxlY3RpbmcgYnkgZGF0YS1jYW52YXNjb250cm9sc3RhcmdldGlkXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJCgnZGl2W2RhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZF0nKVswXTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGBcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0naW1hZ2VVcGxvYWRMYWJlbCBidG4gYnRuLXByaW1hcnknPiBVcGxvYWQgSW1hZ2VcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2ZpbGUnIGlkPSdpbWFnZVVwbG9hZCcgc3R5bGU9J3Zpc2liaWxpdHk6IGhpZGRlbicgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8IS0tIFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+TGVmdDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+TWlkZGxlPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5SaWdodDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgLS0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDx1bCBpZD1cImltYWdlc0xpc3RUZW1wbGF0ZVwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgPC91bD5gO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG9wdGlvbnMuY2FudmFzO1xuXG5cbiAgICAgICAgdGhpcy5pbml0Q29udHJvbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VFbGVtZW50SGFuZGxlcignaW1hZ2VVcGxvYWQnLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgLy8gdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZS5nZXRJbWFnZSgpIClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdENvbnRyb2xzKCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy50YXJnZXQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgJHRhcmdldC53aWR0aCh0aGlzLmNhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMuJGltYWdlc0xpc3QgPSAkKCcjaW1hZ2VzTGlzdFRlbXBsYXRlJyk7XG4gICAgICAgIFxuXG4gICAgICAgICR0YXJnZXQub24oJ2NsaWNrJywgJyNpbWFnZXNMaXN0VGVtcGxhdGUnLCAoZXYpID0+IHtcbiAgICAgICAgICBpZiAoZXYudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklcIil7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUltYWdlVmlzaWJpbGl0eShldi50YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICB9XG5cbiAgICBfaGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24oZSwgdWkpeyAgICAgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSB1aS5pdGVtLmluZGV4KCk7XG4gICAgICB2YXIgbmFtZSA9ICQodWkuaXRlbSkuZmluZCgnLmZpbGVuYW1lJykudGV4dCgpO1xuICAgICAgdmFyIGltYWdlRWxlbWVudE9iaiA9IHRoaXMuY2FudmFzLmZpbmRJbWFnZUJ5TmFtZShuYW1lKTtcbiAgICAgIGltYWdlRWxlbWVudE9iai5zZXRMYXllcihuZXdQb3NpdGlvbik7XG5cbiAgICB9XG5cbiAgICBkcmF3SW1hZ2VzTGlzdChpbWFnZXNMaXN0LCBpbWFnZXNMaXN0VGVtcGxhdGVJRCA9ICdpbWFnZXNMaXN0VGVtcGxhdGUnKXtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1hZ2VzTGlzdFRlbXBsYXRlSUQpO1xuICAgICAgaW1hZ2VzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKXtcbiAgICAgICAgbGV0IGxpID0gYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWluZGV4PSR7aX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdmaWxlbmFtZSc+JHsgZWwubmFtZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2Nsb3NlJz50b2dnbGU8L2k+IFxuICAgICAgICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICBvdXRwdXQgKz0gbGkgKyBcIlxcblwiO1xuICAgICAgfSk7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IG91dHB1dDsgXG5cbiAgICAgIHRoaXMuaW1hZ2VMaXN0RXZlbnRzKCk7ICAgICBcbiAgICB9XG5cblxuICAgIC8vVGhpcyBoYW5kbGVzIHRoZSA8bGk+IGVsZW1lbnRzIGJlaW5nIGRyYWdhYmxlLlxuICAgIC8vTXVzdCByZWJpbmQgYWZ0ZXIgZXZlcnkgdGltZSBkcmF3SW1hZ2VzTGlzdCgpIGlzIGNhbGxlZC5cbiAgICBpbWFnZUxpc3RFdmVudHMoKXtcbiAgICAgICQoJy5saXN0LWdyb3VwJykuc29ydGFibGUoKS5iaW5kKCdzb3J0dXBkYXRlJywgdGhpcy5faGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlSW1hZ2VWaXNpYmlsaXR5KGV2ZW50VGFyZ2V0KXtcbiAgICAgIC8vR2V0IGluZGV4IGZyb20gRE9NIHRvIHVwZGF0ZSBKUyBvYmouXG4gICAgICAvL0tlZXBpbmcgc3RhdGUgKGluZGV4KSBpbiBET00gc28gdGhhdCBhbGwgdGhpcyBtZXRob2QgbmVlZHMgaXMgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgIHZhciBpbmRleCA9IGV2ZW50VGFyZ2V0WydwYXJlbnRFbGVtZW50J11bJ2RhdGFzZXQnXVsnaW5kZXgnXTtcbiAgICAgIHRoaXMuY2FudmFzLmVsZW1lbnRzW2luZGV4XS50b2dnbGVWaXNpYmlsaXR5KClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlDb250cm9sbGVyO1xuIiwiY2xhc3MgSW1hZ2VIYW5kbGVye1xuICBjb25zdHJ1Y3RvcihpbWFnZUVsZW1lbnRIYW5kbGVyLCBmaWxlLCBuYW1lLCBjYW52YXMgKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaW1nID0gZmlsZTtcbiAgICB0aGlzLmltYWdlRWxlbWVudEhhbmRsZXIgPSBpbWFnZUVsZW1lbnRIYW5kbGVyO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkltYWdlKHRoaXMuaW1nKTtcbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoKXtcbiAgICB0aGlzLmZhYnJpYy52aXNpYmxlID0gIXRoaXMuZmFicmljLnZpc2libGU7XG4gICAgdGhpcy5jYW52YXMucmVuZGVyKCk7XG4gIH1cblxuICBfc2V0WkluZGV4KGluZGV4KXtcbiAgICB0aGlzLmZhYnJpYy5tb3ZlVG8oaW5kZXgpO1xuICB9XG5cbiAgc2V0TGF5ZXIobGF5ZXIpe1xuICAgIC8vbGF5ZXIgaXMgbGlrZSB0aGUgb3Bwb3NpdGUgb2Ygei1pbmRleC5cbiAgICAvL2xheWVyIDAgaXMgdGhlIGhpZ2hlc3QgbGF5ZXIsIGFzIGl0J3MgdGhlIHRvcCBvZiB0aGUgbGlzdFxuICAgIHZhciBoaWdoZXN0WkluZGV4ID0gdGhpcy5jYW52YXMuZWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICB2YXIgbmV3WkluZGV4ID0gaGlnaGVzdFpJbmRleCAtIGxheWVyO1xuICAgIHRoaXMuX3NldFpJbmRleChuZXdaSW5kZXgpO1xuXG4gIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUhhbmRsZXI7Il19
