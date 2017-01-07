//Constants
const SQUARE_PXLENGTH = 25;

//Drawing tools
var canvas;
var ctxt;
var grid;

var colorSquare = function(hue, sat, lig) {
    var h = hue;
    var s = sat;
    var l = lig;

    this.Hue = function() { return h; };
    this.Sat = function() { return s; };
    this.Lig = function() { return l; };

    this.alterHue = function(addend) {
        if (h + addend > 360 || h + addend < 0) {
            h = (h + addend) % 360;
        } else {
            h = h + addend;
        }
    };

    this.alterSat = function(addend) {
        if (s + addend > 100) {
            s = 100;
        } else if (s + addend < 0) {
            s = 0;
        } else {
            s += addend;
        }
    };

    this.alterLig = function(addend) {
        if (l + addend > 100) {
            l = 100;
        } else if (l + addend < 0) {
            l = 0;
        } else {
            l += addend;
        }
    }

    this.stringify = function() {
        return "hsl(" + h + "," + s + "%," + l + "%)";
    }
};

//Event Listeners
//window.addEventListener("resize", resize, false);

/**
  Initializes the animated header. Called once at
  the bottom of the js file.
*/
function init() {
    canvas = document.getElementById("header_bkgd_animated");
    if (canvas.getContext) {
        ctxt = canvas.getContext("2d");

        //    resize();

        grid = new Array(Math.ceil(canvas.height / SQUARE_PXLENGTH));
        for (var x = 0; x < grid.length; x++) {
            grid[x] = new Array(200);
            for (var y = 0; y < grid[x].length; y++) {
                //Rainbow Diagonal
                grid[x][y] = new colorSquare(230 + (x * 2) + (y * 2), 30, 50);
                
                //Sunset
                
            }
        }

        //    resize();
        drawAnimatedBkgd();
    }
}

/**
  Resizes the canvas whenever the window is resized, then redraws.
*/
function resize() {
    ctxt.canvas.width = window.innerWidth;
    ctxt.canvas.height = 200;
}

function colorFlicker(x, y, ligMean, bound) {
    var color = grid[x][y];

    if (color.Lig() <= ligMean - bound) {
        color.alterLig(1);
    } else if (color.Lig() >= ligMean + bound) {
        color.alterLig(-1);
    } else {
        var perc = ((ligMean + bound) - color.Lig());

        if (Math.random() * (bound * 2) > perc) {
            color.alterLig(-1);
        } else {
            color.alterLig(1);
        }
    }
}

/**
  Endlessly animates the header background.
*/
function drawAnimatedBkgd() {
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            if (Math.random() * 10 < 1) {
                colorFlicker(x, y, 50, 5);
            }
            grid[x][y].alterHue(1);
            ctxt.fillStyle = grid[x][y].stringify();
            ctxt.fillRect(y * SQUARE_PXLENGTH, x * SQUARE_PXLENGTH, SQUARE_PXLENGTH, SQUARE_PXLENGTH);
        }
    }

    setTimeout(drawAnimatedBkgd, 1000 / 8);
}

init();
