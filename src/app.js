import Canvas from "./models/Canvas";


document.addEventListener("DOMContentLoaded", function(event) { 
    //This is the 'init', and also I've made canvas a global for dev.
    window.canvas = new Canvas('canvas');
});
