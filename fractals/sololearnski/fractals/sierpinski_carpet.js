
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