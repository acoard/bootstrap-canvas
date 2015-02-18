Installation steps:

These are a bit murky, I did things with trial and error.  If you can make them any better, please submit a pull request!

First we must install [Canvas requirements](https://www.npmjs.com/package/canvas).  The instructions are:

1. Have brew installed, and install wget: `brew install wget`
2. wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh
3. Now we can run `npm install`



# Pre-launch checklist
    - Have dependency to Canvas figured out.  Gulp browserify 6to5?  Include in node module?

# Skills/Tools to try and focus on:
    - install bluebird and start using promises, and the Promises.coroutine() function, for everything.
        * Show the async/co-routine program to the team.
        * https://gist.github.com/learncodeacademy/bf04432597334190bef4


# Plan

- Start refactoring canvas to use the fabric element
    - Wrap the Fabric classes with something abstract/generic?  Checkout their image manipulator.
- Split classes into individual files and use modules to import them properly.
- Automatically add bootstrap controls underneath
    - Have some template files: ES6 templating?
    - Bootstrapify the upload button.  Have each component be optional/compartmentalizable.
    - Controls: Have things like rotate be toggle-able.
- Exporting: Have ability to hook into a <form> somehow, provide base64 as something loseless.


Thanks to,
    jQuery
    http://www.html5rocks.com/en/tutorials/dnd/basics/
    6ot5


