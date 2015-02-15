(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var UIController = _interopRequire(require("./models/UIController"));

var ImageElementHandler = _interopRequire(require("./models/ImageElementHandler"));

var Canvas = _interopRequire(require("./models/Canvas"));




var image, c, ui;
document.addEventListener("DOMContentLoaded", function (event) {
    c = new Canvas("canvas");
    ui = new UIController({ canvas: c });

    debugger;
    //previous 'image' was a global

    //c.importImageToCanvas(image.getImage() )
});

},{"./models/Canvas":2,"./models/ImageElementHandler":3,"./models/UIController":5}],2:[function(require,module,exports){
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

},{"./ImageElementHandler":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0NhbnZhcy5qcyIsIi9Vc2Vycy9hY29hcmQvRHJvcGJveC9Db2RlL2VzNkNhbnZhcy9zcmMvbW9kZWxzL0ltYWdlRWxlbWVudEhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9JbWFnZUhhbmRsZXIuanMiLCIvVXNlcnMvYWNvYXJkL0Ryb3Bib3gvQ29kZS9lczZDYW52YXMvc3JjL21vZGVscy9VSUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sWUFBWSwyQkFBTSx1QkFBdUI7O0lBQ3pDLG1CQUFtQiwyQkFBTSw4QkFBOEI7O0lBQ3ZELE1BQU0sMkJBQU0saUJBQWlCOzs7OztBQUdwQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEtBQUssRUFBRTtBQUMxRCxLQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsTUFBRSxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7O0FBRW5DLGFBQVM7Ozs7Q0FJWixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lDYkksWUFBWSwyQkFBTSxnQkFBZ0I7O0lBQ25DLE1BQU07QUFFRSxXQUZSLE1BQU0sQ0FFRyxVQUFVOzBCQUZuQixNQUFNOztBQUdKLFFBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztB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QyxZQUFJLEtBQUssR0FBRyxXQUFXLGNBQWlCLFFBQVcsTUFBUyxDQUFDO0FBQzdELFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7T0FDL0M7Ozs7OztTQTVGQyxZQUFZOzs7QUErRmxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBVSUNvbnRyb2xsZXIgZnJvbSBcIi4vbW9kZWxzL1VJQ29udHJvbGxlclwiO1xuaW1wb3J0IEltYWdlRWxlbWVudEhhbmRsZXIgZnJvbSBcIi4vbW9kZWxzL0ltYWdlRWxlbWVudEhhbmRsZXJcIjtcbmltcG9ydCBDYW52YXMgZnJvbSBcIi4vbW9kZWxzL0NhbnZhc1wiO1xuXG5cbnZhciBpbWFnZSwgYywgdWk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcbiAgICBjID0gbmV3IENhbnZhcygnY2FudmFzJyk7XG4gICAgdWkgPSBuZXcgVUlDb250cm9sbGVyKHtjYW52YXM6IGN9KTtcblxuICAgIGRlYnVnZ2VyO1xuICAgIC8vcHJldmlvdXMgJ2ltYWdlJyB3YXMgYSBnbG9iYWxcbiAgICBcbiAgICAvL2MuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZS5nZXRJbWFnZSgpIClcbn0pO1xuIiwiLy8gVUlDb250cm9sbGVyID0gcmVxdWlyZSgnVUlDb250cm9sbGVyJyk7XG5pbXBvcnQgVUlDb250cm9sbGVyIGZyb20gXCIuL1VJQ29udHJvbGxlclwiO1xuY2xhc3MgQ2FudmFzIHtcbiAgICBcbiAgIGNvbnN0cnVjdG9yKGlkT2ZDYW52YXMpe1xuICAgICAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9mQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodDtcbiAgICAgICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkNhbnZhcyhpZE9mQ2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2FudmFzQ2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gICB9XG5cbiAgIHJlbmRlcigpe1xuICAgIHRoaXMuZmFicmljLnNldEhlaWdodCh0aGlzLmhlaWdodCk7XG4gICAgdGhpcy5mYWJyaWMuc2V0V2lkdGgodGhpcy53aWR0aCk7XG4gICAgdGhpcy5mYWJyaWMucmVuZGVyQWxsKCk7XG4gICB9XG5cbiAgIGRyYXdHcmVlblNxdWFyZSgpe1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDEwLCAxMCwgMTAwLCAxMDApO1xuICAgfVxuXG4gIC8vQHRvZG8gLyByZWZhY3RvciAtIGV4dGVuZCB0byBhICd0cnkvY2F0Y2gnLCBhbmQgcmV2ZXJ0IGFkZGluZyBpdCB0byBlbGVtZW50cyBpZiBpdCBkb2Vzbid0IHdvcmsuXG4gICBpbXBvcnRJbWFnZVRvQ2FudmFzKGltYWdlSGFuZGxlcil7XG4gICAgICAgIHZhciBjYW52YXMgPSB0aGlzLmZhYnJpYztcbiAgICAgICAgLy9CeSB1c2luZyB1bnNoaWZ0LCB3ZSBoYXZlIHRoZSBuZXdlc3QgZWxlbWVudHMgRklSU1QsIHdoaWNoIGhlbHBzIHdpdGggei1pbmRleCBsYXllciBsb2dpYy5cbiAgICAgICAgdGhpcy5lbGVtZW50cy51bnNoaWZ0KGltYWdlSGFuZGxlcik7XG4gICAgICAgIHRoaXMudWkuZHJhd0ltYWdlc0xpc3QodGhpcy5lbGVtZW50cylcbiAgICAgICAgXG4gICAgICAgIHZhciBbZGVmYXVsdFdpZHRoLCBkZWZhdWx0SGVpZ2h0XSA9IHRoaXMuY2FsY3VsYXRlRHJhd2luZ0RlZmF1bHREaW1lbnNpb25zKGltYWdlSGFuZGxlci5pbWcpO1xuICAgICAgICBbaW1hZ2VIYW5kbGVyLmZhYnJpYy53aWR0aCwgaW1hZ2VIYW5kbGVyLmZhYnJpYy5oZWlnaHRdID0gW2RlZmF1bHRXaWR0aCwgZGVmYXVsdEhlaWdodF07XG4gICAgICAgIGNhbnZhcy5hZGQoaW1hZ2VIYW5kbGVyLmZhYnJpYyk7XG4gICAgICAgIGltYWdlSGFuZGxlci5mYWJyaWMuY2VudGVyKCk7XG4gICAgICAgIGltYWdlSGFuZGxlci5mYWJyaWMuc2V0Q29vcmRzKCk7XG4gICAgICAgIFxuICAgfVxuXG4gICBjYWxjdWxhdGVEcmF3aW5nRGVmYXVsdERpbWVuc2lvbnMoaW1hZ2Upe1xuICAgIHZhciBpbWdXaWR0aCA9IGltYWdlLndpZHRoO1xuICAgIHZhciBpbWdIZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgdmFyIGFzcGVjdFJhdGlvID0gaW1nV2lkdGggLyBpbWdIZWlnaHQ7XG5cbiAgICBpZiAoaW1nV2lkdGggPD0gY2FudmFzLndpZHRoIC8gMiAmJiBpbWdIZWlnaHQgPD0gY2FudmFzLmhlaWdodCAvIDIpe1xuICAgICAgIHJldHVybiBbaW1nV2lkdGgsIGltZ0hlaWdodF1cbiAgICB9XG5cbiAgICAvL2p1c3QgY2FsY3VsYXRpbmcgb2ZmIGhlaWdodCBub3cuXG4gICAgLy9zaG91bGQgZG8gYW5vdGhlciBjaGVjayBmb3Igd2lkdGggYW5kIHNjYWxlIG9uIGFzcGVjdCByYXRpbyFcbiAgICBpZiAoaW1nSGVpZ2h0ID4gY2FudmFzLmhlaWdodCAvIDIpe1xuICAgICBpbWdIZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgaW1nV2lkdGggPSBpbWdIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICB9XG4gICAgLy93ZSB3YW50IHRvIGZpbHRlciBieSBoZWlnaHQgZmlyc3QsIGFuZCBvbmx5IGNhdGNoIGNhc2VzIHdlcmUgd2lkdGggaXMgU1RJTEwgdG9vIGxvbmdcbiAgICBpZiAoaW1nV2lkdGggPiBjYW52YXMud2lkdGggLyAyKXtcbiAgICAgIGltZ1dpZHRoID0gY2FudmFzLndpZHRoIC8gMjtcbiAgICAgIGltZ0hlaWdodCA9IGltZ1dpZHRoICogYXNwZWN0UmF0aW87XG4gICAgfVxuXG4gICAgIHJldHVybiBbaW1nV2lkdGgsIGltZ0hlaWdodF1cbiAgIH1cblxuICAgLy90b2RvIC0gcmVmYWN0b3IgaW50byBhbiAnSW1hZ2VDb2xsZWN0aW9uJyBvYmplY3QuXG4gICBmaW5kSW1hZ2VCeU5hbWUobmFtZSl7XG4gICAgbGV0IGxpc3QgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHJldHVybiBsaXN0LmZpbHRlciggeCA9PiB4Lm5hbWUgPT09IG5hbWUpWzBdO1xuICAgfVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG5cbi8vdG9kbyAtIGluaGVpcml0IG90aGVyIFVJIGVsZW1lbnRzIGZyb20gdGhpcyBjbGFzcywgaS5lLiB0aGUgJ2xpc3QnIC0gTGlzdENvbnRyb2xsZXJcblxuXG4vLyBjbGFzcyBTb3J0YWJsZUltYWdlTGlzdCB7XG5cbi8vIH1cblxuLy8gdmFyIGltYWdlLCBjLCB1aTtcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxuLy8gICAgIGMgPSBuZXcgQ2FudmFzKCdjYW52YXMnKTtcbi8vICAgICB1aSA9IG5ldyBVSUNvbnRyb2xsZXIoe2NhbnZhczogY30pO1xuICAgIFxuLy8gICAgIC8vYy5pbXBvcnRJbWFnZVRvQ2FudmFzKGltYWdlLmdldEltYWdlKCkgKVxuLy8gfSk7XG5cbiIsImltcG9ydCBJbWFnZUhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VIYW5kbGVyXCI7XG5cbmNsYXNzIEltYWdlRWxlbWVudEhhbmRsZXIge1xuXG4gICAgY29uc3RydWN0b3IoaWRPZlVwbG9hZElucHV0RWxlbWVudCwgY2FudmFzKXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPZlVwbG9hZElucHV0RWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUltYWdlQ2hhbmdlRXZlbnQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB9XG5cbiAgICByZWFkRmlsZUFzeW5jKGZpbGUpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4geyAgXG4gICAgICAgICAgICB0aGlzLmZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5vbmxvYWQgPSBmaWxlUmVhZEV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1nLnNyYyA9IGZpbGVSZWFkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCBmaWxlICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUltYWdlQ2hhbmdlRXZlbnQoZXYpe1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIGV2LnRhcmdldC5maWxlcyAmJiBldi50YXJnZXQuZmlsZXNbMF0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRGaWxlQXN5bmMoZXYudGFyZ2V0LmZpbGVzWzBdKS50aGVuKCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGV2LnRhcmdldC5maWxlc1swXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlSGFuZGxlcih0aGlzLCBkYXRhLCBuYW1lLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmltcG9ydEltYWdlVG9DYW52YXMoaW1nKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoIEVycm9yKCdObyBmaWxlIGZvdW5kLCBub3RoaW5nIHRvIHJlYWQuJykgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldEltYWdlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmltZyA/IHRoaXMuaW1nIDogZmFsc2U7XG4gICAgfVxuICAgIFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlRWxlbWVudEhhbmRsZXI7IiwiY2xhc3MgSW1hZ2VIYW5kbGVye1xuICBjb25zdHJ1Y3RvcihpbWFnZUVsZW1lbnRIYW5kbGVyLCBmaWxlLCBuYW1lLCBjYW52YXMgKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaW1nID0gZmlsZTtcbiAgICB0aGlzLmltYWdlRWxlbWVudEhhbmRsZXIgPSBpbWFnZUVsZW1lbnRIYW5kbGVyO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgdGhpcy5mYWJyaWMgPSBuZXcgZmFicmljLkltYWdlKHRoaXMuaW1nKTtcbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoKXtcbiAgICB0aGlzLmZhYnJpYy52aXNpYmxlID0gIXRoaXMuZmFicmljLnZpc2libGU7XG4gICAgdGhpcy5jYW52YXMucmVuZGVyKCk7XG4gIH1cblxuICBfc2V0WkluZGV4KGluZGV4KXtcbiAgICB0aGlzLmZhYnJpYy5tb3ZlVG8oaW5kZXgpO1xuICB9XG5cbiAgc2V0TGF5ZXIobGF5ZXIpe1xuICAgIC8vbGF5ZXIgaXMgbGlrZSB0aGUgb3Bwb3NpdGUgb2Ygei1pbmRleC5cbiAgICAvL2xheWVyIDAgaXMgdGhlIGhpZ2hlc3QgbGF5ZXIsIGFzIGl0J3MgdGhlIHRvcCBvZiB0aGUgbGlzdFxuICAgIHZhciBoaWdoZXN0WkluZGV4ID0gdGhpcy5jYW52YXMuZWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICB2YXIgbmV3WkluZGV4ID0gaGlnaGVzdFpJbmRleCAtIGxheWVyO1xuICAgIHRoaXMuX3NldFpJbmRleChuZXdaSW5kZXgpO1xuXG4gIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUhhbmRsZXI7IiwiaW1wb3J0IEltYWdlRWxlbWVudEhhbmRsZXIgZnJvbSBcIi4vSW1hZ2VFbGVtZW50SGFuZGxlclwiO1xuXG5jbGFzcyBVSUNvbnRyb2xsZXJ7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIC8vb3B0aW9ucyBzaG91bGQgaW5jbHVkZTogXG4gICAgICAgIC8vICB3aGljaCB2aWV3IHRvIGxvYWQgKEB0b2RvIGlzIHRoZXJlIGEgZXM2IHRlbXBsYXRlIGltcG9ydCBmcm9tIGZpbGU/KVxuICAgICAgICAvLyAgdGFyZ2V0LCBpLmUuIGhvdyBpdCBzZWxlY3RzIHRoZSBlbGVtZW50IChqdXN0IHVzZSBqcXVlcnk/KVxuICAgICAgICAgICAgLy9SSUdIVCBOT1c6IGl0J3Mgc2VsZWN0aW5nIGJ5IGRhdGEtY2FudmFzY29udHJvbHN0YXJnZXRpZFxuICAgICAgICB0aGlzLnRhcmdldCA9ICQoJ2RpdltkYXRhLWNhbnZhc2NvbnRyb2xzdGFyZ2V0aWRdJylbMF07XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBgXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ltYWdlVXBsb2FkTGFiZWwgYnRuIGJ0bi1wcmltYXJ5Jz4gVXBsb2FkIEltYWdlXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdmaWxlJyBpZD0naW1hZ2VVcGxvYWQnIHN0eWxlPSd2aXNpYmlsaXR5OiBoaWRkZW4nIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPCEtLSBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiLi4uXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkxlZnQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPk1pZGRsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+UmlnaHQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIC0tPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgaWQ9XCJpbWFnZXNMaXN0VGVtcGxhdGVcIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgIDwvdWw+YDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRpb25zLmNhbnZhcztcbiAgICAgICAgdGhpcy5jYW52YXMudWkgPSB0aGlzO1xuXG5cbiAgICAgICAgdGhpcy5pbml0Q29udHJvbHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VFbGVtZW50SGFuZGxlcignaW1hZ2VVcGxvYWQnLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgLy8gdGhpcy5jYW52YXMuaW1wb3J0SW1hZ2VUb0NhbnZhcyhpbWFnZS5nZXRJbWFnZSgpIClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdENvbnRyb2xzKCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy50YXJnZXQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgJHRhcmdldC53aWR0aCh0aGlzLmNhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMuJGltYWdlc0xpc3QgPSAkKCcjaW1hZ2VzTGlzdFRlbXBsYXRlJyk7XG4gICAgICAgIFxuXG4gICAgICAgICR0YXJnZXQub24oJ2NsaWNrJywgJyNpbWFnZXNMaXN0VGVtcGxhdGUnLCAoZXYpID0+IHtcbiAgICAgICAgICBpZiAoZXYudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklcIil7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUltYWdlVmlzaWJpbGl0eShldi50YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICB9XG5cbiAgICBfaGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24oZSwgdWkpeyAgICAgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSB1aS5pdGVtLmluZGV4KCk7XG4gICAgICB2YXIgbmFtZSA9ICQodWkuaXRlbSkuZmluZCgnLmZpbGVuYW1lJykudGV4dCgpO1xuICAgICAgdmFyIGltYWdlRWxlbWVudE9iaiA9IHRoaXMuY2FudmFzLmZpbmRJbWFnZUJ5TmFtZShuYW1lKTtcbiAgICAgIGltYWdlRWxlbWVudE9iai5zZXRMYXllcihuZXdQb3NpdGlvbik7XG5cbiAgICB9XG5cbiAgICBkcmF3SW1hZ2VzTGlzdChpbWFnZXNMaXN0LCBpbWFnZXNMaXN0VGVtcGxhdGVJRCA9ICdpbWFnZXNMaXN0VGVtcGxhdGUnKXtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1hZ2VzTGlzdFRlbXBsYXRlSUQpO1xuICAgICAgaW1hZ2VzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKXtcbiAgICAgICAgbGV0IGxpID0gYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWluZGV4PSR7aX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdmaWxlbmFtZSc+JHsgZWwubmFtZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2Nsb3NlJz50b2dnbGU8L2k+IFxuICAgICAgICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICBvdXRwdXQgKz0gbGkgKyBcIlxcblwiO1xuICAgICAgfSk7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IG91dHB1dDsgXG5cbiAgICAgIHRoaXMuaW1hZ2VMaXN0RXZlbnRzKCk7ICAgICBcbiAgICB9XG5cblxuICAgIC8vVGhpcyBoYW5kbGVzIHRoZSA8bGk+IGVsZW1lbnRzIGJlaW5nIGRyYWdhYmxlLlxuICAgIC8vTXVzdCByZWJpbmQgYWZ0ZXIgZXZlcnkgdGltZSBkcmF3SW1hZ2VzTGlzdCgpIGlzIGNhbGxlZC5cbiAgICBpbWFnZUxpc3RFdmVudHMoKXtcbiAgICAgICQoJy5saXN0LWdyb3VwJykuc29ydGFibGUoKS5iaW5kKCdzb3J0dXBkYXRlJywgdGhpcy5faGFuZGxlSW1hZ2VMaXN0UmVvcmdhbml6YXRpb24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlSW1hZ2VWaXNpYmlsaXR5KGV2ZW50VGFyZ2V0KXtcbiAgICAgIC8vR2V0IGluZGV4IGZyb20gRE9NIHRvIHVwZGF0ZSBKUyBvYmouXG4gICAgICAvL0tlZXBpbmcgc3RhdGUgKGluZGV4KSBpbiBET00gc28gdGhhdCBhbGwgdGhpcyBtZXRob2QgbmVlZHMgaXMgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgIHZhciBpbmRleCA9IGV2ZW50VGFyZ2V0WydwYXJlbnRFbGVtZW50J11bJ2RhdGFzZXQnXVsnaW5kZXgnXTtcbiAgICAgIHRoaXMuY2FudmFzLmVsZW1lbnRzW2luZGV4XS50b2dnbGVWaXNpYmlsaXR5KClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlDb250cm9sbGVyO1xuIl19
