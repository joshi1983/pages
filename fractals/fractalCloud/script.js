/*
This code applies some basic knowledge of trigonometry to visualize some 3D line data.

If this appeals to you, please up vote so more SoloLearners can find it and learn.

Copy this code and play with it to learn more.  If you want some ideas to play with, here are some ideas:
- Modify initializeModel to create other 3D models.  Add some functionality to add cubes, pyramids, cones...  If you want something really fancy, create a 3D model of a tree.
- Modify updateDisplay to draw using different colours, different stroke widths..
- Add UI controls for zoom.  Another keyboard combination + mouse drag maybe?
- Add UI controls for viewing direction.  Yet another keyboard combination + mouse drag maybe?

Author: Josh Greig

You can chat with me on facebook at 
https://www.facebook.com/josh.greig.5 or email me at josh.greig@gmail.com if you have questions about this.  
I'm more than happy to help.  I also like hearing suggestions for improvement.
*/
function okClicked() {
    $(".instructions").fadeOut(function() {
        $('body').removeClass('showing-instructions');
    });
}

$(function() {
    var model = []; // an Array of 3D line segment data to be shown
    var spheres = [];
    var zoom; // a number used to scale the x-y-coordinates used in the canvas 
    var viewpoint = {"x": 0, "y": 0, "z": -300}; // Represents where the camera position or view point
    var canvasCentre = {};
    var lastMousePosition;
    var WIRE_MODE = 1;
    var FILL_MODE = 2;
    var drawMode = FILL_MODE;
    var displayUpdateNeeded = true;
    var MEDIUM_QUALITY = 1;
    var HIGH_QUALITY = 2;
    var TOP_QUALITY = 3;
    var quality = MEDIUM_QUALITY;
    var lastUpdateTime;
    var isMouseDown = false;

    function translateByViewpoint(p3D) {
        return {
            "x": p3D.x - viewpoint.x,
            "y": p3D.y - viewpoint.y,
            "z": p3D.z - viewpoint.z
        };
    }

   function perspectiveXYZToXY(p) {
       p = translateByViewpoint(p);

       if (p.z < 0.001) {
           return undefined; 
           // Prevent division by 0 and prevent the caller from drawing any lines behind the camera.
       }
      var x = p.x / p.z;
      var y = p.y / p.z;
      return {
          "x": x * zoom + canvasCentre.x,
          "y": y * zoom + canvasCentre.y
      };
   }

    // Given 2 3D points, find the 2D coordinates that is roughly appropriate for the 
    // p3D_invalid such that a 2D line-segment drawn between the 2D point for p3D_from to the resulting point will approximate the direction it would have drawn if the line ended in 3D space at z = viewpoint.z
   function getValidEndPoint(p3D_from, p3D_invalid) {
       p3D_from = translateByViewpoint(p3D_from);
       p3D_invalid = translateByViewpoint(p3D_invalid);
       
       // Find the 3D point near where it would hit the z-axis.
       var directionVector = {
           "x": p3D_invalid.x - p3D_from.x,
           "y": p3D_invalid.y - p3D_from.y,
           "z": p3D_invalid.z - p3D_from.z
       };
       // 0.1 because if it we calculated the exact intersection with z = viewpoint, the line segment won't get drawn.
       var multiplier = Math.abs((p3D_from.z - 0.1) / directionVector.z);
       var resultingPoint3D = {
           "x": p3D_from.x + directionVector.x * multiplier + viewpoint.x,
           "y": p3D_from.y + directionVector.y * multiplier + viewpoint.y,
           "z": p3D_from.z + directionVector.z * multiplier + viewpoint.z
       };

       return perspectiveXYZToXY(resultingPoint3D);
   }

    function updateDisplay() {
        var $canvas = $('canvas');
        var g = $canvas[0].getContext('2d');
        var w = $canvas.width(), h = $canvas.height();
        g.clearRect(0, 0, w, h); // Clean up old drawing so the canvas doesn't get messy.
        g.globalCompositeOperation = 'none';
        if (drawMode === WIRE_MODE) {
            g.globalCompositeOperation = "source-over";
            g.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            g.beginPath();
            model.forEach(function(lineSegment) {
                var from = perspectiveXYZToXY(lineSegment.from);
                var to = perspectiveXYZToXY(lineSegment.to);
                
                // If only 1 of the 2 end points is not possible to calculate, fill it in with a point that can be calculated.
                if (from && !to) {
                    to = getValidEndPoint(lineSegment.from, lineSegment.to);
                }
                else if (to && !from) {
                    from = getValidEndPoint(lineSegment.to, lineSegment.from);
                }
                
                // If the line segment can be drawn, draw it.
                if (from && to) {
                    g.moveTo(from.x, from.y);
                    g.lineTo(to.x, to.y);
                }
            });
            g.closePath();
            g.stroke();
        }
        else {
            /*Make it so all drawing operations use the brightest of foreground and background colours. */
            g.globalCompositeOperation = 'lighten';
            var prevColour = undefined;
            var sizeThreshold = 1.5;
            var lengthRatio = 1;
            if (viewpoint.z < -220) {
                sizeThreshold = Math.max(0.1, -220.0 / viewpoint.z);
            }
            if (quality === HIGH_QUALITY) {
                sizeThreshold = Math.min(0.3, sizeThreshold);
            }
            else if (quality === TOP_QUALITY) {
                sizeThreshold = 0;
            }
            sizeThreshold *= (w + h) * 0.0008;
            for (var i = 0; i < spheres.length; i++) {
                var sphere = spheres[i];
                var c = perspectiveXYZToXY(sphere);
                if (c !== undefined) {
                    var otherP = perspectiveXYZToXY({'x': sphere.x, 'y': sphere.y - sphere.radius, 'z': sphere.z});
                    var rotation = 0;
                    var radius = Math.abs(c.y - otherP.y);
                    if (radius > sizeThreshold && c.x + radius > 0 && c.y + radius > 0) {
                        if (prevColour !== sphere.colour) {
                            if (prevColour !== undefined) {
                                g.closePath();
                                g.fill();
                            }
                            prevColour = g.fillStyle = sphere.colour;
                            g.beginPath();
                        }
                        else {
                            g.moveTo(c.x, c.y);
                        }
                        if (quality === TOP_QUALITY || (quality === HIGH_QUALITY && radius > 4) || (quality === MEDIUM_QUALITY && radius > 20)) {
                            var dx = c.x - w * 0.5, dy = c.y - h * 0.5;
                            rotation = Math.atan2(dy, dx) + Math.PI * 0.5;
                                
                            lengthRatio = 1 + 2 * (Math.abs(dx) + Math.abs(dy)) / (w + h);
                            lengthRatio = Math.min(2, lengthRatio);
                        }
                        else {
                            rotation = 0;
                            lengthRatio = 1;
                        }
                        g.ellipse(c.x, c.y, radius, radius * lengthRatio, rotation, 0, Math.PI * 2);
                    }
                }
            }
            g.closePath();
            g.fill();
        }
        lastUpdateTime = new Date();
    }

    // Returns an object that works better with perspectiveXYZToXY by having x,y,z properties instead of cx,cy,cz.    
    function getOptimizedSphere(s) {
        var result = $.extend({}, s);
        result.x = result.cx;
        result.y = result.cy;
        result.z = result.cz;
        delete result.cx;
        delete result.cy;
        delete result.cz;
        return result;
    }

    function addSphereToModel(sphereProperties) {
        spheres.push(getOptimizedSphere(sphereProperties));
        var polygonComplexity = 20;
        var horizontalLineSegments = [];

        // Let smaller spheres use fewer lines
        polygonComplexity = Math.min(12, sphereProperties.radius);
        
        if (polygonComplexity < 1) {
            return;
        }

        // Add the horizontal lines segments.
        for (var i = 0; i <= polygonComplexity; i++) {
            var latitude = (i - polygonComplexity / 2) * Math.PI / polygonComplexity;
            var smallRadius = sphereProperties.radius * Math.cos(latitude);
            var y = sphereProperties.radius * Math.sin(latitude);
            var to = undefined;
            for (var j = 0; j <= polygonComplexity; j++) {
                var longitude = j * Math.PI * 2 / polygonComplexity;
                var from = {
                    "x": sphereProperties.cx + smallRadius * Math.sin(longitude),
                    "y": sphereProperties.cy + y,
                    "z": sphereProperties.cz + smallRadius * Math.cos(longitude)};
                if (to) {
                    horizontalLineSegments.push({"from": from, "to": to});
                }
                to = from;
            }
        }
        
        // reuse the points pushed into the model to draw the vertical line segments.
        for (i = 1; i <= polygonComplexity; i++) {
            for (j = 0; j < polygonComplexity; j++) {
                from = horizontalLineSegments[i * polygonComplexity + j].from;
                to = horizontalLineSegments[(i - 1) * polygonComplexity + j].from;
                model.push({"from": from, "to": to});
            }
        }
        // Not using concat because concat is far less efficient for what we're doing.
        model.push(...horizontalLineSegments);
    }
    
    function canvasResized() {
        var $canvas = $('canvas');

        // Make the canvas resolution match its dimensions so 1 pixel on display = 1 pixel internally.
        $canvas.attr('width', $canvas.width());
        $canvas.attr('height', $canvas.height());

        canvasCentre = {"x": $canvas.width() / 2, "y": $canvas.height() / 2};
        zoom = ($canvas.width() + $canvas.height()) * 0.2;
    }
    
    function addSuperTinySpheres(cx, cy, cz) {
        addSphereToModel({
            'cx': cx,
            'cy': cy,
            'cz': cz,
            'radius': 0.6,
            "colour": "#008"
        });
    }
    
    function addTinySpheres(cx, cy, cz) {
        addSphereToModel({
            'cx': cx,
            'cy': cy,
            'cz': cz,
            'radius': 1,
            "colour": "#4b0"
        });
        
        var smallRadius = 3;
        for (var i = 0; i < 4; i++) {
            var angle = i * Math.PI / 2;
            var x = cx + smallRadius * Math.cos(angle);
            var z = cz + smallRadius * Math.sin(angle);
            addSuperTinySpheres(x, cy + smallRadius, z);
            addSuperTinySpheres(x, cy - smallRadius, z);
        }
    }

    function addSmallSpheres(cx, cy, cz) {
        addSphereToModel({
            'cx': cx,
            'cy': cy,
            'cz': cz,
            'radius': 3,
            "colour": "#f5f"
        });
        var smallRadius = 10;
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4;
            var x = cx + smallRadius * Math.cos(angle);
            var z = cz + smallRadius * Math.sin(angle);
            addTinySpheres(x, cy + smallRadius, z);
            addTinySpheres(x, cy - smallRadius, z);
        }
    }
    
    function addGlowingSpheres(cx, cy, cz) {
        addSphereToModel({
            'cx': cx,
            'cy': cy,
            'cz': cz,
            'radius': 6,
            "colour": "#fdf"
        });
        var smallRadius = 30;
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4;
            var x = cx + smallRadius * Math.cos(angle);
            var z = cz + smallRadius * Math.sin(angle);
            addSmallSpheres(x, cy + smallRadius, z);
            addSmallSpheres(x, cy - smallRadius, z);
        }
    }
    
    // This speeds up the fill rendering a lot by reducing the number of paths.
    // This can reduce the number of paths from 1000's(1 per ellipse) to just 3 or 4(the number of sizes).
    function groupSpheresByColour() {
        var colourMap = {};
        spheres.forEach(function(sphere) {
            if (colourMap[sphere.colour] === undefined) {
                colourMap[sphere.colour] = [];
            }
            colourMap[sphere.colour].push(sphere);
        });
        var result = [];
        for (var colour in colourMap) {
            if (typeof colour === 'string' && colour.charAt(0) === '#') {
                result.push(...colourMap[colour]);
            }
        }
        
        spheres = result;
    }

    function initializeModel() {
        addSphereToModel({
            "cx": 0,
            "cy": 0,
            "cz": 0,
            "radius": 20,
            "colour": "#ffe"
        });

        var radius = 100;        
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4;
            var x = radius * Math.cos(angle);
            var z = radius * Math.sin(angle);
            addGlowingSpheres(x, 100, z);
            addGlowingSpheres(x, -100, z);
        }
        groupSpheresByColour();
    }
    
    function drawModeUpdated() {
        $('body').removeClass('wire filled');
        if (drawMode === FILL_MODE) {
            $('body').addClass('filled');
        }
        else {
            $('body').addClass('wire');
        }
        displayUpdateNeeded = true;
    }
    
    function filledClicked() {
        drawMode = FILL_MODE;
        drawModeUpdated();
    }
    
    function wireClicked() {
        drawMode = WIRE_MODE;
        drawModeUpdated();
    }
    
    function onMouseWheel(event) {
        viewpoint.z += event.originalEvent.wheelDelta;
        displayUpdateNeeded = true;
    }
    
    function onTouchMove(event) {
        var touch = event.touches[0];
        var newPosition = {'x': touch.pageX, 'y': touch.pageY};
        if (lastMousePosition && newPosition.x && newPosition.y) {
            viewpoint.x += lastMousePosition.x - newPosition.x;
            viewpoint.y += lastMousePosition.y - newPosition.y;
        }
        lastMousePosition = newPosition;
        displayUpdateNeeded = true;
    }
    
    function onTouchUp() {
        lastMousePosition = undefined;
    }
    
    function helpClicked() {
        $('body').addClass('showing-instructions');
        $('.instructions').fadeIn();
    }
 
    // The intro animation helps to capture the visitor's attention in the first few seconds they're on the page.
    // The animation stops after the specified time so it won't fight with the user over control of the viewpoint.
    function startIntroAnimation(secondsRemaining) {
        // Update z by an amount proportional to time remaining so we start fast and slow to a stop linearly.
        viewpoint.z += secondsRemaining * 0.2;
        displayUpdateNeeded = true;
        if (secondsRemaining > 0) {
            setTimeout(function() {
                // Assume 20ms has gone by and call again.
                startIntroAnimation(secondsRemaining - 0.02);
            }, 20);
        }
    }
    
    function startRenderLoop() {
        if (displayUpdateNeeded) {
            quality = MEDIUM_QUALITY;
            updateDisplay();
            displayUpdateNeeded = false;
        }
        else if (lastUpdateTime) {
            var diff = (new Date()).getTime() - lastUpdateTime.getTime();
            if (quality === MEDIUM_QUALITY && diff > 300) { 
                quality = HIGH_QUALITY;
                updateDisplay();
            }
            else if (quality === HIGH_QUALITY && diff > 5500) {
                //quality = TOP_QUALITY;
                //updateDisplay();
            }
        }
        
        requestAnimationFrame(startRenderLoop);
    }
    
    initializeModel(); // Add some random spheres so user has a 3D model to look at.
    
    $(window).resize(canvasResized); // Adjust the zoom, canvas centre.. when the canvas changes size.
    canvasResized(); // initialize zoom and canvas centre

    // Let mouse adjust viewpoint.
    $(window).on('mousemove', function(event) {
        if (event.which !== 0 && isMouseDown) {
            var newPosition = {"x": event.pageX, "y": event.pageY};
            if (lastMousePosition) {
                if (event.shiftKey) {
                    viewpoint.z -= (newPosition.x - lastMousePosition.x);
                }
                else {
                    viewpoint.x -= (newPosition.x - lastMousePosition.x);
                    viewpoint.y -= (newPosition.y - lastMousePosition.y);
                }
                displayUpdateNeeded = true;
            }
            lastMousePosition = newPosition;
        }
        else {
            lastMousePosition = undefined;
        }
    });
    
    function onMouseDown() {
        isMouseDown = true;
    }
    
    function onMouseUp() {
        isMouseDown = false;
    }

    $('#ok-button').click(okClicked);
    $('.wire').click(wireClicked);
    $('.filled').click(filledClicked);
    $('.help').click(helpClicked);
    $(window).on('mousedown', onMouseDown);
    $(window).on('mouseup', onMouseUp);
    $(window).on('mousewheel DOMMouseScroll', onMouseWheel);
    $(window).on('touchmove', onTouchMove);
    $(window).on('touchend touchcancel', onTouchUp);
    drawModeUpdated();
    startRenderLoop();
    startIntroAnimation(5); // run intro animation for 5 seconds to grab attention.
});