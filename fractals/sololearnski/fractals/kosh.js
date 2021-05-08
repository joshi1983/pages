
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