(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9DYW52YXMuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUVsZW1lbnRIYW5kbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvVUlDb250cm9sbGVyLmpzIiwiL1VzZXJzL2Fjb2FyZC9Ecm9wYm94L0NvZGUvZXM2Q2FudmFzL3NyYy9tb2RlbHMvSW1hZ2VIYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FPLFlBQVksMkJBQU0sZ0JBQWdCOztJQUVuQyxNQUFNO0FBRUUsV0FGUixNQUFNLENBRUcsVUFBVTswQkFGbkIsTUFBTTs7QUFHSixRQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDeEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3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TSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDMUM7O3VCQVJHLFlBQVk7QUFVaEIsb0JBQWdCO2FBQUEsNEJBQUU7QUFDaEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMzQyxZQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3RCOzs7O0FBRUQsY0FBVTthQUFBLG9CQUFDLEtBQUssRUFBQztBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzNCOzs7O0FBRUQsWUFBUTthQUFBLGtCQUFDLEtBQUssRUFBQzs7O0FBR2IsWUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNwRCxZQUFJLFNBQVMsR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7T0FFNUI7Ozs7OztTQTFCRyxZQUFZOzs7QUE2QmxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVSUNvbnRyb2xsZXIgZnJvbSBcIi4vVUlDb250cm9sbGVyXCI7XG5cbmNsYXNzIENhbnZhcyB7XG4gICAgXG4gICBjb25zdHJ1Y3RvcihpZE9mQ2FudmFzKXtcbiAgICAgICAgdGhpcy5jYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPZkNhbnZhcyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQ7XG4gICAgICAgIHRoaXMuZmFicmljID0gbmV3IGZhYnJpYy5DYW52YXMoaWRPZkNhbnZhcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNhbnZhc0NsaWNrSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICB0aGlzLnVpID0gbmV3IFVJQ29udHJvbGxlcih7Y2FudmFzOiB0aGlzfSk7XG4gICB9XG5cbiAgIHJlbmRlcigpe1xuICAgIHRoaXMuZmFicmljLnNldEhlaWdodCh0aGlzLmhlaWdodCk7XG4gICAgdGhpcy5mYWJyaWMuc2V0V2lkdGgodGhpcy53aWR0aCk7XG4gICAgdGhpcy5mYWJyaWMucmVuZGVyQWxsKCk7XG4gICB9XG5cbiAgLy9AdG9kbyAvIHJlZmFjdG9yIC0gZXh0ZW5kIHRvIGEgJ3RyeS9jYXRjaCcsIGFuZCByZXZlcnQgYWRkaW5nIGl0IHRvIGVsZW1lbnRzIGlmIGl0IGRvZXNuJ3Qgd29yay5cbiAgIGltcG9ydEltYWdlVG9DYW52YXMoaW1hZ2VIYW5kbGVyKXtcbiAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZmFicmljO1xuICAgICAgICAvL0J5IHVzaW5nIHVuc2hpZnQsIHdlIGhhdmUgdGhlIG5ld2VzdCBlbGVtZW50cyBGSVJTVCwgd2hpY2ggaGVscHMgd2l0aCB6LWluZGV4IGxheWVyIGxvZ2ljLlxuICAgICAgICB0aGlzLmVsZW1lbnRzLnVuc2hpZnQoaW1hZ2VIYW5kbGVyKTtcbiAgICAgICAgdGhpcy51aS5kcmF3SW1hZ2VzTGlzdCh0aGlzLmVsZW1lbnRzKVxuICAgICAgICBcbiAgICAgICAgdmFyIFtkZWZhdWx0V2lkdGgsIGRlZmF1bHRIZWlnaHRdID0gdGhpcy5jYWxjdWxhdGVEcmF3aW5nRGVmYXVsdERpbWVuc2lvbnMoaW1hZ2VIYW5kbGVyLmltZyk7XG4gICAgICAgIFtpbWFnZUhhbmRsZXIuZmFicmljLndpZHRoLCBpbWFnZUhhbmRsZXIuZmFicmljLmhlaWdodF0gPSBbZGVmYXVsdFdpZHRoLCBkZWZhdWx0SGVpZ2h0XTtcbiAgICAgICAgY2FudmFzLmFkZChpbWFnZUhhbmRsZXIuZmFicmljKTtcbiAgICAgICAgaW1hZ2VIYW5kbGVyLmZhYnJpYy5jZW50ZXIoKTtcbiAgICAgICAgaW1hZ2VIYW5kbGVyLmZhYnJpYy5zZXRDb29yZHMoKTtcbiAgICAgICAgXG4gICB9XG4gICBcbiAgIGNhbGN1bGF0ZURyYXdpbmdEZWZhdWx0RGltZW5zaW9ucyhpbWFnZSl7XG4gICAgdmFyIGltZ1dpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgdmFyIGltZ0hlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBpbWdXaWR0aCAvIGltZ0hlaWdodDtcbiAgICAvKipcbiAgICAgKiByPXcvaFxuICAgICAqIHcgPSByaFxuICAgICAqIGggPSB3L3JcbiAgICAgKi9cblxuICAgIGlmIChpbWdXaWR0aCA8PSBjYW52YXMud2lkdGggLyAyICYmIGltZ0hlaWdodCA8PSBjYW52YXMuaGVpZ2h0IC8gMil7XG4gICAgICAgcmV0dXJuIFtpbWdXaWR0aCwgaW1nSGVpZ2h0XVxuICAgIH1cblxuICAgIC8vanVzdCBjYWxjdWxhdGluZyBvZmYgaGVpZ2h0IG5vdy5cbiAgICAvL3Nob3VsZCBkbyBhbm90aGVyIGNoZWNrIGZvciB3aWR0aCBhbmQgc2NhbGUgb24gYXNwZWN0IHJhdGlvIVxuICAgIGlmIChpbWdIZWlnaHQgPiBjYW52YXMuaGVpZ2h0IC8gMil7XG4gICAgIGltZ0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICBpbWdXaWR0aCA9IGltZ0hlaWdodCAqIGFzcGVjdFJhdGlvOyAvL3cgPSBoclxuICAgIH1cbiAgICAvL3dlIHdhbnQgdG8gZmlsdGVyIGJ5IGhlaWdodCBmaXJzdCwgYW5kIG9ubHkgY2F0Y2ggY2FzZXMgd2VyZSB3aWR0aCBpcyBTVElMTCB0b28gbG9uZ1xuICAgIGlmIChpbWdXaWR0aCA+IGNhbnZhcy53aWR0aCAvIDIpe1xuICAgICAgaW1nV2lkdGggPSBjYW52YXMud2lkdGggLyAyO1xuICAgICAgaW1nSGVpZ2h0ID0gaW1nV2lkdGggLyBhc3BlY3RSYXRpbzsgLy8gaCA9IHcvclxuICAgIH1cbiAgICAgcmV0dXJuIFtpbWdXaWR0aCwgaW1nSGVpZ2h0XVxuICAgfVxuXG4gICAvL3RvZG8gLSByZWZhY3RvciBpbnRvIGFuICdJbWFnZUNvbGxlY3Rpb24nIG9iamVjdC5cbiAgIGZpbmRJbWFnZUJ5TmFtZShuYW1lKXtcbiAgICBsZXQgbGlzdCA9IHRoaXMuZWxlbWVudHM7XG4gICAgcmV0dXJuIGxpc3QuZmlsdGVyKCB4ID0+IHgubmFtZSA9PT0gbmFtZSlbMF07XG4gICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsImltcG9ydCBJbWFnZUhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VIYW5kbGVyXCI7XG5cbmNsYXNzIEltYWdlRWxlbWVudEhhbmRsZXIge1xuXG4gICAgY29uc3RydWN0b3IoaWRPZlVwbG9hZElucHV0RWxlbWVudCwgY2FudmFzKXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPZlVwbG9hZElucHV0RWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUltYWdlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB9XG5cbiAgICByZWFkRmlsZUFzeW5jKGZpbGUpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4geyAgXG4gICAgICAgICAgICB0aGlzLmZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5vbmxvYWQgPSBmaWxlUmVhZEV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nLnNyYyA9IGZpbGVSZWFkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCBmaWxlICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUltYWdlQ2hhbmdlRXZlbnQoZXYpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIGV2LnRhcmdldC5maWxlcyAmJiBldi50YXJnZXQuZmlsZXNbMF0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGaWxlQXN5bmMoZXYudGFyZ2V0LmZpbGVzWzBdKS50aGVuKCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV2LnRhcmdldC5maWxlc1swXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlSGFuZGxlcih0aGlzLCBkYXRhLCBuYW1lLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1nKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoIEVycm9yKCdObyBmaWxlIGZvdW5kLCBub3RoaW5nIHRvIHJlYWQuJykgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldEltYWdlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmltZyA/IHRoaXMuaW1nIDogZmFsc2U7XG4gICAgfVxuICAgIFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlRWxlbWVudEhhbmRsZXI7IiwiaW1wb3J0IEltYWdlRWxlbWVudEhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VFbGVtZW50SGFuZGxlclwiO1xuXG5jbGFzcyBVSUNvbnRyb2xsZXJ7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIC8vb3B0aW9ucyBzaG91bGQgaW5jbHVkZTogXG4gICAgICAgIC8vICB3aGljaCB2aWV3IHRvIGxvYWQgKEB0b2RvIGlzIHRoZXJlIGEgZXM2IHRlbXBsYXRlIGltcG9ydCBmcm9tIGZpbGU/KVxuICAgICAgICAvLyAgdGFyZ2V0LCBpLmUuIGhvdyBpdCBzZWxlY3RzIHRoZSBlbGVtZW50IChqdXN0IHVzZSBqcXVlcnk/KVxuICAgICAgICAgICAgLy9SSUdIVCBOT1c6IGl0J3Mgc2VsZWN0aW5nIGJ5IGRhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZFxuICAgICAgICB0aGlzLnRhcmdldCA9ICQoJ2RpdltkYXRhLWNhbnZhc2NvbnRyb2xzdGFyZ2V0aWRdJylbMF07XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBgXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ltYWdlVXBsb2FkTGFiZWwgYnRuIGJ0bi1wcmltYXJ5Jz4gVXBsb2FkIEltYWdlXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdmaWxlJyBpZD0naW1hZ2VVcGxvYWQnIHN0eWxlPSd2aXNpYmlsaXR5OiBoaWRkZW4nIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkxlZnQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPk1pZGRsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+UmlnaHQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIC0tPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgaWQ9XCJpbWFnZXNMaXN0VGVtcGxhdGVcIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgIDwvdWw+YDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcblxuXG4gICAgICAgIHRoaXMuaW5pdENvbnRyb2xzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlRWxlbWVudEhhbmRsZXIoJ2ltYWdlVXBsb2FkJywgdGhpcy5jYW52YXMpO1xuICAgICAgICAgIC8vIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1hZ2UuZ2V0SW1hZ2UoKSApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRDb250cm9scygpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMudGFyZ2V0LmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGU7XG4gICAgICAgICR0YXJnZXQud2lkdGgodGhpcy5jYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLiRpbWFnZXNMaXN0ID0gJCgnI2ltYWdlc0xpc3RUZW1wbGF0ZScpO1xuICAgICAgICBcblxuICAgICAgICAkdGFyZ2V0Lm9uKCdjbGljaycsICcjaW1hZ2VzTGlzdFRlbXBsYXRlJywgKGV2KSA9PiB7XG4gICAgICAgICAgaWYgKGV2LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJXCIpe1xuICAgICAgICAgICAgdGhpcy50b2dnbGVJbWFnZVZpc2liaWxpdHkoZXYudGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KVxuICAgICAgXG4gICAgfVxuXG4gICAgX2hhbmRsZUltYWdlTGlzdFJlb3JnYW5pemF0aW9uKGUsIHVpKXsgICAgICAgIFxuICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gdWkuaXRlbS5pbmRleCgpO1xuICAgICAgdmFyIG5hbWUgPSAkKHVpLml0ZW0pLmZpbmQoJy5maWxlbmFtZScpLnRleHQoKTtcbiAgICAgIHZhciBpbWFnZUVsZW1lbnRPYmogPSB0aGlzLmNhbnZhcy5maW5kSW1hZ2VCeU5hbWUobmFtZSk7XG4gICAgICBpbWFnZUVsZW1lbnRPYmouc2V0TGF5ZXIobmV3UG9zaXRpb24pO1xuXG4gICAgfVxuXG4gICAgZHJhd0ltYWdlc0xpc3QoaW1hZ2VzTGlzdCwgaW1hZ2VzTGlzdFRlbXBsYXRlSUQgPSAnaW1hZ2VzTGlzdFRlbXBsYXRlJyl7XG4gICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGltYWdlc0xpc3RUZW1wbGF0ZUlEKTtcbiAgICAgIGltYWdlc0xpc3QuZm9yRWFjaChmdW5jdGlvbihlbCwgaSl7XG4gICAgICAgIGxldCBsaSA9IGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1pbmRleD0ke2l9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZmlsZW5hbWUnPiR7IGVsLm5hbWUgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdjbG9zZSc+dG9nZ2xlPC9pPiBcbiAgICAgICAgICAgICAgICAgIDwvbGk+YDtcbiAgICAgICAgb3V0cHV0ICs9IGxpICsgXCJcXG5cIjtcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBvdXRwdXQ7IFxuXG4gICAgICB0aGlzLmltYWdlTGlzdEV2ZW50cygpOyAgICAgXG4gICAgfVxuXG5cbiAgICAvL1RoaXMgaGFuZGxlcyB0aGUgPGxpPiBlbGVtZW50cyBiZWluZyBkcmFnYWJsZS5cbiAgICAvL011c3QgcmViaW5kIGFmdGVyIGV2ZXJ5IHRpbWUgZHJhd0ltYWdlc0xpc3QoKSBpcyBjYWxsZWQuXG4gICAgaW1hZ2VMaXN0RXZlbnRzKCl7XG4gICAgICAkKCcubGlzdC1ncm91cCcpLnNvcnRhYmxlKCkuYmluZCgnc29ydHVwZGF0ZScsIHRoaXMuX2hhbmRsZUltYWdlTGlzdFJlb3JnYW5pemF0aW9uLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHRvZ2dsZUltYWdlVmlzaWJpbGl0eShldmVudFRhcmdldCl7XG4gICAgICAvL0dldCBpbmRleCBmcm9tIERPTSB0byB1cGRhdGUgSlMgb2JqLlxuICAgICAgLy9LZWVwaW5nIHN0YXRlIChpbmRleCkgaW4gRE9NIHNvIHRoYXQgYWxsIHRoaXMgbWV0aG9kIG5lZWRzIGlzIHRoZSBldmVudCBvYmplY3QuXG4gICAgICB2YXIgaW5kZXggPSBldmVudFRhcmdldFsncGFyZW50RWxlbWVudCddWydkYXRhc2V0J11bJ2luZGV4J107XG4gICAgICB0aGlzLmNhbnZhcy5lbGVtZW50c1tpbmRleF0udG9nZ2xlVmlzaWJpbGl0eSgpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJQ29udHJvbGxlcjtcbiIsImNsYXNzIEltYWdlSGFuZGxlcntcbiAgY29uc3RydWN0b3IoaW1hZ2VFbGVtZW50SGFuZGxlciwgZmlsZSwgbmFtZSwgY2FudmFzICl7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmltZyA9IGZpbGU7XG4gICAgdGhpcy5pbWFnZUVsZW1lbnRIYW5kbGVyID0gaW1hZ2VFbGVtZW50SGFuZGxlcjtcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICAgIHRoaXMuZmFicmljID0gbmV3IGZhYnJpYy5JbWFnZSh0aGlzLmltZyk7XG4gIH1cblxuICB0b2dnbGVWaXNpYmlsaXR5KCl7XG4gICAgdGhpcy5mYWJyaWMudmlzaWJsZSA9ICF0aGlzLmZhYnJpYy52aXNpYmxlO1xuICAgIHRoaXMuY2FudmFzLnJlbmRlcigpO1xuICB9XG5cbiAgX3NldFpJbmRleChpbmRleCl7XG4gICAgdGhpcy5mYWJyaWMubW92ZVRvKGluZGV4KTtcbiAgfVxuXG4gIHNldExheWVyKGxheWVyKXtcbiAgICAvL2xheWVyIGlzIGxpa2UgdGhlIG9wcG9zaXRlIG9mIHotaW5kZXguXG4gICAgLy9sYXllciAwIGlzIHRoZSBoaWdoZXN0IGxheWVyLCBhcyBpdCdzIHRoZSB0b3Agb2YgdGhlIGxpc3RcbiAgICB2YXIgaGlnaGVzdFpJbmRleCA9IHRoaXMuY2FudmFzLmVsZW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgdmFyIG5ld1pJbmRleCA9IGhpZ2hlc3RaSW5kZXggLSBsYXllcjtcbiAgICB0aGlzLl9zZXRaSW5kZXgobmV3WkluZGV4KTtcblxuICB9XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VIYW5kbGVyOyJdfQ==
