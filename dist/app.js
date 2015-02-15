(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Canvas = _interopRequire(require("./models/Canvas"));




document.addEventListener("DOMContentLoaded", function (event) {
    //This is the 'init', and also I've made canvas a global for dev.
    window.canvas = new Canvas("canvas");
});

},{"./models/Canvas":2}],2:[function(require,module,exports){
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
        /**
         * r=w/h
         * w = rh
         * h = w/r
         */

        if (imgWidth <= canvas.width / 2 && imgHeight <= canvas.height / 2) {
          return [imgWidth, imgHeight];
        }

        //just calculating off height now.
        //should do another check for width and scale on aspect ratio!
        if (imgHeight > canvas.height / 2) {
          imgHeight = canvas.height / 2;
          imgWidth = imgHeight * aspectRatio; //w = hr
        }
        //we want to filter by height first, and only catch cases were width is STILL too long
        if (imgWidth > canvas.width / 2) {
          imgWidth = canvas.width / 2;
          imgHeight = imgWidth / aspectRatio; // h = w/r
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

},{"./UIController":5}],3:[function(require,module,exports){
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

},{"./ImageHandler":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./ImageElementHandler":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0NhbnZhcy5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0ltYWdlRWxlbWVudEhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9VSUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sTUFBTSwyQkFBTSxpQkFBaUI7Ozs7O0FBR3BDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEtBQUssRUFBRTs7QUFFMUQsVUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUN4QyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lDTEksWUFBWSwyQkFBTSxnQkFBZ0I7O0lBQ25DLE1BQU07QUFFRSxXQUZSLE1BQU0sQ0FFRyxVQUFVOzBCQUZuQixNQUFNOztBQUdKLFFBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6RCxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7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Q0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDYW52YXMgZnJvbSBcIi4vbW9kZWxzL0NhbnZhc1wiO1xuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxuICAgIC8vVGhpcyBpcyB0aGUgJ2luaXQnLCBhbmQgYWxzbyBJJ3ZlIG1hZGUgY2FudmFzIGEgZ2xvYmFsIGZvciBkZXYuXG4gICAgd2luZG93LmNhbnZhcyA9IG5ldyBDYW52YXMoJ2NhbnZhcycpO1xufSk7XG4iLCIvLyBVSUNvbnRyb2xsZXIgPSByZXF1aXJlKCdVSUNvbnRyb2xsZXInKTtcbmltcG9ydCBVSUNvbnRyb2xsZXIgZnJvbSBcIi4vVUlDb250cm9sbGVyXCI7XG5jbGFzcyBDYW52YXMge1xuICAgIFxuICAgY29uc3RydWN0b3IoaWRPZkNhbnZhcyl7XG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkT2ZDYW52YXMpO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0O1xuICAgICAgICB0aGlzLmZhYnJpYyA9IG5ldyBmYWJyaWMuQ2FudmFzKGlkT2ZDYW52YXMpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jYW52YXNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jYW52YXNDbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBVSUNvbnRyb2xsZXIoe2NhbnZhczogdGhpc30pO1xuICAgfVxuXG4gICByZW5kZXIoKXtcbiAgICB0aGlzLmZhYnJpYy5zZXRIZWlnaHQodGhpcy5oZWlnaHQpO1xuICAgIHRoaXMuZmFicmljLnNldFdpZHRoKHRoaXMud2lkdGgpO1xuICAgIHRoaXMuZmFicmljLnJlbmRlckFsbCgpO1xuICAgfVxuXG4gICBkcmF3R3JlZW5TcXVhcmUoKXtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ2dyZWVuJ1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgxMCwgMTAsIDEwMCwgMTAwKTtcbiAgIH1cblxuICAvL0B0b2RvIC8gcmVmYWN0b3IgLSBleHRlbmQgdG8gYSAndHJ5L2NhdGNoJywgYW5kIHJldmVydCBhZGRpbmcgaXQgdG8gZWxlbWVudHMgaWYgaXQgZG9lc24ndCB3b3JrLlxuICAgaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZUhhbmRsZXIpe1xuICAgICAgICB2YXIgY2FudmFzID0gdGhpcy5mYWJyaWM7XG4gICAgICAgIC8vQnkgdXNpbmcgdW5zaGlmdCwgd2UgaGF2ZSB0aGUgbmV3ZXN0IGVsZW1lbnRzIEZJUlNULCB3aGljaCBoZWxwcyB3aXRoIHotaW5kZXggbGF5ZXIgbG9naWMuXG4gICAgICAgIHRoaXMuZWxlbWVudHMudW5zaGlmdChpbWFnZUhhbmRsZXIpO1xuICAgICAgICB0aGlzLnVpLmRyYXdJbWFnZXNMaXN0KHRoaXMuZWxlbWVudHMpXG4gICAgICAgIFxuICAgICAgICB2YXIgW2RlZmF1bHRXaWR0aCwgZGVmYXVsdEhlaWdodF0gPSB0aGlzLmNhbGN1bGF0ZURyYXdpbmdEZWZhdWx0RGltZW5zaW9ucyhpbWFnZUhhbmRsZXIuaW1nKTtcbiAgICAgICAgW2ltYWdlSGFuZGxlci5mYWJyaWMud2lkdGgsIGltYWdlSGFuZGxlci5mYWJyaWMuaGVpZ2h0XSA9IFtkZWZhdWx0V2lkdGgsIGRlZmF1bHRIZWlnaHRdO1xuICAgICAgICBjYW52YXMuYWRkKGltYWdlSGFuZGxlci5mYWJyaWMpO1xuICAgICAgICBpbWFnZUhhbmRsZXIuZmFicmljLmNlbnRlcigpO1xuICAgICAgICBpbWFnZUhhbmRsZXIuZmFicmljLnNldENvb3JkcygpO1xuICAgICAgICBcbiAgIH1cbiAgIFxuXG5cblxuICAgY2FsY3VsYXRlRHJhd2luZ0RlZmF1bHREaW1lbnNpb25zKGltYWdlKXtcbiAgICB2YXIgaW1nV2lkdGggPSBpbWFnZS53aWR0aDtcbiAgICB2YXIgaW1nSGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgIHZhciBhc3BlY3RSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0O1xuICAgIC8qKlxuICAgICAqIHI9dy9oXG4gICAgICogdyA9IHJoXG4gICAgICogaCA9IHcvclxuICAgICAqL1xuXG4gICAgaWYgKGltZ1dpZHRoIDw9IGNhbnZhcy53aWR0aCAvIDIgJiYgaW1nSGVpZ2h0IDw9IGNhbnZhcy5oZWlnaHQgLyAyKXtcbiAgICAgICByZXR1cm4gW2ltZ1dpZHRoLCBpbWdIZWlnaHRdXG4gICAgfVxuXG4gICAgLy9qdXN0IGNhbGN1bGF0aW5nIG9mZiBoZWlnaHQgbm93LlxuICAgIC8vc2hvdWxkIGRvIGFub3RoZXIgY2hlY2sgZm9yIHdpZHRoIGFuZCBzY2FsZSBvbiBhc3BlY3QgcmF0aW8hXG4gICAgaWYgKGltZ0hlaWdodCA+IGNhbnZhcy5oZWlnaHQgLyAyKXtcbiAgICAgaW1nSGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIDI7XG4gICAgIGltZ1dpZHRoID0gaW1nSGVpZ2h0ICogYXNwZWN0UmF0aW87IC8vdyA9IGhyXG4gICAgfVxuICAgIC8vd2Ugd2FudCB0byBmaWx0ZXIgYnkgaGVpZ2h0IGZpcnN0LCBhbmQgb25seSBjYXRjaCBjYXNlcyB3ZXJlIHdpZHRoIGlzIFNUSUxMIHRvbyBsb25nXG4gICAgaWYgKGltZ1dpZHRoID4gY2FudmFzLndpZHRoIC8gMil7XG4gICAgICBpbWdXaWR0aCA9IGNhbnZhcy53aWR0aCAvIDI7XG4gICAgICBpbWdIZWlnaHQgPSBpbWdXaWR0aCAvIGFzcGVjdFJhdGlvOyAvLyBoID0gdy9yXG4gICAgfVxuICAgICByZXR1cm4gW2ltZ1dpZHRoLCBpbWdIZWlnaHRdXG4gICB9XG5cbiAgIC8vdG9kbyAtIHJlZmFjdG9yIGludG8gYW4gJ0ltYWdlQ29sbGVjdGlvbicgb2JqZWN0LlxuICAgZmluZEltYWdlQnlOYW1lKG5hbWUpe1xuICAgIGxldCBsaXN0ID0gdGhpcy5lbGVtZW50cztcbiAgICByZXR1cm4gbGlzdC5maWx0ZXIoIHggPT4geC5uYW1lID09PSBuYW1lKVswXTtcbiAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG5cbiIsImltcG9ydCBJbWFnZUhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VIYW5kbGVyXCI7XG5cbmNsYXNzIEltYWdlRWxlbWVudEhhbmRsZXIge1xuXG4gICAgY29uc3RydWN0b3IoaWRPZlVwbG9hZElucHV0RWxlbWVudCwgY2FudmFzKXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPZlVwbG9hZElucHV0RWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUltYWdlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB9XG5cbiAgICByZWFkRmlsZUFzeW5jKGZpbGUpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4geyAgXG4gICAgICAgICAgICB0aGlzLmZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5vbmxvYWQgPSBmaWxlUmVhZEV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nLnNyYyA9IGZpbGVSZWFkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCBmaWxlICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUltYWdlQ2hhbmdlRXZlbnQoZXYpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIGV2LnRhcmdldC5maWxlcyAmJiBldi50YXJnZXQuZmlsZXNbMF0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGaWxlQXN5bmMoZXYudGFyZ2V0LmZpbGVzWzBdKS50aGVuKCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV2LnRhcmdldC5maWxlc1swXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlSGFuZGxlcih0aGlzLCBkYXRhLCBuYW1lLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1nKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoIEVycm9yKCdObyBmaWxlIGZvdW5kLCBub3RoaW5nIHRvIHJlYWQuJykgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldEltYWdlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmltZyA/IHRoaXMuaW1nIDogZmFsc2U7XG4gICAgfVxuICAgIFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlRWxlbWVudEhhbmRsZXI7IiwiY2xhc3MgSW1hZ2VIYW5kbGVye1xuICBjb25zdHJ1Y3RvcihpbWFnZUVsZW1lbnRIYW5kbGVyLCBmaWxlLCBuYW1lLCBjYW52YXMgKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaW1nID0gZmlsZTtcbiAgICB0aGlzLmltYWdlRWxlbWVudEhhbmRsZXIgPSBpbWFnZUVsZW1lbnRIYW5kbGVyO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkltYWdlKHRoaXMuaW1nKTtcbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoKXtcbiAgICB0aGlzLmZhYnJpYy52aXNpYmxlID0gIXRoaXMuZmFicmljLnZpc2libGU7XG4gICAgdGhpcy5jYW52YXMucmVuZGVyKCk7XG4gIH1cblxuICBfc2V0WkluZGV4KGluZGV4KXtcbiAgICB0aGlzLmZhYnJpYy5tb3ZlVG8oaW5kZXgpO1xuICB9XG5cbiAgc2V0TGF5ZXIobGF5ZXIpe1xuICAgIC8vbGF5ZXIgaXMgbGlrZSB0aGUgb3Bwb3NpdGUgb2Ygei1pbmRleC5cbiAgICAvL2xheWVyIDAgaXMgdGhlIGhpZ2hlc3QgbGF5ZXIsIGFzIGl0J3MgdGhlIHRvcCBvZiB0aGUgbGlzdFxuICAgIHZhciBoaWdoZXN0WkluZGV4ID0gdGhpcy5jYW52YXMuZWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICB2YXIgbmV3WkluZGV4ID0gaGlnaGVzdFpJbmRleCAtIGxheWVyO1xuICAgIHRoaXMuX3NldFpJbmRleChuZXdaSW5kZXgpO1xuXG4gIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUhhbmRsZXI7IiwiaW1wb3J0IEltYWdlRWxlbWVudEhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VFbGVtZW50SGFuZGxlclwiO1xuXG5jbGFzcyBVSUNvbnRyb2xsZXJ7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIC8vb3B0aW9ucyBzaG91bGQgaW5jbHVkZTogXG4gICAgICAgIC8vICB3aGljaCB2aWV3IHRvIGxvYWQgKEB0b2RvIGlzIHRoZXJlIGEgZXM2IHRlbXBsYXRlIGltcG9ydCBmcm9tIGZpbGU/KVxuICAgICAgICAvLyAgdGFyZ2V0LCBpLmUuIGhvdyBpdCBzZWxlY3RzIHRoZSBlbGVtZW50IChqdXN0IHVzZSBqcXVlcnk/KVxuICAgICAgICAgICAgLy9SSUdIVCBOT1c6IGl0J3Mgc2VsZWN0aW5nIGJ5IGRhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZFxuICAgICAgICB0aGlzLnRhcmdldCA9ICQoJ2RpdltkYXRhLWNhbnZhc2NvbnRyb2xzdGFyZ2V0aWRdJylbMF07XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBgXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ltYWdlVXBsb2FkTGFiZWwgYnRuIGJ0bi1wcmltYXJ5Jz4gVXBsb2FkIEltYWdlXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdmaWxlJyBpZD0naW1hZ2VVcGxvYWQnIHN0eWxlPSd2aXNpYmlsaXR5OiBoaWRkZW4nIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkxlZnQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPk1pZGRsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+UmlnaHQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIC0tPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgaWQ9XCJpbWFnZXNMaXN0VGVtcGxhdGVcIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgIDwvdWw+YDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcblxuXG4gICAgICAgIHRoaXMuaW5pdENvbnRyb2xzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlRWxlbWVudEhhbmRsZXIoJ2ltYWdlVXBsb2FkJywgdGhpcy5jYW52YXMpO1xuICAgICAgICAgIC8vIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1hZ2UuZ2V0SW1hZ2UoKSApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRDb250cm9scygpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMudGFyZ2V0LmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGU7XG4gICAgICAgICR0YXJnZXQud2lkdGgodGhpcy5jYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLiRpbWFnZXNMaXN0ID0gJCgnI2ltYWdlc0xpc3RUZW1wbGF0ZScpO1xuICAgICAgICBcblxuICAgICAgICAkdGFyZ2V0Lm9uKCdjbGljaycsICcjaW1hZ2VzTGlzdFRlbXBsYXRlJywgKGV2KSA9PiB7XG4gICAgICAgICAgaWYgKGV2LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJXCIpe1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJbWFnZVZpc2liaWxpdHkoZXYudGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KVxuICAgICAgXG4gICAgfVxuXG4gICAgX2hhbmRsZUltYWdlTGlzdFJlb3JnYW5pemF0aW9uKGUsIHVpKXsgICAgICAgIFxuICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gdWkuaXRlbS5pbmRleCgpO1xuICAgICAgdmFyIG5hbWUgPSAkKHVpLml0ZW0pLmZpbmQoJy5maWxlbmFtZScpLnRleHQoKTtcbiAgICAgIHZhciBpbWFnZUVsZW1lbnRPYmogPSB0aGlzLmNhbnZhcy5maW5kSW1hZ2VCeU5hbWUobmFtZSk7XG4gICAgICBpbWFnZUVsZW1lbnRPYmouc2V0TGF5ZXIobmV3UG9zaXRpb24pO1xuXG4gICAgfVxuXG4gICAgZHJhd0ltYWdlc0xpc3QoaW1hZ2VzTGlzdCwgaW1hZ2VzTGlzdFRlbXBsYXRlSUQgPSAnaW1hZ2VzTGlzdFRlbXBsYXRlJyl7XG4gICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGltYWdlc0xpc3RUZW1wbGF0ZUlEKTtcbiAgICAgIGltYWdlc0xpc3QuZm9yRWFjaChmdW5jdGlvbihlbCwgaSl7XG4gICAgICAgIGxldCBsaSA9IGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1pbmRleD0ke2l9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZmlsZW5hbWUnPiR7IGVsLm5hbWUgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdjbG9zZSc+dG9nZ2xlPC9pPiBcbiAgICAgICAgICAgICAgICAgIDwvbGk+YDtcbiAgICAgICAgb3V0cHV0ICs9IGxpICsgXCJcXG5cIjtcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBvdXRwdXQ7IFxuXG4gICAgICB0aGlzLmltYWdlTGlzdEV2ZW50cygpOyAgICAgXG4gICAgfVxuXG5cbiAgICAvL1RoaXMgaGFuZGxlcyB0aGUgPGxpPiBlbGVtZW50cyBiZWluZyBkcmFnYWJsZS5cbiAgICAvL011c3QgcmViaW5kIGFmdGVyIGV2ZXJ5IHRpbWUgZHJhd0ltYWdlc0xpc3QoKSBpcyBjYWxsZWQuXG4gICAgaW1hZ2VMaXN0RXZlbnRzKCl7XG4gICAgICAkKCcubGlzdC1ncm91cCcpLnNvcnRhYmxlKCkuYmluZCgnc29ydHVwZGF0ZScsIHRoaXMuX2hhbmRsZUltYWdlTGlzdFJlb3JnYW5pemF0aW9uLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHRvZ2dsZUltYWdlVmlzaWJpbGl0eShldmVudFRhcmdldCl7XG4gICAgICAvL0dldCBpbmRleCBmcm9tIERPTSB0byB1cGRhdGUgSlMgb2JqLlxuICAgICAgLy9LZWVwaW5nIHN0YXRlIChpbmRleCkgaW4gRE9NIHNvIHRoYXQgYWxsIHRoaXMgbWV0aG9kIG5lZWRzIGlzIHRoZSBldmVudCBvYmplY3QuXG4gICAgICB2YXIgaW5kZXggPSBldmVudFRhcmdldFsncGFyZW50RWxlbWVudCddWydkYXRhc2V0J11bJ2luZGV4J107XG4gICAgICB0aGlzLmNhbnZhcy5lbGVtZW50c1tpbmRleF0udG9nZ2xlVmlzaWJpbGl0eSgpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJQ29udHJvbGxlcjtcbiJdfQ==
