Overview
========

A set of helper functions attached to the base [Phoenix WM](https://github.com/jasonm23/phoenix).

Usage
=====

To use this configuration, check out this project on your local computer, and
reference it. For example:

    cd ~/
    git clone git@github.com:dsummersl/phoenix-helpers.git

Reference the file from your `.phoenix.cfg`, and use its functions:

    require('~/phoenix-helpers/window.js');

    api.bind('I', ["cmd"  , "alt" , "ctrl"], function() { Window.focusedWindow().showGridInfo(); });
