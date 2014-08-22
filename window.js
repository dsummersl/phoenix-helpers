
// TODO rather than having a global constant - these should be defaults. Use the
// window values and expose functions to modify the window constants.
//
// TODO functions like:
//   setApplication(name, gridSettins, unitSettings, x, y);

// Grid extensions for Windows {{{

// default margin and grid settings for new windows.
var MARGIN_X = 0;
var MARGIN_Y = 0;
var GRID_WIDTH = 2;
var GRID_HEIGHT = 1;

// a dictionary of windows:
var WINDOW_OPTIONS = {};

Window.prototype.getGrid = function() {
  var winFrame = this.frame();
  if (!(this.title() in WINDOW_OPTIONS)) {
    // TODO support a # of units in the window (so it can take up to the # of
    // grids)
    WINDOW_OPTIONS[this.title()] = {
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT
    };
  }
  var screenRect = this.screen().frameWithoutDockOrMenu();
  var screenWidth = screenRect.width / WINDOW_OPTIONS[this.title()].gridWidth;
  var screenHeight = screenRect.height / WINDOW_OPTIONS[this.title()].gridHeight;
  return {
    x: Math.round((winFrame.x - screenRect.x) / screenWidth),
    y: Math.round((winFrame.y - screenRect.y) / screenHeight),
    w: Math.max(1, Math.round(winFrame.width / screenWidth)),
    h: Math.max(1, Math.round(winFrame.height / screenHeight))
  };
};

Window.prototype.setGrid = function(grid, screen) {
  // init the options, if they don't exist:
  this.getGrid();
  var screenRect = screen.frameWithoutDockOrMenu();
  var screenWidth = screenRect.width / WINDOW_OPTIONS[this.title()].gridWidth;
  var screenHeight = screenRect.height / WINDOW_OPTIONS[this.title()].gridHeight;
  var newFrame = {
    x: (grid.x * screenWidth) + screenRect.x,
    y: (grid.y * screenHeight) + screenRect.y,
    width: grid.w * screenWidth,
    height: grid.h * screenHeight
  };

  newFrame.x += MARGIN_X;
  newFrame.y += MARGIN_Y;
  newFrame.width -= (MARGIN_X * 2.0);
  newFrame.height -= (MARGIN_Y * 2.0);

  this.setFrame(newFrame);
}

Window.prototype.snapToGrid = function() {
  if (this.isNormalWindow()) {
    this.setGrid(this.getGrid(), this.screen());
  }
}

// move a frame to the next 'grid'.
Window.prototype.toNextGrid = function() {
  if (this.isNormalWindow()) {
    // init the options, if they don't exist:
    this.getGrid();
    var winFrame = this.frame();
    var screenRect = this.screen().frameWithoutDockOrMenu();
    var frameWidth = screenRect.width / WINDOW_OPTIONS[this.title()].gridWidth;
    var frameHeight = screenRect.height / WINDOW_OPTIONS[this.title()].gridHeight;
    var x = winFrame.x;
    var y = winFrame.y;
    // the size 2 grid for some reason won't hop over to the next grid for some
    // reason b/c I guess it thinks the last one is 'off screen'.
    var multiple = 1;
    if (WINDOW_OPTIONS[this.title()].gridWidth > 2) {
      multiple = 2;
    }
    if (winFrame.x + multiple*frameWidth < screenRect.width) {
      x = (winFrame.x + frameWidth) % screenRect.width;
    }
    else {
      x = 0;
      y = (winFrame.y + frameHeight) % screenRect.height;
    }
    var newFrame = {
      x: x,
      y: y,
      width: frameWidth,
      height: frameHeight
    };
    this.setFrame(newFrame);
    this.snapToGrid();
  }
}

Window.prototype.showGridInfo = function() {
  this.getGrid();
  api.alert("WxH = "+ WINDOW_OPTIONS[this.title()].gridWidth +"x"+ WINDOW_OPTIONS[this.title()].gridHeight);
}

Window.prototype.changeGridHeight = function(by) {
  this.getGrid();
  WINDOW_OPTIONS[this.title()].gridHeight = Math.max(1, WINDOW_OPTIONS[this.title()].gridHeight + by);
  // this.snapToGrid();
  this.showGridInfo();
}

Window.prototype.changeGridWidth = function (by) {
  this.getGrid();
  WINDOW_OPTIONS[this.title()].gridWidth = Math.max(1, WINDOW_OPTIONS[this.title()].gridWidth + by);
  // this.snapToGrid();
  this.showGridInfo();
}

//}}}

// vim: set fdm=marker:
