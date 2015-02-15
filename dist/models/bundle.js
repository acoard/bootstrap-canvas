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
    this.canvas.ui = this;


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9DYW52YXMuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUVsZW1lbnRIYW5kbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvVUlDb250cm9sbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvSW1hZ2VIYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNDTyxZQUFZLDJCQUFNLGdCQUFnQjs7SUFDbkMsTUFBTTtBQUVFLFdBRlIsTUFBTSxDQUVHLFVBQVU7MEJBRm5CLE1BQU07O0FBR0osUUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU1QyxRQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FD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LElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7QUFDL0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUMxQzs7dUJBUkcsWUFBWTtBQVVoQixvQkFBZ0I7YUFBQSw0QkFBRTtBQUNoQixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDdEI7Ozs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFDO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0I7Ozs7QUFFRCxZQUFRO2FBQUEsa0JBQUMsS0FBSyxFQUFDOzs7QUFHYixZQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELFlBQUksU0FBUyxHQUFHLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDdEMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUU1Qjs7Ozs7O1NBMUJHLFlBQVk7OztBQTZCbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gVUlDb250cm9sbGVyID0gcmVxdWlyZSgnVUlDb250cm9sbGVyJyk7XG5pbXBvcnQgVUlDb250cm9sbGVyIGZyb20gXCIuL1VJQ29udHJvbGxlclwiO1xuY2xhc3MgQ2FudmFzIHtcbiAgICBcbiAgIGNvbnN0cnVjdG9yKGlkT2ZDYW52YXMpe1xuICAgICAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDtcbiAgICAgICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkNhbnZhcyhpZE9mQ2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2FudmFzQ2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICB9XG5cbiAgIHJlbmRlcigpe1xuICAgIHRoaXMuZmFicmljLnNldEhlaWdodCh0aGlzLmhlaWdodCk7XG4gICAgdGhpcy5mYWJyaWMuc2V0V2lkdGgodGhpcy53aWR0aCk7XG4gICAgdGhpcy5mYWJyaWMucmVuZGVyQWxsKCk7XG4gICB9XG5cbiAgIGRyYXdHcmVlblNxdWFyZSgpe1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDEwLCAxMCwgMTAwLCAxMDApO1xuICAgfVxuXG4gIC8vQHRvZG8gLyByZWZhY3RvciAtIGV4dGVuZCB0byBhICd0cnkvY2F0Y2gnLCBhbmQgcmV2ZXJ0IGFkZGluZyBpdCB0byBlbGVtZW50cyBpZiBpdCBkb2Vzbid0IHdvcmsuXG4gICBpbXBvcnRJbWFnZVRvQ2FudmFzKGltYWdlSGFuZGxlcil7XG4gICAgICAgIHZhciBjYW52YXMgPSB0aGlzLmZhYnJpYztcbiAgICAgICAgLy9CeSB1c2luZyB1bnNoaWZ0LCB3ZSBoYXZlIHRoZSBuZXdlc3QgZWxlbWVudHMgRklSU1QsIHdoaWNoIGhlbHBzIHdpdGggei1pbmRleCBsYXllciBsb2dpYy5cbiAgICAgICAgdGhpcy5lbGVtZW50cy51bnNoaWZ0KGltYWdlSGFuZGxlcik7XG4gICAgICAgIHRoaXMudWkuZHJhd0ltYWdlc0xpc3QodGhpcy5lbGVtZW50cylcbiAgICAgICAgXG4gICAgICAgIHZhciBbZGVmYXVsdFdpZHRoLCBkZWZhdWx0SGVpZ2h0XSA9IHRoaXMuY2FsY3VsYXRlRHJhd2luZ0RlZmF1bHREaW1lbnNpb25zKGltYWdlSGFuZGxlci5pbWcpO1xuICAgICAgICBbaW1hZ2VIYW5kbGVyLmZhYnJpYy53aWR0aCwgaW1hZ2VIYW5kbGVyLmZhYnJpYy5oZWlnaHRdID0gW2RlZmF1bHRXaWR0aCwgZGVmYXVsdEhlaWdodF07XG4gICAgICAgIGNhbnZhcy5hZGQoaW1hZ2VIYW5kbGVyLmZhYnJpYyk7XG4gICAgICAgIGltYWdlSGFuZGxlci5mYWJyaWMuY2VudGVyKCk7XG4gICAgICAgIGltYWdlSGFuZGxlci5mYWJyaWMuc2V0Q29vcmRzKCk7XG4gICAgICAgIFxuICAgfVxuXG4gICBjYWxjdWxhdGVEcmF3aW5nRGVmYXVsdERpbWVuc2lvbnMoaW1hZ2Upe1xuICAgIHZhciBpbWdXaWR0aCA9IGltYWdlLndpZHRoO1xuICAgIHZhciBpbWdIZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgdmFyIGFzcGVjdFJhdGlvID0gaW1nV2lkdGggLyBpbWdIZWlnaHQ7XG5cbiAgICBpZiAoaW1nV2lkdGggPD0gY2FudmFzLndpZHRoIC8gMiAmJiBpbWdIZWlnaHQgPD0gY2FudmFzLmhlaWdodCAvIDIpe1xuICAgICAgIHJldHVybiBbaW1nV2lkdGgsIGltZ0hlaWdodF1cbiAgICB9XG5cbiAgICAvL2p1c3QgY2FsY3VsYXRpbmcgb2ZmIGhlaWdodCBub3cuXG4gICAgLy9zaG91bGQgZG8gYW5vdGhlciBjaGVjayBmb3Igd2lkdGggYW5kIHNjYWxlIG9uIGFzcGVjdCByYXRpbyFcbiAgICBpZiAoaW1nSGVpZ2h0ID4gY2FudmFzLmhlaWdodCAvIDIpe1xuICAgICBpbWdIZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgaW1nV2lkdGggPSBpbWdIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICB9XG4gICAgLy93ZSB3YW50IHRvIGZpbHRlciBieSBoZWlnaHQgZmlyc3QsIGFuZCBvbmx5IGNhdGNoIGNhc2VzIHdlcmUgd2lkdGggaXMgU1RJTEwgdG9vIGxvbmdcbiAgICBpZiAoaW1nV2lkdGggPiBjYW52YXMud2lkdGggLyAyKXtcbiAgICAgIGltZ1dpZHRoID0gY2FudmFzLndpZHRoIC8gMjtcbiAgICAgIGltZ0hlaWdodCA9IGltZ1dpZHRoICogYXNwZWN0UmF0aW87XG4gICAgfVxuXG4gICAgIHJldHVybiBbaW1nV2lkdGgsIGltZ0hlaWdodF1cbiAgIH1cblxuICAgLy90b2RvIC0gcmVmYWN0b3IgaW50byBhbiAnSW1hZ2VDb2xsZWN0aW9uJyBvYmplY3QuXG4gICBmaW5kSW1hZ2VCeU5hbWUobmFtZSl7XG4gICAgbGV0IGxpc3QgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHJldHVybiBsaXN0LmZpbHRlciggeCA9PiB4Lm5hbWUgPT09IG5hbWUpWzBdO1xuICAgfVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG5cbi8vdG9kbyAtIGluaGVpcml0IG90aGVyIFVJIGVsZW1lbnRzIGZyb20gdGhpcyBjbGFzcywgaS5lLiB0aGUgJ2xpc3QnIC0gTGlzdENvbnRyb2xsZXJcblxuXG4vLyBjbGFzcyBTb3J0YWJsZUltYWdlTGlzdCB7XG5cbi8vIH1cblxuLy8gdmFyIGltYWdlLCBjLCB1aTtcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxuLy8gICAgIGMgPSBuZXcgQ2FudmFzKCdjYW52YXMnKTtcbi8vICAgICB1aSA9IG5ldyBVSUNvbnRyb2xsZXIoe2NhbnZhczogY30pO1xuICAgIFxuLy8gICAgIC8vYy5pbXBvcnRJbWFnZVRvQ2FudmFzKGltYWdlLmdldEltYWdlKCkgKVxuLy8gfSk7XG5cbiIsImltcG9ydCBJbWFnZUhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VIYW5kbGVyXCI7XG5cbmNsYXNzIEltYWdlRWxlbWVudEhhbmRsZXIge1xuXG4gICAgY29uc3RydWN0b3IoaWRPZlVwbG9hZElucHV0RWxlbWVudCwgY2FudmFzKXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPZlVwbG9hZElucHV0RWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUltYWdlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB9XG5cbiAgICByZWFkRmlsZUFzeW5jKGZpbGUpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4geyAgXG4gICAgICAgICAgICB0aGlzLmZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5vbmxvYWQgPSBmaWxlUmVhZEV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nLnNyYyA9IGZpbGVSZWFkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCBmaWxlICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUltYWdlQ2hhbmdlRXZlbnQoZXYpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIGV2LnRhcmdldC5maWxlcyAmJiBldi50YXJnZXQuZmlsZXNbMF0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGaWxlQXN5bmMoZXYudGFyZ2V0LmZpbGVzWzBdKS50aGVuKCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV2LnRhcmdldC5maWxlc1swXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlSGFuZGxlcih0aGlzLCBkYXRhLCBuYW1lLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1nKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoIEVycm9yKCdObyBmaWxlIGZvdW5kLCBub3RoaW5nIHRvIHJlYWQuJykgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldEltYWdlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmltZyA/IHRoaXMuaW1nIDogZmFsc2U7XG4gICAgfVxuICAgIFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlRWxlbWVudEhhbmRsZXI7IiwiaW1wb3J0IEltYWdlRWxlbWVudEhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VFbGVtZW50SGFuZGxlclwiO1xuXG5jbGFzcyBVSUNvbnRyb2xsZXJ7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIC8vb3B0aW9ucyBzaG91bGQgaW5jbHVkZTogXG4gICAgICAgIC8vICB3aGljaCB2aWV3IHRvIGxvYWQgKEB0b2RvIGlzIHRoZXJlIGEgZXM2IHRlbXBsYXRlIGltcG9ydCBmcm9tIGZpbGU/KVxuICAgICAgICAvLyAgdGFyZ2V0LCBpLmUuIGhvdyBpdCBzZWxlY3RzIHRoZSBlbGVtZW50IChqdXN0IHVzZSBqcXVlcnk/KVxuICAgICAgICAgICAgLy9SSUdIVCBOT1c6IGl0J3Mgc2VsZWN0aW5nIGJ5IGRhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZFxuICAgICAgICB0aGlzLnRhcmdldCA9ICQoJ2RpdltkYXRhLWNhbnZhc2NvbnRyb2xzdGFyZ2V0aWRdJylbMF07XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBgXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ltYWdlVXBsb2FkTGFiZWwgYnRuIGJ0bi1wcmltYXJ5Jz4gVXBsb2FkIEltYWdlXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdmaWxlJyBpZD0naW1hZ2VVcGxvYWQnIHN0eWxlPSd2aXNpYmlsaXR5OiBoaWRkZW4nIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkxlZnQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPk1pZGRsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+UmlnaHQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIC0tPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgaWQ9XCJpbWFnZXNMaXN0VGVtcGxhdGVcIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgIDwvdWw+YDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcbiAgICAgICAgdGhpcy5jYW52YXMudWkgPSB0aGlzO1xuXG5cbiAgICAgICAgdGhpcy5pbml0Q29udHJvbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VFbGVtZW50SGFuZGxlcignaW1hZ2VVcGxvYWQnLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgLy8gdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZS5nZXRJbWFnZSgpIClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdENvbnRyb2xzKCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy50YXJnZXQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgJHRhcmdldC53aWR0aCh0aGlzLmNhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMuJGltYWdlc0xpc3QgPSAkKCcjaW1hZ2VzTGlzdFRlbXBsYXRlJyk7XG4gICAgICAgIFxuXG4gICAgICAgICR0YXJnZXQub24oJ2NsaWNrJywgJyNpbWFnZXNMaXN0VGVtcGxhdGUnLCAoZXYpID0+IHtcbiAgICAgICAgICBpZiAoZXYudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklcIil7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUltYWdlVmlzaWJpbGl0eShldi50YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICB9XG5cbiAgICBfaGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24oZSwgdWkpeyAgICAgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSB1aS5pdGVtLmluZGV4KCk7XG4gICAgICB2YXIgbmFtZSA9ICQodWkuaXRlbSkuZmluZCgnLmZpbGVuYW1lJykudGV4dCgpO1xuICAgICAgdmFyIGltYWdlRWxlbWVudE9iaiA9IHRoaXMuY2FudmFzLmZpbmRJbWFnZUJ5TmFtZShuYW1lKTtcbiAgICAgIGltYWdlRWxlbWVudE9iai5zZXRMYXllcihuZXdQb3NpdGlvbik7XG5cbiAgICB9XG5cbiAgICBkcmF3SW1hZ2VzTGlzdChpbWFnZXNMaXN0LCBpbWFnZXNMaXN0VGVtcGxhdGVJRCA9ICdpbWFnZXNMaXN0VGVtcGxhdGUnKXtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1hZ2VzTGlzdFRlbXBsYXRlSUQpO1xuICAgICAgaW1hZ2VzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKXtcbiAgICAgICAgbGV0IGxpID0gYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWluZGV4PSR7aX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdmaWxlbmFtZSc+JHsgZWwubmFtZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2Nsb3NlJz50b2dnbGU8L2k+IFxuICAgICAgICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICBvdXRwdXQgKz0gbGkgKyBcIlxcblwiO1xuICAgICAgfSk7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IG91dHB1dDsgXG5cbiAgICAgIHRoaXMuaW1hZ2VMaXN0RXZlbnRzKCk7ICAgICBcbiAgICB9XG5cblxuICAgIC8vVGhpcyBoYW5kbGVzIHRoZSA8bGk+IGVsZW1lbnRzIGJlaW5nIGRyYWdhYmxlLlxuICAgIC8vTXVzdCByZWJpbmQgYWZ0ZXIgZXZlcnkgdGltZSBkcmF3SW1hZ2VzTGlzdCgpIGlzIGNhbGxlZC5cbiAgICBpbWFnZUxpc3RFdmVudHMoKXtcbiAgICAgICQoJy5saXN0LWdyb3VwJykuc29ydGFibGUoKS5iaW5kKCdzb3J0dXBkYXRlJywgdGhpcy5faGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlSW1hZ2VWaXNpYmlsaXR5KGV2ZW50VGFyZ2V0KXtcbiAgICAgIC8vR2V0IGluZGV4IGZyb20gRE9NIHRvIHVwZGF0ZSBKUyBvYmouXG4gICAgICAvL0tlZXBpbmcgc3RhdGUgKGluZGV4KSBpbiBET00gc28gdGhhdCBhbGwgdGhpcyBtZXRob2QgbmVlZHMgaXMgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgIHZhciBpbmRleCA9IGV2ZW50VGFyZ2V0WydwYXJlbnRFbGVtZW50J11bJ2RhdGFzZXQnXVsnaW5kZXgnXTtcbiAgICAgIHRoaXMuY2FudmFzLmVsZW1lbnRzW2luZGV4XS50b2dnbGVWaXNpYmlsaXR5KClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlDb250cm9sbGVyO1xuIiwiY2xhc3MgSW1hZ2VIYW5kbGVye1xuICBjb25zdHJ1Y3RvcihpbWFnZUVsZW1lbnRIYW5kbGVyLCBmaWxlLCBuYW1lLCBjYW52YXMgKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaW1nID0gZmlsZTtcbiAgICB0aGlzLmltYWdlRWxlbWVudEhhbmRsZXIgPSBpbWFnZUVsZW1lbnRIYW5kbGVyO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkltYWdlKHRoaXMuaW1nKTtcbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoKXtcbiAgICB0aGlzLmZhYnJpYy52aXNpYmxlID0gIXRoaXMuZmFicmljLnZpc2libGU7XG4gICAgdGhpcy5jYW52YXMucmVuZGVyKCk7XG4gIH1cblxuICBfc2V0WkluZGV4KGluZGV4KXtcbiAgICB0aGlzLmZhYnJpYy5tb3ZlVG8oaW5kZXgpO1xuICB9XG5cbiAgc2V0TGF5ZXIobGF5ZXIpe1xuICAgIC8vbGF5ZXIgaXMgbGlrZSB0aGUgb3Bwb3NpdGUgb2Ygei1pbmRleC5cbiAgICAvL2xheWVyIDAgaXMgdGhlIGhpZ2hlc3QgbGF5ZXIsIGFzIGl0J3MgdGhlIHRvcCBvZiB0aGUgbGlzdFxuICAgIHZhciBoaWdoZXN0WkluZGV4ID0gdGhpcy5jYW52YXMuZWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICB2YXIgbmV3WkluZGV4ID0gaGlnaGVzdFpJbmRleCAtIGxheWVyO1xuICAgIHRoaXMuX3NldFpJbmRleChuZXdaSW5kZXgpO1xuXG4gIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUhhbmRsZXI7Il19
