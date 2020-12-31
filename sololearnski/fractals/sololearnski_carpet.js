
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
