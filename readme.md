# Usage

If you want to begin using this library, it's as simple as including `APP.JS` or `APP.MIN.JS` in your project. 

The only requirement is that you have jQuery loaded before this library.  I used jQuery out of habit.  If this dependency annoys you let me know, and I can remove it in the few places it exists.


# Contributing

Contributing requires cloning the entire repo found here, and installingall of the dependencies:
    * Fabric
    * node-canvas

Must be installed (correct?) before anything in this repo.  After that, clone the repo and `npm install`.




# Plan

Start working on the end-dev API as a new module

    API.js (find a better name, should be proj name)

    Constructor:
        - take an option object OR an id of canvas (will use defaults if just ID)

    Public methods:
        - attachToForm()
            - requires: the form to attach to
            - optional: the name of the field.
            - Add an event-listener to the form's "submit" event, and it'll append to it automatically before it posts.





* Improve the bootstrap controls. 
    - Import from template files?
    - Make the layers list properly "affix" to the right or left 
    - Have the UI controls (layers) be optional from the API.
* Exporting: Have ability to hook into a <form> somehow, provide base64 as something loseless.




# Pre-launch checklist
    - Have dependency to Canvas figured out.  Gulp browserify 6to5?  Include in node module?

# Skills/Tools to try and focus on:
    - install bluebird and start using promises, and the Promises.coroutine() function, for everything.
        * Show the async/co-routine program to the team.
        * https://gist.github.com/learncodeacademy/bf04432597334190bef4



Thanks to,
    jQuery
    http://www.html5rocks.com/en/tutorials/dnd/basics/
    6to5 / Babel


