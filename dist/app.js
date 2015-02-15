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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0NhbnZhcy5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0ltYWdlRWxlbWVudEhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9VSUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sTUFBTSwyQkFBTSxpQkFBaUI7Ozs7O0FBR3BDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEtBQUssRUFBRTs7QUFFMUQsVUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUN4QyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7SUNOSSxZQUFZLDJCQUFNLGdCQUFnQjs7SUFFbkMsTUFBTTtBQUVFLFdBRlIsTUFBTSxDQUVHLFVBQVU7MEJBRm5CLE1BQU07O0FBR0osUUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztB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QUFDO09BRXZDOzs7O0FBRUQsa0JBQWM7YUFBQSx3QkFBQyxVQUFVLEVBQThDO1lBQTVDLG9CQUFvQixnQ0FBRyxvQkFBb0I7QUFDcEUsWUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFlBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1RCxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUM7QUFDaEMsY0FBSSxFQUFFLG9FQUE4RCxDQUFDLHNEQUMvQixFQUFFLENBQUMsSUFBSSw2R0FHN0IsQ0FBQztBQUNqQixnQkFBTSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7U0FDckIsQ0FBQyxDQUFDO0FBQ0gsZUFBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7O0FBRTNCLFlBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztPQUN4Qjs7OztBQUtELG1CQUFlOzs7OzthQUFBLDJCQUFFO0FBQ2YsU0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO09BQ2hHOzs7O0FBRUQseUJBQXFCO2FBQUEsK0JBQUMsV0FBVyxFQUFDOzs7QUFHaEMsWUFBSSxLQUFLLEdBQUcsV0FBVyxjQUFpQixRQUFXLE1BQVMsQ0FBQztBQUM3RCxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO09BQy9DOzs7Ozs7U0EzRkMsWUFBWTs7O0FBOEZsQixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ2FudmFzIGZyb20gXCIuL21vZGVscy9DYW52YXNcIjtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcbiAgICAvL1RoaXMgaXMgdGhlICdpbml0JywgYW5kIGFsc28gSSd2ZSBtYWRlIGNhbnZhcyBhIGdsb2JhbCBmb3IgZGV2LlxuICAgIHdpbmRvdy5jYW52YXMgPSBuZXcgQ2FudmFzKCdjYW52YXMnKTtcbn0pO1xuIiwiaW1wb3J0IFVJQ29udHJvbGxlciBmcm9tIFwiLi9VSUNvbnRyb2xsZXJcIjtcblxuY2xhc3MgQ2FudmFzIHtcbiAgICBcbiAgIGNvbnN0cnVjdG9yKGlkT2ZDYW52YXMpe1xuICAgICAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDtcbiAgICAgICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkNhbnZhcyhpZE9mQ2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2FudmFzQ2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgVUlDb250cm9sbGVyKHtjYW52YXM6IHRoaXN9KTtcbiAgIH1cblxuICAgcmVuZGVyKCl7XG4gICAgdGhpcy5mYWJyaWMuc2V0SGVpZ2h0KHRoaXMuaGVpZ2h0KTtcbiAgICB0aGlzLmZhYnJpYy5zZXRXaWR0aCh0aGlzLndpZHRoKTtcbiAgICB0aGlzLmZhYnJpYy5yZW5kZXJBbGwoKTtcbiAgIH1cblxuICAvL0B0b2RvIC8gcmVmYWN0b3IgLSBleHRlbmQgdG8gYSAndHJ5L2NhdGNoJywgYW5kIHJldmVydCBhZGRpbmcgaXQgdG8gZWxlbWVudHMgaWYgaXQgZG9lc24ndCB3b3JrLlxuICAgaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZUhhbmRsZXIpe1xuICAgICAgICB2YXIgY2FudmFzID0gdGhpcy5mYWJyaWM7XG4gICAgICAgIC8vQnkgdXNpbmcgdW5zaGlmdCwgd2UgaGF2ZSB0aGUgbmV3ZXN0IGVsZW1lbnRzIEZJUlNULCB3aGljaCBoZWxwcyB3aXRoIHotaW5kZXggbGF5ZXIgbG9naWMuXG4gICAgICAgIHRoaXMuZWxlbWVudHMudW5zaGlmdChpbWFnZUhhbmRsZXIpO1xuICAgICAgICB0aGlzLnVpLmRyYXdJbWFnZXNMaXN0KHRoaXMuZWxlbWVudHMpXG4gICAgICAgIFxuICAgICAgICB2YXIgW2RlZmF1bHRXaWR0aCwgZGVmYXVsdEhlaWdodF0gPSB0aGlzLmNhbGN1bGF0ZURyYXdpbmdEZWZhdWx0RGltZW5zaW9ucyhpbWFnZUhhbmRsZXIuaW1nKTtcbiAgICAgICAgW2ltYWdlSGFuZGxlci5mYWJyaWMud2lkdGgsIGltYWdlSGFuZGxlci5mYWJyaWMuaGVpZ2h0XSA9IFtkZWZhdWx0V2lkdGgsIGRlZmF1bHRIZWlnaHRdO1xuICAgICAgICBjYW52YXMuYWRkKGltYWdlSGFuZGxlci5mYWJyaWMpO1xuICAgICAgICBpbWFnZUhhbmRsZXIuZmFicmljLmNlbnRlcigpO1xuICAgICAgICBpbWFnZUhhbmRsZXIuZmFicmljLnNldENvb3JkcygpO1xuICAgICAgICBcbiAgIH1cbiAgIFxuICAgY2FsY3VsYXRlRHJhd2luZ0RlZmF1bHREaW1lbnNpb25zKGltYWdlKXtcbiAgICB2YXIgaW1nV2lkdGggPSBpbWFnZS53aWR0aDtcbiAgICB2YXIgaW1nSGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgIHZhciBhc3BlY3RSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0O1xuICAgIC8qKlxuICAgICAqIHI9dy9oXG4gICAgICogdyA9IHJoXG4gICAgICogaCA9IHcvclxuICAgICAqL1xuXG4gICAgaWYgKGltZ1dpZHRoIDw9IGNhbnZhcy53aWR0aCAvIDIgJiYgaW1nSGVpZ2h0IDw9IGNhbnZhcy5oZWlnaHQgLyAyKXtcbiAgICAgICByZXR1cm4gW2ltZ1dpZHRoLCBpbWdIZWlnaHRdXG4gICAgfVxuXG4gICAgLy9qdXN0IGNhbGN1bGF0aW5nIG9mZiBoZWlnaHQgbm93LlxuICAgIC8vc2hvdWxkIGRvIGFub3RoZXIgY2hlY2sgZm9yIHdpZHRoIGFuZCBzY2FsZSBvbiBhc3BlY3QgcmF0aW8hXG4gICAgaWYgKGltZ0hlaWdodCA+IGNhbnZhcy5oZWlnaHQgLyAyKXtcbiAgICAgaW1nSGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIDI7XG4gICAgIGltZ1dpZHRoID0gaW1nSGVpZ2h0ICogYXNwZWN0UmF0aW87IC8vdyA9IGhyXG4gICAgfVxuICAgIC8vd2Ugd2FudCB0byBmaWx0ZXIgYnkgaGVpZ2h0IGZpcnN0LCBhbmQgb25seSBjYXRjaCBjYXNlcyB3ZXJlIHdpZHRoIGlzIFNUSUxMIHRvbyBsb25nXG4gICAgaWYgKGltZ1dpZHRoID4gY2FudmFzLndpZHRoIC8gMil7XG4gICAgICBpbWdXaWR0aCA9IGNhbnZhcy53aWR0aCAvIDI7XG4gICAgICBpbWdIZWlnaHQgPSBpbWdXaWR0aCAvIGFzcGVjdFJhdGlvOyAvLyBoID0gdy9yXG4gICAgfVxuICAgICByZXR1cm4gW2ltZ1dpZHRoLCBpbWdIZWlnaHRdXG4gICB9XG5cbiAgIC8vdG9kbyAtIHJlZmFjdG9yIGludG8gYW4gJ0ltYWdlQ29sbGVjdGlvbicgb2JqZWN0LlxuICAgZmluZEltYWdlQnlOYW1lKG5hbWUpe1xuICAgIGxldCBsaXN0ID0gdGhpcy5lbGVtZW50cztcbiAgICByZXR1cm4gbGlzdC5maWx0ZXIoIHggPT4geC5uYW1lID09PSBuYW1lKVswXTtcbiAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7IiwiaW1wb3J0IEltYWdlSGFuZGxlciBmcm9tIFwiLi9JbWFnZUhhbmRsZXJcIjtcblxuY2xhc3MgSW1hZ2VFbGVtZW50SGFuZGxlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihpZE9mVXBsb2FkSW5wdXRFbGVtZW50LCBjYW52YXMpe1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mVXBsb2FkSW5wdXRFbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuaGFuZGxlSW1hZ2VDaGFuZ2VFdmVudC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIH1cblxuICAgIHJlYWRGaWxlQXN5bmMoZmlsZSl7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7ICBcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgdGhpcy5maWxlUmVhZGVyLm9ubG9hZCA9IGZpbGVSZWFkRXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWcuc3JjID0gZmlsZVJlYWRFdmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5maWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoIGZpbGUgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlSW1hZ2VDaGFuZ2VFdmVudChldil7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICggZXYudGFyZ2V0LmZpbGVzICYmIGV2LnRhcmdldC5maWxlc1swXSApe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZEZpbGVBc3luYyhldi50YXJnZXQuZmlsZXNbMF0pLnRoZW4oIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZXYudGFyZ2V0LmZpbGVzWzBdLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2VIYW5kbGVyKHRoaXMsIGRhdGEsIG5hbWUsIHRoaXMuY2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWcpXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCggRXJyb3IoJ05vIGZpbGUgZm91bmQsIG5vdGhpbmcgdG8gcmVhZC4nKSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0SW1hZ2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1nID8gdGhpcy5pbWcgOiBmYWxzZTtcbiAgICB9XG4gICAgXG5cbn1cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VFbGVtZW50SGFuZGxlcjsiLCJjbGFzcyBJbWFnZUhhbmRsZXJ7XG4gIGNvbnN0cnVjdG9yKGltYWdlRWxlbWVudEhhbmRsZXIsIGZpbGUsIG5hbWUsIGNhbnZhcyApe1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5pbWcgPSBmaWxlO1xuICAgIHRoaXMuaW1hZ2VFbGVtZW50SGFuZGxlciA9IGltYWdlRWxlbWVudEhhbmRsZXI7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgICB0aGlzLmZhYnJpYyA9IG5ldyBmYWJyaWMuSW1hZ2UodGhpcy5pbWcpO1xuICB9XG5cbiAgdG9nZ2xlVmlzaWJpbGl0eSgpe1xuICAgIHRoaXMuZmFicmljLnZpc2libGUgPSAhdGhpcy5mYWJyaWMudmlzaWJsZTtcbiAgICB0aGlzLmNhbnZhcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF9zZXRaSW5kZXgoaW5kZXgpe1xuICAgIHRoaXMuZmFicmljLm1vdmVUbyhpbmRleCk7XG4gIH1cblxuICBzZXRMYXllcihsYXllcil7XG4gICAgLy9sYXllciBpcyBsaWtlIHRoZSBvcHBvc2l0ZSBvZiB6LWluZGV4LlxuICAgIC8vbGF5ZXIgMCBpcyB0aGUgaGlnaGVzdCBsYXllciwgYXMgaXQncyB0aGUgdG9wIG9mIHRoZSBsaXN0XG4gICAgdmFyIGhpZ2hlc3RaSW5kZXggPSB0aGlzLmNhbnZhcy5lbGVtZW50cy5sZW5ndGggLSAxO1xuICAgIHZhciBuZXdaSW5kZXggPSBoaWdoZXN0WkluZGV4IC0gbGF5ZXI7XG4gICAgdGhpcy5fc2V0WkluZGV4KG5ld1pJbmRleCk7XG5cbiAgfVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlSGFuZGxlcjsiLCJpbXBvcnQgSW1hZ2VFbGVtZW50SGFuZGxlciBmcm9tIFwiLi9JbWFnZUVsZW1lbnRIYW5kbGVyXCI7XG5cbmNsYXNzIFVJQ29udHJvbGxlcntcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgLy9vcHRpb25zIHNob3VsZCBpbmNsdWRlOiBcbiAgICAgICAgLy8gIHdoaWNoIHZpZXcgdG8gbG9hZCAoQHRvZG8gaXMgdGhlcmUgYSBlczYgdGVtcGxhdGUgaW1wb3J0IGZyb20gZmlsZT8pXG4gICAgICAgIC8vICB0YXJnZXQsIGkuZS4gaG93IGl0IHNlbGVjdHMgdGhlIGVsZW1lbnQgKGp1c3QgdXNlIGpxdWVyeT8pXG4gICAgICAgICAgICAvL1JJR0hUIE5PVzogaXQncyBzZWxlY3RpbmcgYnkgZGF0YS1jYW52YXNjb250cm9sc3RhcmdldGlkXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJCgnZGl2W2RhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZF0nKVswXTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGBcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz0naW1hZ2VVcGxvYWRMYWJlbCBidG4gYnRuLXByaW1hcnknPiBVcGxvYWQgSW1hZ2VcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2ZpbGUnIGlkPSdpbWFnZVVwbG9hZCcgc3R5bGU9J3Zpc2liaWxpdHk6IGhpZGRlbicgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8IS0tIFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCIuLi5cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+TGVmdDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+TWlkZGxlPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5SaWdodDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgLS0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDx1bCBpZD1cImltYWdlc0xpc3RUZW1wbGF0ZVwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgPC91bD5gO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG9wdGlvbnMuY2FudmFzO1xuXG5cbiAgICAgICAgdGhpcy5pbml0Q29udHJvbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VFbGVtZW50SGFuZGxlcignaW1hZ2VVcGxvYWQnLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgLy8gdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZS5nZXRJbWFnZSgpIClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdENvbnRyb2xzKCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy50YXJnZXQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgJHRhcmdldC53aWR0aCh0aGlzLmNhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMuJGltYWdlc0xpc3QgPSAkKCcjaW1hZ2VzTGlzdFRlbXBsYXRlJyk7XG4gICAgICAgIFxuXG4gICAgICAgICR0YXJnZXQub24oJ2NsaWNrJywgJyNpbWFnZXNMaXN0VGVtcGxhdGUnLCAoZXYpID0+IHtcbiAgICAgICAgICBpZiAoZXYudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklcIil7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUltYWdlVmlzaWJpbGl0eShldi50YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICB9XG5cbiAgICBfaGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24oZSwgdWkpeyAgICAgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSB1aS5pdGVtLmluZGV4KCk7XG4gICAgICB2YXIgbmFtZSA9ICQodWkuaXRlbSkuZmluZCgnLmZpbGVuYW1lJykudGV4dCgpO1xuICAgICAgdmFyIGltYWdlRWxlbWVudE9iaiA9IHRoaXMuY2FudmFzLmZpbmRJbWFnZUJ5TmFtZShuYW1lKTtcbiAgICAgIGltYWdlRWxlbWVudE9iai5zZXRMYXllcihuZXdQb3NpdGlvbik7XG5cbiAgICB9XG5cbiAgICBkcmF3SW1hZ2VzTGlzdChpbWFnZXNMaXN0LCBpbWFnZXNMaXN0VGVtcGxhdGVJRCA9ICdpbWFnZXNMaXN0VGVtcGxhdGUnKXtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1hZ2VzTGlzdFRlbXBsYXRlSUQpO1xuICAgICAgaW1hZ2VzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKXtcbiAgICAgICAgbGV0IGxpID0gYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWluZGV4PSR7aX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdmaWxlbmFtZSc+JHsgZWwubmFtZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2Nsb3NlJz50b2dnbGU8L2k+IFxuICAgICAgICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICBvdXRwdXQgKz0gbGkgKyBcIlxcblwiO1xuICAgICAgfSk7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IG91dHB1dDsgXG5cbiAgICAgIHRoaXMuaW1hZ2VMaXN0RXZlbnRzKCk7ICAgICBcbiAgICB9XG5cblxuICAgIC8vVGhpcyBoYW5kbGVzIHRoZSA8bGk+IGVsZW1lbnRzIGJlaW5nIGRyYWdhYmxlLlxuICAgIC8vTXVzdCByZWJpbmQgYWZ0ZXIgZXZlcnkgdGltZSBkcmF3SW1hZ2VzTGlzdCgpIGlzIGNhbGxlZC5cbiAgICBpbWFnZUxpc3RFdmVudHMoKXtcbiAgICAgICQoJy5saXN0LWdyb3VwJykuc29ydGFibGUoKS5iaW5kKCdzb3J0dXBkYXRlJywgdGhpcy5faGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlSW1hZ2VWaXNpYmlsaXR5KGV2ZW50VGFyZ2V0KXtcbiAgICAgIC8vR2V0IGluZGV4IGZyb20gRE9NIHRvIHVwZGF0ZSBKUyBvYmouXG4gICAgICAvL0tlZXBpbmcgc3RhdGUgKGluZGV4KSBpbiBET00gc28gdGhhdCBhbGwgdGhpcyBtZXRob2QgbmVlZHMgaXMgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgIHZhciBpbmRleCA9IGV2ZW50VGFyZ2V0WydwYXJlbnRFbGVtZW50J11bJ2RhdGFzZXQnXVsnaW5kZXgnXTtcbiAgICAgIHRoaXMuY2FudmFzLmVsZW1lbnRzW2luZGV4XS50b2dnbGVWaXNpYmlsaXR5KClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlDb250cm9sbGVyO1xuIl19
