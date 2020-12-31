/*
Author: Josh Greig

You can chat with me on facebook at 
https://www.facebook.com/josh.greig.5 or email me at josh.greig@gmail.com if you have questions about this.  
I'm more than happy to help.  

Suggestions for improving my code is also very appreciated.  
- Do you want other types of fractals added?  
- Want to see a 3D fractal?
- Think I should optimize something with WebGL shaders or some other technique?
*/

function MandelbrotSet() {
    var self = this;
    
    self.name = 'Mandelbrot Set';
    
    self.getValueAt = function(x, y) {
        var xt;
        var zx = 0, zy = 0;
        var cy = y;
        var cx = x;

        for (var i = 0; i < 255 && zx < 2; i++) {
            xt = zx * zy;
            zx = zx * zx - zy * zy + cx;
            zy = 2 * xt + cy;
        }

        return i;
    };
}

function BurningShip() {
    var self = this;

    self.name = 'Burning Ship';

    self.getValueAt = function(x, y) {
        var xt;
        var zx = 0, zy = 0;
        var cy = y;
        var cx = x;
		var i = 0;

        for (; i < 255 && zx*zx + zy*zy < 4.0; i++) {
			xt = zx*zx - zy*zy + x; 
			zy = Math.abs(2.0*zx*zy) + y;
			zx = xt;
        }

        return i;
    };
}

function JuliaSet() {
    var self = this;
    
    self.x = -0.704029749122184;
    self.y = -0.3383527246917294;
    self.name = 'Julia Set';

    self.getInputs = function() {
        return [{'name': 'x', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.x}, {'name': 'y', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.y}];
    };

    self.getValueAt = function(x, y) {
        var n = 255;

        var cRe = self.x;
        var cIm = self.y;
        var newRe = x;
        var newIm = y;
        for(var i = 0; i < 255; i++)
        {
          //remember value of previous iteration
          var oldRe = newRe;
          var oldIm = newIm;
          //the actual iteration, the real and imaginary part are calculated
          newRe = oldRe * oldRe - oldIm * oldIm + cRe;
          newIm = 2 * oldRe * oldIm + cIm;
          //if the point is outside the circle with radius 2: stop
          if((newRe * newRe + newIm * newIm) > 4) break;
        }
    
        return i;
    };
}

/*
JulaSetAndMandelBrot is for exploring the mandelbrot and juliaset spaces together.

This covers all mandelbrot juliaset fractals and more.
Unlike Mandelbrot and Juliaset, this also visualizes patterns 
where 1 mandelbrot and 1 juliaset value are given by screen coordinates.

Juliaset calculations depend on 4 values.  These are:
- a mandelbrot x, y position.  This is kept constant for a juliaset drawing.
- a juliaset x, y position.  This is kept as 0, 0 when drawing the mandelbrot fractal.
*/
function JuliaSetAndMandelbrot() {
    var self = this;
    
    self.mandelBrotX = -0.704029749122184;
    self.mandelBrotY = -0.3383527246917294;
    self.juliasetX = 0;
    self.juliasetY = 0;
    self.xProperty = 'juliasetX';
    self.yProperty = 'mandelBrotY';
    self.name = '4D Julia Set/Mandelbrot';

    self.getInputs = function() {
        return [
            {'name': 'mandelBrotX', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.mandelBrotX},
            {'name': 'mandelBrotY', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.mandelBrotY},
            {'name': 'juliasetX', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.juliasetX},
            {'name': 'juliasetY', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.juliasetY},
            {'name': 'xProperty', 'options': ['juliasetX', 'juliasetY', 'mandelBrotX', 'mandelBrotY'], 'value': 'juliasetX'},
            {'name': 'yProperty', 'options': ['juliasetX', 'juliasetY', 'mandelBrotX', 'mandelBrotY'], 'value': 'mandelBrotX'}
        ];
    };
    
    // Gets the specified property while respecting the overrides for x and y.
    // @param propertyName is the name of a property such as 'juliasetX' or 'mandelBrotX'.
    self.getWithOverride = function(propertyName, x, y) {
        if (self.xProperty === propertyName)
            return x; // use the x override because horizontal dimension on screen corresponds with specified property.
        else if (self.yProperty === propertyName)
            return y; // use the y override because vertical dimension on screen corresponds with specified property.
        else
            return self[propertyName]; // get from the dialog's slider values.
    };

    self.getValueAt = function(x, y) {
        var n = 255;

        var cRe = self.getWithOverride('mandelBrotX', x, y);
        var cIm = self.getWithOverride('mandelBrotY', x, y);
        var newRe = self.getWithOverride('juliasetX', x, y);
        var newIm = self.getWithOverride('juliasetY', x, y);

        for(var i = 0; i < 255; i++)
        {
          //remember value of previous iteration
          var oldRe = newRe;
          var oldIm = newIm;
          //the actual iteration, the real and imaginary part are calculated
          newRe = oldRe * oldRe - oldIm * oldIm + cRe;
          newIm = 2 * oldRe * oldIm + cIm;
          //if the point is outside the circle with radius 2: stop
          if((newRe * newRe + newIm * newIm) > 4) break;
        }
    
        return i;
    };
}

function Kosh() {
    var self = this;
    
    self.name = 'Koch';
    
    self.getRangeInfo = function() {
        return {
            'minX': -1,
            'maxX': 1,
            'minY': -1,
            'maxY': 1
        };
    };
    
    function drawTriangles(g, minX, minY, width, height, canvasWidth, canvasHeight) {
        if (width < 3 || minX > canvasWidth || minY > canvasHeight || minX + width < 0 || minY + height < 0) {
            return; // Don't draw such small shapes or shapes that exclusively show off the canvas.
        }
        var cx = minX + width * 0.5;
        var cy = minY + height * 0.5;
        var i, x, y;
        var angle;
        for (i = 0; i <= 12; i++) {
            var radius = width * 0.5;
            if (i % 2 === 1) {
                radius *= 0.57735026918962576450914878050196; // radius = width / 4 * Math.cos(30 degrees);
            }
            angle = i * Math.PI / 6; // radians
            x = cx + radius * Math.cos(angle);
            y = cy + radius * Math.sin(angle);
            if (i === 0) {
                g.moveTo(x,y);
            }
            else {
                g.lineTo(x,y);
            }
        }
        radius = width * 1 / 3;
        width /= 3;
        height /= 3;
        for (i = 0; i < 6; i++) {
            angle = i * Math.PI / 3; // radians
            x = cx + radius * Math.cos(angle);
            y = cy + radius * Math.sin(angle);
            drawTriangles(g, x - width / 2, y - height / 2, width, height, canvasWidth, canvasHeight);
        }
    }
    
    self.draw = function(g, colourPalette, zoom) {
        var foregroundColour = colourPalette(255);
        var backgroundColour = colourPalette(0);
        var range = self.getRangeInfo();
        var minP = zoom.viewerCoordinatesToPixels(range.minX, range.minY);
        var maxP = zoom.viewerCoordinatesToPixels(range.maxX, range.maxY);
        var size = zoom.getPixelSize();

        // Clear the display.
        g.fillStyle = backgroundColour;
        g.fillRect(0, 0, size.width, size.height);

        // Draw the fractal.
        g.fillStyle = foregroundColour;
        g.beginPath();
        drawTriangles(g, minP.x, minP.y, maxP.x - minP.x, maxP.y - minP.y, size.width, size.height);
        g.closePath();
        g.fill();
    };
}

/**
I found this fractal mentioned at http://blog.zacharyabel.com/tag/fractals/
*/
function HexFractal() {
    var self = this;
    
    self.name = 'Hex Fractal';
    
    self.getRangeInfo = function() {
        return {
            'minX': -1,
            'maxX': 1,
            'minY': -1,
            'maxY': 1
        };
    };
    
    function drawShapes(g, minX, minY, width, height, canvasWidth, canvasHeight) {
        if (width < 3 || minX > canvasWidth || minY > canvasHeight || minX + width < 0 || minY + height < 0) {
            return; // Don't draw such small shapes or shapes that exclusively show off the canvas.
        }
        var cx = minX + width * 0.5;
        var cy = minY + height * 0.5;
        var radius = width / 2;
        
        // Draw an outline.
        for (var i = 0; i <= 6; i++) {
            var angle = i * Math.PI / 3;
            var x = cx + radius * Math.cos(angle), y = cy + radius * Math.sin(angle);
            if (i === 0) {
                g.moveTo(x, y);
            }
            else {
                g.lineTo(x, y);
            }
        }
        radius = width / 3;
        var mediumRadius = width * (0.86602540378443864676372317075294 * 8 / 9 / 2);
        var smallRadius = radius / 2;
        var tinyRadius = radius / 6;
        for (var i = 0; i < 6; i++) {
            var angle = i * Math.PI / 3;
            var x = cx + radius * Math.cos(angle), y = cy + radius * Math.sin(angle);
            drawShapes(g, x - smallRadius, y - smallRadius, smallRadius * 2, smallRadius * 2, canvasWidth, canvasHeight);
            
            angle = (i + 0.5) * Math.PI / 3;
            x = cx + mediumRadius * Math.cos(angle), y = cy + mediumRadius * Math.sin(angle);
            drawShapes(g, x - tinyRadius, y - tinyRadius, tinyRadius * 2, tinyRadius * 2, canvasWidth, canvasHeight);
        }
    }
    
    self.draw = function(g, colourPalette, zoom) {
        var foregroundColour = colourPalette(255);
        var backgroundColour = colourPalette(0);
        var range = self.getRangeInfo();
        var minP = zoom.viewerCoordinatesToPixels(range.minX, range.minY);
        var maxP = zoom.viewerCoordinatesToPixels(range.maxX, range.maxY);
        var size = zoom.getPixelSize();

        // Clear the display.
        g.fillStyle = backgroundColour;
        g.fillRect(0, 0, size.width, size.height);

        // Draw the fractal.
        g.strokeStyle = foregroundColour;
        g.beginPath();
        drawShapes(g, minP.x, minP.y, maxP.x - minP.x, maxP.y - minP.y, size.width, size.height);
        g.closePath();
        g.stroke();
    };
}

function SierpinskiCarpet() {
    var self = this;
    
    self.name = 'Sierpinski Carpet';
    self.minSquareSize = 1.5;

    self.getRangeInfo = function() {
        return {
            'minX': -1,
            'maxX': 1,
            'minY': -1,
            'maxY': 1
        };
    };

    self.getInputs = function() {
        return [{'name': 'minSquareSize', 'min': 1.1, 'max': 20, 'step': 0.05, 'value': self.minSquareSize, 'requiresZoomReset': false}];
    };

    function drawSquares(g, left, top, width, height, canvasWidth, canvasHeight) {
        if (width < self.minSquareSize || height < self.minSquareSize) {
            return; // No need to draw such tiny shapes.
        }
        if (left + width < 0 || top + height < 0 || top > canvasHeight || left > canvasWidth) {
            return; // No need to draw stuff off screen.
        }
        g.rect(left, top, width, height);

        // draw .
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (x !== 1 || y !== 1) {
                    drawSquares(g, left + width * x / 3, top + height * y / 3, width / 3, height / 3, canvasWidth, canvasHeight);
                }
            }
        }
    }
    
    self.draw = function(g, colourPalette, zoom) {
        var foregroundColour = colourPalette(255);
        var backgroundColour = colourPalette(0);
        var range = self.getRangeInfo();
        var minP = zoom.viewerCoordinatesToPixels(range.minX, range.minY);
        var maxP = zoom.viewerCoordinatesToPixels(range.maxX, range.maxY);
        var size = zoom.getPixelSize();

        // Clear the display.
        g.fillStyle = backgroundColour;
        g.fillRect(0, 0, size.width, size.height);

        // Draw the fractal.
        g.strokeStyle = foregroundColour;
        g.beginPath();
        drawSquares(g, minP.x, minP.y, maxP.x - minP.x, maxP.y - minP.y, size.width, size.height);
        g.closePath();
        g.stroke();
    };
    
}

function SierpinskiTriangle() {
    var self = this;
    
    self.name = 'Sierpinski Triangle';
    var yScale = 0.86602540378443864676372317075294;
    self.minTriangleSize = 2;

    self.getRangeInfo = function() {
        return {
            'minX': -1,
            'maxX': 1,
            'minY': -yScale,
            'maxY': yScale
        };
    };

    self.getInputs = function() {
        return [{'name': 'minTriangleSize', 'min': 1.5, 'max': 50, 'step': 0.1, 'value': self.minTriangleSize, 'requiresZoomReset': false}];
    };

    function drawTriangle(g, left, top, width, height, canvasWidth, canvasHeight) {
        if (width < self.minTriangleSize || height < self.minTriangleSize) {
            return; // No need to draw such tiny shapes.
        }
        if (left + width < 0 || top + height < 0 || top > canvasHeight || left > canvasWidth) {
            return; // No need to draw stuff off screen.
        }
        var middleX = left + width * 0.5;
        g.moveTo(middleX, top);
        g.lineTo(left, top + height);
        g.lineTo(left + width, top + height);
        g.lineTo(middleX, top);
        
        // draw top triangle.
        drawTriangle(g, left + 0.25 * width, top, width * 0.5, height * 0.5, canvasWidth, canvasHeight);

        // draw bottom left triangle.
        drawTriangle(g, left, top + 0.5 * height, width * 0.5, height * 0.5, canvasWidth, canvasHeight);
        
        // draw bottom right triangle.
        drawTriangle(g, left + 0.5 * width, top + 0.5 * height, width * 0.5, height * 0.5, canvasWidth, canvasHeight);
    }
    
    self.draw = function(g, colourPalette, zoom) {
        var foregroundColour = colourPalette(255);
        var backgroundColour = colourPalette(0);
        var triangleRange = self.getRangeInfo();
        var minP = zoom.viewerCoordinatesToPixels(triangleRange.minX, triangleRange.minY);
        var maxP = zoom.viewerCoordinatesToPixels(triangleRange.maxX, triangleRange.maxY);
        var size = zoom.getPixelSize();

        // Clear the display.
        g.fillStyle = backgroundColour;
        g.fillRect(0, 0, size.width, size.height);

        // Draw the fractal.
        g.strokeStyle = foregroundColour;
        g.beginPath();
        drawTriangle(g, minP.x, minP.y, maxP.x - minP.x, maxP.y - minP.y, size.width, size.height);
        g.closePath();
        g.stroke();
    };
}

/*
The Sololearnski Carpet is a newly invented fractal inspired by both the Sololearn logo and the Sierpinski Carpet.

Hopefully Sololearn doesn't hunt me(Josh Greig) down for misusing their logo.

The data for where the pattern repeats is defined in the HTML section.
*/
function SololearnskiCarpet() {
    var self = this;
    
    self.name = 'Sololearnski Carpet';
    self.css_class = 'sololearnski';
    var smallestCircleRadius = 0.000001;
    var grid; 
    // grid is used for efficiency to minimize the number of circles we need to look at 
    // while checking a specific point in the fractal.
    
    function initializeGrid() {
        grid = [];
        for (var i = 0; i < SololearnskiCarpet.gridSize; i++ ) {
            var row = [];
            for (var j = 0; j < SololearnskiCarpet.gridSize; j++ ) {
                row.push([]);
            }
            grid.push(row);
        }
        var count = 0;
        circles.forEach(function(circle) {
            // Add the circle to the cells in the grid that it may overlap.
            var maxR = 1;
            var minR = SololearnskiCarpet.minRadiusRatio;
            // The + 1 and - 1 is to rule out error with integer rounding on the grid pattern.
            maxR = maxR * circle.radius + 2;
            minR = Math.max(0, minR * circle.radius - 2);
            var maxRSquared = maxR * maxR;
            var minRSquared = minR * minR;
            
            for (var dx = - Math.round(maxR); dx < maxR; dx++) {
                var dxSquared = dx * dx;
                var maxYSquared = maxRSquared - dxSquared;
                if (maxYSquared > 0) { // avoid trying to get square root of a negative or 0.
                    var maxY = Math.sqrt(maxYSquared);
                    for (var dy = - Math.round(maxY); dy < maxY; dy++) {
                        var distanceSquared = dxSquared + dy * dy;
                        if (distanceSquared <= maxRSquared && distanceSquared >= minRSquared) {
                            var x = Math.round(dx + circle.cx);
                            var y = Math.round(dy + circle.cy);
                            if (x >= 0 && y >= 0 && x < grid.length && y < grid[x].length) {
                                grid[x][y].push(circle);
                                count++;
                            }
                        }
                    }
                }
            }
        });
    }
    
    self.getRangeInfo = function() {
        return {
            'minX': -1,
            'maxX': 1,
            'minY': -1,
            'maxY': 1
        };
    };
    
    self.adaptToZoom = function(averageSize) {
        smallestCircleRadius = Math.max(0.00000000000001, averageSize * 0.0001);
    };

    function checkCircle(circle, x, y, circleRadius) {
        // Base case for recursion.
        if (circleRadius < smallestCircleRadius) {
            return true;
        }
        x = (x - circle.cx + circle.radius) / circle.radius;
        y = (y - circle.cy + circle.radius) / circle.radius;
        x *= SololearnskiCarpet.gridSize * 0.5;
        y *= SololearnskiCarpet.gridSize * 0.5;
        var px = Math.round(x);
        var py = Math.round(y);
        if (px < 0 || px >= grid.length || py < 0 || py >= grid[0].length) {
            return false;
        }
        var circlesToCheck = grid[parseInt(x)][parseInt(y)];
        for (var i = 0; i < circlesToCheck.length; i++) {
            var circle = circlesToCheck[i];
            if (checkCircle(circle, x, y, circle.radius * circleRadius / SololearnskiCarpet.gridSize)) {
                return true;
            }
        }
        return false; 
    }

    self.getValueAt = function(x, y) {
        x += 1;
        y += 1;
        if (x < 0 || y < 0 || x > 2 || y > 2) {
            return 0;
        }
        x *= SololearnskiCarpet.gridSize / 2;
        y *= SololearnskiCarpet.gridSize / 2;

        var circlesToCheck = grid[parseInt(x)][parseInt(y)];
        if (circlesToCheck === undefined) {
            return 0;
        }
        for (var i = 0; i < circlesToCheck.length; i++) {
            var circle = circlesToCheck[i];
            if (checkCircle(circle, x, y, circle.radius)) {
                return 1000;
            }
        }

        return 0;
    };
    
    initializeGrid();
}

SololearnskiCarpet.gridSize = 600;
SololearnskiCarpet.minRadiusRatio = 0.40041861506392995;

SololearnskiCarpet.init = function() {

    /*
    The circles data defined in HTML is only for 1 of the 6 repeating and rotated shapes.
    uncompressCircleData repeats, scales, and rotates the single shape 6 times to create 
    a complete Sololearn logo pattern.
    */
    function uncompressCircleData(size) {     
        var sololearnCx = circles[1].cx * 0.8788;
        var sololearnCy = circles[1].cx * 1.6835;
        var sololearnRadius = sololearnCy * 1.02;

        function replicateSixTimes() {
            var extraCircles = [];
        
            for (var i = 0; i < 6; i++) {
                var angle = i * Math.PI / 3; // radians
                var sinAngle = Math.sin(angle);
                var cosAngle = Math.cos(angle);
                circles.forEach(function(circle) {
                    var x = circle.cx - sololearnCx, y = circle.cy - sololearnCy;
                    var rx = x * cosAngle - y * sinAngle;
                    var ry = y * cosAngle + x * sinAngle;
                    extraCircles.push({
                        'radius': circle.radius,
                        'cx': rx,
                        'cy': ry
                    });
                });
            }
            
            extraCircles.forEach(scaleAndTranslateCircle);
            
            circles = extraCircles;
        }
    
        function scaleAndTranslateCircle(circle) {
            var scaleFactor = size / sololearnRadius * 0.5;
            circle.radius *= scaleFactor;
            circle.cx += sololearnRadius;
            circle.cy += sololearnRadius;
            circle.cx *= scaleFactor;
            circle.cy *= scaleFactor;
        }
        
        replicateSixTimes();
    }

    uncompressCircleData(SololearnskiCarpet.gridSize);
};

function Zoom() {
    var self = this;
    var offsetX;
    var offsetY;
    var width, height;
    var pixelWidth, pixelHeight;
    var scaleFactorChange = 0.2;
    
    self.getPixelSize = function() {
        return {
            "width": pixelWidth,
            "height": pixelHeight
        };
    };

    self.getAverageSize = function() {
        return (width + height) * 0.5;
    };
    
    self.resized = function() {
        var $canvas = $('canvas');
        pixelWidth = $canvas.width();
        pixelHeight = $canvas.height();

        var newAspectRatio = pixelWidth / pixelHeight;
        var area = width * height;

        // preserve the aspect ratio.        
        width = Math.sqrt(area * newAspectRatio);
        height = width / newAspectRatio;
    };
    
    self.setDimensionsForDownload = function(width, height) {
        var $canvas = $('canvas');
        $canvas.width(width).attr('width', width);
        $canvas.height(height).attr('height', height);
        self.resized();
    };

    self.reset = function() {
        self.resized();
        var newAspectRatio = pixelWidth / pixelHeight;
        var area = 4 * 4;
        width = Math.sqrt(area * newAspectRatio);
        height = width / newAspectRatio;

        offsetX = - width * 0.5;
        offsetY = - height * 0.5;
    };
    
    // Used for dragging the view around.
    self.translatePixelsBy = function(dx, dy) {
        offsetX -= dx * width / pixelWidth;
        offsetY -= dy * height / pixelHeight;
    };
    
    self.viewerCoordinatesToPixels = function (x, y) {
        return {
            'x': (x - offsetX) * pixelWidth / width,
            'y': (y - offsetY) * pixelHeight / height
        };
    };

    self.pixelsToViewerCoordinates = function(x, y) {
        return {
            'x': x / pixelWidth * width + offsetX,
            'y': y / pixelHeight * height + offsetY
        };
    }

    function getZoomInCoordinates(x, y) {
        var p = self.pixelsToViewerCoordinates(x, y);
        var result = {
            'width': width * scaleFactorChange,
            'height': height * scaleFactorChange
        };
        result.offsetX = p.x - result.width * 0.5;
        result.offsetY = p.y - result.height * 0.5;

        return result;
    }

    // Finds pixel coordinates that would be zoomed into if clicking at the specified x, y position.    
    self.getZoomInCoordinates = function(x, y) {
        var viewerCoordinateInfo = getZoomInCoordinates(x, y);
        var p = self.viewerCoordinatesToPixels(viewerCoordinateInfo.offsetX, viewerCoordinateInfo.offsetY);

        return {
            'width': viewerCoordinateInfo.width * pixelWidth / width,
            'height': viewerCoordinateInfo.height * pixelHeight / height,
            'offsetX': p.x,
            'offsetY': p.y
        };
    };

    self.zoomInto = function(x, y) {
        var newInfo = getZoomInCoordinates(x, y);
        offsetX = newInfo.offsetX;
        offsetY = newInfo.offsetY;
        width = newInfo.width;
        height = newInfo.height;
    };
    
    self.zoomOut = function() {
        var middleX = offsetX + width * 0.5;
        var middleY = offsetY + height * 0.5;
        offsetX = middleX - (width / scaleFactorChange) * 0.5;
        offsetY = middleY - (height / scaleFactorChange) * 0.5;
        width /= scaleFactorChange;
        height /= scaleFactorChange;
    };

    self.reset();
    self.resized();
}

function toTwoDigits(v) {
    v = Math.round(v);
    v = Math.min(255, Math.max(0, v));
    var twoDigits = "" + v.toString(16);
    while (twoDigits.length < 2) {
        twoDigits = '0' + twoDigits;
    }
    return twoDigits;
}

function valueToGray(value) {
    var twoDigits = toTwoDigits(value);
    return '#' + twoDigits + twoDigits + twoDigits;
}

valueToGray.title = 'Gray';

function valueToLightGray(value) {
    return valueToGray(255 * Math.sqrt(value / 255));
}

valueToLightGray.title = 'Light Gray';

function valueToColourful(value) {
    var b = value * 1;
    var g = value * 5;
    var r = value * 20;
    return '#' + toTwoDigits(r) + toTwoDigits(g) + toTwoDigits(b);    
}

valueToColourful.title = 'Colourful';


// Except for the black and white, all other colours are from the coloured Sololearn logo.
var sololearnColours = {
    "0": "#000000",
    "32": '#6cb94f',
    "64": '#ef7542',
    "96": '#ea5460',
    "128": '#eb589f',
    "180": '#2fb7e9',
    "213": '#148d9e',
    "255": '#ffffff'
};

// Convert the colours to an Array of 3 integers(0-255) so this string manipulation doesn't 
// need to be done in valueToSololearnColours function which is called much more often.
function convertSololearnColoursToArrays() {
    for (var key in sololearnColours) {
        if (!isNaN(key)) {
            var hexDigits = sololearnColours[key].substring(1); 
            var vals = [];
            for (var i = 0; i < 3; i++) {
                vals.push(parseInt(hexDigits.substring(i * 2, i * 2 + 2), 16));
            }
            sololearnColours[key] = {
                'hex': sololearnColours[key],
                'array': vals
            };
        }
    }
}

convertSololearnColoursToArrays();

function valueToSololearnColours(value) {
    var min, max;
    
    // Try to find the upper and lower boundary colour for the specified value.
    for (var key in sololearnColours) {
        if (!isNaN(key)) {
            key = parseInt(key);
            if (key < value && (key > min || min === undefined)) {
                min = key;
            }
            if (key > value && (key < max || max === undefined)) {
                max = key;
            }
        }
    }
    if (max === undefined) {
        return sololearnColours['255'].hex;
    }
    if (min === undefined) {
        return sololearnColours['0'].hex;
    }
    
    // Now that we have both upper and lower boundaries, average the 2 colours.
    // The closer value is to min, the more the resulting colour should match 
    // the min colour and vice versa.
    var ratio = (value - min) / (max - min);
    var ratio2 = 1 - ratio;
    max = sololearnColours['' + max];
    min = sololearnColours['' + min];
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var val = ratio * max.array[i] + ratio2 * min.array[i];
        val = Math.floor(val); // eliminate any decimals or fractional parts.
        val = val.toString(16); // convert to hex.
        while (val.length < 2) { // Make sure there are exactly 2 hex digits.
            val = '0' + val;
        }
        colour += val; // Concatenate the 2 hex digits to the resulting string.
    }
    return colour;
}

valueToSololearnColours.title = 'Sololearn Colours';

function Renderer(zoom, selectedFractal) {
    var self = this;
    var maxSquareSize = 4;
    self.selectedFractal = selectedFractal;
    var renderingQueue = [];
    var lastResetQueueSize = 0;
    var renderProgressListeners = [];
    
    self.addListener = function(listener) {
        renderProgressListeners.push(listener);  
    };
    
    self.removeListener = function(listener) {
        var index;
        do {
            index = renderProgressListeners.indexOf(listener);
            if (index !== -1) {
                renderProgressListeners.splice(index, 1);
            }
        } while (index !== -1);
    };
    
    function processSection(squareSize, minX, minY, maxX, maxY) {
        if (self.valueToColour === undefined || self.selectedFractal === undefined) {
            return;
        }
        var $canvas = $('canvas');
        var g = $canvas[0].getContext('2d');

        var pixeledSquareSize = Math.max(1, squareSize);

        // Make sure the range starts with integers to avoid having pixels blurred into each other.
        minX = parseInt(minX);
        minY = parseInt(minY);
        for (var x = minX; x < maxX; x += pixeledSquareSize) {
            for (var y = minY; y < maxY; y += pixeledSquareSize) {
                var p;
                var value;
                if (squareSize < 1) {
                    var totalValue = 0;
                    for (var microX = 0; microX < 1; microX += squareSize) {
                        for (var microY = 0; microY < 1; microY += squareSize) {
                            p = zoom.pixelsToViewerCoordinates(x + microX, y + microY);
                            totalValue += self.selectedFractal.getValueAt(p.x, p.y);
                        }
                    }
                    value = totalValue * squareSize * squareSize;
                }
                else {
                    p = zoom.pixelsToViewerCoordinates(x, y);
                    value = self.selectedFractal.getValueAt(p.x, p.y);
                }
                
                var colour = self.valueToColour(value);
                g.fillStyle = colour;
                g.fillRect(x, y, pixeledSquareSize, pixeledSquareSize);
            }
        }
    }

    function trimBottomRight(renderingTask) {
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        var g = $canvas[0].getContext('2d');
        g.fillStyle = self.valueToColour(0);
        g.fillRect(renderingTask.minX, renderingTask.maxY, renderingTask.maxX - renderingTask.minX + 5, 5);
        g.fillRect(renderingTask.maxX, renderingTask.minY, 5, renderingTask.maxY - renderingTask.minY + 5);
    }
    
    function clearDisplay() {
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        var g = $canvas[0].getContext('2d');
        var backgroundColour = self.valueToColour(0);
        g.fillStyle = backgroundColour;
        g.fillRect(0,0,w,h);
    }
    
    function dispatchRenderingUpdate(renderingInfo) {
        renderProgressListeners.forEach(function(listener) {
            listener(renderingInfo);
        });
    }
    
    function processRenderingChunk() {
        if (renderingQueue.length > 0) {
            var renderingTask = renderingQueue[0];
            renderingQueue.shift();
            if (renderingTask.squareSize === undefined) {
                trimBottomRight(renderingTask);
            }
            else {
                if (renderingTask.squareSize === maxSquareSize) {
                    clearDisplay();
                }
                processSection(renderingTask.squareSize, renderingTask.minX, renderingTask.minY, renderingTask.maxX, renderingTask.maxY);
            }
            dispatchRenderingUpdate({
                'percentRemaining': renderingQueue.length * 100 / lastResetQueueSize
            });
        }
        setTimeout(processRenderingChunk, 0);
        // Call again as soon as possible but give browser an opportunity 
        // to respond to user input.
        // This is to maximize rendering speeds while keeping the page fairly responsive.
    }

    self.resetDisplay = function(isForDownloading) {
        if (isForDownloading === undefined) {
            isForDownloading = false;
        }
        // Resets the processing queue so a new region is drawn completely fresh.
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        if (typeof self.selectedFractal.draw === 'function') {
            renderingQueue = []; // Don't do the other type of drawing.
            lastResetQueueSize = 0;
            self.selectedFractal.draw($canvas[0].getContext('2d'), self.valueToColour, zoom);
            dispatchRenderingUpdate({
                'percentRemaining': 0
            });
            return;
        }
        if (typeof self.selectedFractal.adaptToZoom === 'function') {
            self.selectedFractal.adaptToZoom(zoom.getAverageSize());
        }
        squareSize = maxSquareSize;
        renderingQueue = [];
        var squareSizes = [];
        if (isForDownloading === false) {
            for (var squareSize = maxSquareSize; squareSize >= 1; squareSize --) {
                squareSizes.push(squareSize);
            }
            squareSizes.push(0.5);
        }
        else {
            clearDisplay();
        }
        squareSizes.push(0.25);
        var minP, maxP;
        if (typeof self.selectedFractal.getRangeInfo === 'function') {
            var rangeInfo = self.selectedFractal.getRangeInfo();
            minP = zoom.viewerCoordinatesToPixels(rangeInfo.minX, rangeInfo.minY);
            maxP = zoom.viewerCoordinatesToPixels(rangeInfo.maxX, rangeInfo.maxY);
        }
        squareSizes.forEach(function(squareSize) {
            var numSlices;
            if (squareSize >= 1) {
                numSlices = 1 << (maxSquareSize - squareSize); 
            }
            else {
                numSlices = (1 << (maxSquareSize - 1)) / squareSize;
            }
            if (isForDownloading === true) {
                numSlices *= 2; // The downloaded resolutions are likely to be much higher so the slices need to be smaller.
            }
            for (var x = 0; x < numSlices; x++) {
                for (var y = 0; y < numSlices; y++) {
                    var minX = x * w / numSlices;
                    var maxX = (x + 1) * w / numSlices;
                    var minY = y * h / numSlices;
                    var maxY =  (y + 1) * h / numSlices;
                    if (minP) {
                        minX = Math.max(minP.x, minX);
                        minY = Math.max(minP.y, minY);
                        maxX = Math.min(maxP.x, maxX);
                        maxY = Math.min(maxP.y, maxY);
                    }
                    if (minX < maxX && minY < maxY) {
                        renderingQueue.push({
                            'squareSize': squareSize,
                            'minX': minX,
                            'minY': minY,
                            'maxX': maxX,
                            'maxY': maxY
                        });
                    }
                }
            }
            if (minP) {
                renderingQueue.push({
                    'minX': minP.x,
                    'minY': minP.y,
                    'maxX': maxP.x,
                    'maxY': maxP.y
                });
            }
            lastResetQueueSize = renderingQueue.length;
        });
    };

    // process the queue of rendering tasks continuously so the page doesn't lock up so much.
    processRenderingChunk();
}


$(function() {
    SololearnskiCarpet.init();
    var fractals = [new  SololearnskiCarpet(), new SierpinskiCarpet(), 
        new SierpinskiTriangle(), new Kosh(), new MandelbrotSet(), new JuliaSet(), new BurningShip(), new HexFractal()];
    var colourPalettes = [valueToLightGray, valueToColourful, valueToGray, valueToSololearnColours];
    var zoom = new Zoom();
    var renderer = new Renderer(zoom, fractals[0]);
    var downPosition;

    function addOptionsToSelect(selectId, namedOptions, propertyName) {
        namedOptions.forEach(function(option) {
            $('#' + selectId).append($('<option></option>').text(option[propertyName]));
        });
    }
    
    addOptionsToSelect('fractalType', fractals, 'name');
    addOptionsToSelect('colourPalette', colourPalettes, 'title');
    
    function fractalTypeChanged() {
        var name = $('#fractalType option:selected').text();
        var fractalMatchingName = fractals.filter(function(fractal) {
            return fractal.name === name;
        })[0];
        zoom.reset();
        renderer.selectedFractal = fractalMatchingName;
        $('body').removeClass(); // remove all classes.
        if (fractalMatchingName.css_class) {
            $('body').addClass(fractalMatchingName.css_class);
        }
        renderer.resetDisplay();
    }
    
    function canvasClicked(event) {
        zoom.zoomInto(event.clientX, event.clientY);
        renderer.resetDisplay();
    }
    
    function canvasDown(event) {
        // Store the down position in case the user wants to drag the view around.
        downPosition = {
            'x': event.clientX,
            'y': event.clientY
        };
    }
    
    function canvasUp(event) {
        if (downPosition) {
            var newPosition = {
                'x': event.clientX,
                'y': event.clientY
            };
            // if we moved more than 5 pixels, assume a drag happened.
            // Under 5 pixels is likely a click to zoom in.
            var dx = newPosition.x - downPosition.x, dy = newPosition.y - downPosition.y;
            if ( Math.abs(dx) + Math.abs(dy) > 5) {
                zoom.translatePixelsBy(dx, dy);
                renderer.resetDisplay();
                return false; // Try to prevent propogation of this event.
            }
            else {
                canvasClicked(event);
            }
            downPosition = undefined;
        }
    }
    
    function resetZoomClicked() {
        zoom.reset();
        renderer.resetDisplay();
    }

    function zoomOutClicked() {
        zoom.zoomOut();
        renderer.resetDisplay();
    }
    
    function windowResized() {
        zoom.resized();
        var zoomInBoxInfo = zoom.getZoomInCoordinates(0,0);
        $('.zoom-in-box').css({
            'width': zoomInBoxInfo.width + 'px',
            'height': zoomInBoxInfo.height + 'px'
        });
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        
        // Make sure canvas resolution is 1 to 1 with the pixels it uses on the screen.
        $canvas.attr('width', w);
        $canvas.attr('height', h);
        renderer.resetDisplay();
    };
    
    function mouseMoved(event) {
        var zoomInBoxInfo = zoom.getZoomInCoordinates(event.clientX, event.clientY);
        $('.zoom-in-box').css({
            'left': zoomInBoxInfo.offsetX + 'px',
            'top': zoomInBoxInfo.offsetY + 'px'
        });
    }

    function colourPaletteChanged() {
        var name = $('#colourPalette option:selected').text();
        var colour = colourPalettes.filter(function(palette) {
            return palette.title === name;
        })[0];
        renderer.valueToColour = colour;
        renderer.resetDisplay();
    }
    
    function showDialog() {
        var $inputs = $('.dialog .inputs');
        $inputs.empty();
        if (typeof renderer.selectedFractal.getInputs === 'function') {
            renderer.selectedFractal.getInputs().forEach(function(input) {
                var $newLabel = $('<label></label>').text(input.name);
                var $newInput = $('<input>').attr('type', 'range');
                var copiableAttributes = ['min', 'max', 'step', 'value'];
                copiableAttributes.forEach(function(attrName) {
                    if (input[attrName] !== undefined) {
                        $newInput.attr(attrName, input[attrName]);
                    }
                });
                var $row = $('<div></div>');
                $newInput.on('input', function() {
                    if (!isNaN($newInput.val())) {
                        if (input.requiresZoomReset !== false) {
                            zoom.reset();
                        }
                        renderer.selectedFractal[input.name] = parseFloat($newInput.val());
                        renderer.resetDisplay();
                    }
                });
                $row.append($newLabel);
                $row.append($newInput);
                $inputs.append($row);
            });
            $('.dialog').removeClass('no-inputs');
        }
        else {
            $('.dialog').addClass('no-inputs');
        }
        $('.dialog').addClass('open');
    }
    
    function hideDialog() {
        var $dialog = $('.dialog');
        $dialog.removeClass('open open-to-download-picture');        
    }

    function okDialog() {
        var $dialog = $('.dialog');
        
        function setPictureDownloadProgressPercentage(percent) {
            $('.percentage-complete').width($('.progress-bar').width() * percent / 100);
        }
        
        function downloadPictureProgressUpdated(progressUpdate) {
            if (progressUpdate.percentRemaining === 0) {
                renderer.removeListener(downloadPictureProgressUpdated);
                downloadCanvas(); 
                $dialog.removeClass('open open-to-download-picture');
                // Remove the inline styles from the canvas element.
                $('canvas, .zoom-in-box').css({"width": "", "height": ""}).removeAttr('width').removeAttr('height');
                windowResized();
                renderer.resetDisplay(); // in case the dimensions were temporarily updated.
            }
            else {
                setPictureDownloadProgressPercentage(100 - progressUpdate.percentRemaining);
            }
        }
        
        if ($dialog.hasClass('open-to-download-picture')) {
            renderer.addListener(downloadPictureProgressUpdated);
            zoom.setDimensionsForDownload($('#pixelWidth').val(), $('#pixelHeight').val());
            renderer.resetDisplay(true);
            return; // Don't hide the dialog until the image is actually ready for download.
        }
        $dialog.removeClass('open open-to-download-picture');
    }
    
    function downloadCanvas() {
        function downloadCanvas(filename) {
    		var $canvas = $('canvas');
			$canvas[0].toBlob(function(blob) {
				saveAs(blob, filename);
			}, 'image/png');
		}

        downloadCanvas(renderer.selectedFractal.name + " fractal.png");
    }
    
    function downloadPicture() {
		var $canvas = $('canvas');
        setPictureDownloadResolution($canvas.width(), $canvas.height())();
        $('.dialog').addClass('open open-to-download-picture');
    }
    
    function setPictureDownloadResolution(width, height) {
        return function() {
            $('#pixelWidth').val(width);
            $('#pixelHeight').val(height);
        };
    }

    if (!$('canvas')[0].toBlob) {
        /*
        If the visitor is using a browser that doesn't support an important feature for the download feature to work,
        Just remove the button.
        
        The download picture feature isn't really needed to get most of the value from the page.
        Hiding it is better than leaving something broken visible to the user.
        */
        $('#downloadPicture').remove();
    }

    $('#2k').on('click', setPictureDownloadResolution(1920, 1080));
    $('#4k').on('click', setPictureDownloadResolution(3840, 2160));
    $('#8k').on('click', setPictureDownloadResolution(7680, 4320));
    $('#downloadPicture').on('click', downloadPicture);
    $('#showDialog').on('click', showDialog);
    $('.dialog button.ok').on('click', okDialog);
    $('.dialog button.cancel').on('click', hideDialog);
    $('#colourPalette').on('change', colourPaletteChanged);
    $('#fractalType').on('change', fractalTypeChanged);
    $('#zoomOut').on('click', zoomOutClicked);
    $('#resetZoom').on('click', resetZoomClicked);
    $('.display').on('mousedown', canvasDown).on('mouseup', canvasUp).on('mousemove', mouseMoved);
    $(window).on('resize', windowResized);
    fractalTypeChanged();
    windowResized();
    colourPaletteChanged();
});
