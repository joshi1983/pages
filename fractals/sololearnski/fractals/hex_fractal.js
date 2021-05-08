
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