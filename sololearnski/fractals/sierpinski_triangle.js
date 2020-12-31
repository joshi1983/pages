
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