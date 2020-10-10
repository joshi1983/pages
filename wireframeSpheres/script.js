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
    var zoom; // a number used to scale the x-y-coordinates used in the canvas 
    var viewpoint = {"x": 0, "y": 0, "z": 0}; // Represents where the camera position or view point
    var canvasCentre = {};
    var lastMousePosition;
    
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
        g.clearRect(0, 0, $canvas.width(), $canvas.height()); // Clean up old drawing so the canvas doesn't get messy.
        g.strokeStyle = 'rgba(0,0,0, 0.3)'; // Use a semi-transparent stroke so the drawing looks smoother.
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

    function addSphereToModel(sphereProperties) {
        var polygonComplexity = 20;
        var horizontalLineSegments = [];

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
        model = model.concat(horizontalLineSegments);
    }
    
    function canvasResized() {
        var $canvas = $('canvas');
        
        // Make the canvas resolution match its dimensions so 1 pixel on display = 1 pixel internally.
        $canvas.attr('width', $canvas.width());
        $canvas.attr('height', $canvas.height());

        canvasCentre = {"x": $canvas.width() / 2, "y": $canvas.height() / 2};
        zoom = ($canvas.width() + $canvas.height()) * 0.2;
    }
    
    function initializeModel() {
        // Add a few randomly positioned and sized spheres.
        for (var i = 0; i < 5; i++) {
            addSphereToModel({
                "cx": Math.random() * 400 - 200,
                "cy": Math.random() * 400 - 200,
                "cz": 250 + Math.random() * 300,
                "radius": 50 + Math.random() * 40
            });
        }
    }
    
    // The intro animation helps to capture the visitor's attention in the first few seconds they're on the page.
    // The animation stops after the specified time so it won't fight with the user over control of the viewpoint.
    function startIntroAnimation(secondsRemaining) {
        // Update z by an amount proportional to time remaining so we start fast and slow to a stop linearly.
        viewpoint.z += secondsRemaining * 0.2;
        if (secondsRemaining > 0) {
            setTimeout(function() {
                // Assume 20ms has gone by and call again.
                startIntroAnimation(secondsRemaining - 0.02);
            }, 20);
        }
    }
    
    initializeModel(); // Add some random spheres so user has a 3D model to look at.
    
    $(window).resize(canvasResized); // Adjust the zoom, canvas centre.. when the canvas changes size.
    canvasResized(); // initialize zoom and canvas centre

    // Let mouse adjust viewpoint.
    $(window).mousemove(function(event) {
        if (event.which !== 0) {
            var newPosition = {"x": event.pageX, "y": event.pageY};
            if (lastMousePosition) {
                if (event.shiftKey) {
                    viewpoint.z -= (newPosition.x - lastMousePosition.x);
                }
                else {
                    viewpoint.x -= (newPosition.x - lastMousePosition.x);
                    viewpoint.y -= (newPosition.y - lastMousePosition.y);
                }
            }
            lastMousePosition = newPosition;
        }
        else {
            lastMousePosition = undefined;
        }
    });

    window.setInterval(updateDisplay, 20);
    startIntroAnimation(5); // run intro animation for 5 seconds to grab attention.
});