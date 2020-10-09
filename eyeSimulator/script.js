
function sanitizeHex(val) {
    var result = '' + val.toString(16);
    if (result.length === 1) {
        result = '0' + result;
    }
    return result;
}

function getRGB(colour) {
    var R = parseInt(colour.substring(1,3),16);
    var G = parseInt(colour.substring(3,5),16);
    var B = parseInt(colour.substring(5,7),16);
    return {
        'r': R,
        'g': G,
        'b': B
    };    
}

// Tints or shades the specified colour by the specified percentage.
// If the percentage is negative, the colour will be darkened.
//
// colour must be a 6-digit hex code starting with a pound sign such as '#ffffff'.
// Adapted from an answer at: 
// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColour(colour, percent) {
    // Get the red, green, and blue components out of the colour.
    var c = getRGB(colour);
    var R = c.r;
    var G = c.g;
    var B = c.b;

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = Math.min(255, R);
    G = Math.min(255, G);
    B = Math.min(255, B);

    var RR = sanitizeHex(R);
    var GG = sanitizeHex(G);
    var BB = sanitizeHex(B);

    return "#"+RR+GG+BB;
}

function getTransparentColour(c) {
    var rgb = getRGB(c);
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)';
}

function init() {
    var w, h;
    var pupilColour = '#000';
    var irisBackgroundColour;
    var eyeColour1;
    var eyeColour2;
    var eyeColour3;
    var skinColour;
    var eyebrowHairCount;
    var hairColour;
    var irisRadiusCoefficient = 1;
    var eyelidOpennessCoefficient = 0.01;
    var eyelidOpenness = 1;
    var blinkingState = 0;
    var isLeftEye = false;
    var veinOpacity = 0.5;
    var pupilDilationRatio = 0.5;
    var introAnimationIsOver = false;
    var tearVolumeOnLowerEyelid = 0;
    var tearDrops = [];
    var ethnicities = [
        {
            'name': 'North European', 
            'eyeColour1': '#08f',
            'eyeColour2': '#8ef',
            'eyeColour3': '#bbf8ff',
            'irisBackgroundColour': '#006',
            'eyelidOpennessCoefficient': 1,
            'hairColour': '#883300',
            'skinColour': '#c3a3a0',
            'eyebrowHairCount': 120
        },
        {
            'name': 'West African', 
            'eyeColour1': '#830',
            'eyeColour2': '#640',
            'eyeColour3': '#aa0',
            'irisBackgroundColour': '#200',
            'eyelidOpennessCoefficient': 1,
            'hairColour': '#221100',
            'skinColour': '#936360',
            'eyebrowHairCount': 150
        },
        {
            'name': 'North East Asian', 
            'eyeColour1': '#730',
            'eyeColour2': '#640',
            'eyeColour3': '#980',
            'irisBackgroundColour': '#200',
            'eyelidOpennessCoefficient': 0.9,
            'hairColour': '#110000',
            'skinColour': '#c3a8a0',
            'eyebrowHairCount': 110
        }
        ];
    var eyeColours = [
        {
            'name': 'Blue', 
            'eyeColour1': '#08f',
            'eyeColour2': '#8ef',
            'eyeColour3': '#bbf8ff',
            'irisBackgroundColour': '#006',
        },
        {
            'name': 'Green', 
            'eyeColour1': '#080',
            'eyeColour2': '#de8',
            'eyeColour3': '#bbf8dd',
            'irisBackgroundColour': '#056',
        },
        {
            'name': 'Brown', 
            'eyeColour1': '#830',
            'eyeColour2': '#640',
            'eyeColour3': '#aa0',
            'irisBackgroundColour': '#200'
        },
        {
            'name': 'Dark Brown', 
            'eyeColour1': '#620',
            'eyeColour2': '#520',
            'eyeColour3': '#880',
            'irisBackgroundColour': '#000'
        }        
    ];
    
    function addEyeColoursToSettings() {
        eyeColours.forEach(function(eyeColour) {
            var $button = $('<button><button').text(eyeColour.name).on('click', function() {
                setEnvironmentVariables(eyeColour);
            });
            $('.eye-colours').append($button);
        });
    }
        
    function addEthnicitiesToSettings() {
        ethnicities.forEach(function(ethnicity) {
            var $button = $('<button><button').text(ethnicity.name).on('click', function() {
                setEnvironmentVariables(ethnicity);
            });
            $('.ethnicities').append($button);
        }); 
    }
    
    function setEnvironmentVariables(data, isExcludingEyelidOpennessCoefficient) {
        eyeColour1 = data.eyeColour1;
        eyeColour2 = data.eyeColour2;
        eyeColour3 = data.eyeColour3;
        irisBackgroundColour = data.irisBackgroundColour;
        if (data.hairColour !== undefined)
            hairColour = data.hairColour;
        if (data.skinColour !== undefined)
            skinColour = data.skinColour;
        if (data.eyebrowHairCount !== undefined)
            eyebrowHairCount = data.eyebrowHairCount;
        if (!isExcludingEyelidOpennessCoefficient && data.eyelidOpennessCoefficient !== undefined)
            eyelidOpennessCoefficient = data.eyelidOpennessCoefficient;
    }

    function drawTeardrop(g, drop) {
        var gradientCy = drop.cy + drop.radius * 0.8;
        var grad= g.createRadialGradient(drop.cx, gradientCy, 0, drop.cx, gradientCy, drop.radius * 1.5);
        grad.addColorStop(0, 'rgba(250, 252, 255, 0.05)');
        grad.addColorStop(0.7, 'rgba(250, 252, 255, 0.1)');
        grad.addColorStop(1, 'rgba(250, 252, 255, 0.4)');

        g.fillStyle = grad;        
        g.beginPath();
        
        g.arc(drop.cx, drop.cy, drop.radius, 0, 2 * Math.PI);

        g.closePath();
        g.fill();
    }
    
    function drawTeardrops(g) {
        tearDrops.forEach(function(drop) {
            drawTeardrop(g, drop);
        });
    }

    function drawRadiatingLines(g, cx, cy, minRadius, maxRadius, numLines) {
        var separation = Math.PI * 2 / Math.round(numLines);
        for (var i = Math.PI * 2; i >= 0; i -= separation) {
            var x = cx + minRadius * Math.cos(i);
            var y = cy + minRadius * Math.sin(i);
            var x2 = cx + maxRadius * Math.cos(i);
            var y2 = cy + maxRadius * Math.sin(i);
        
            g.moveTo(x, y);
            g.lineTo(x2, y2);
        }
        
    }
    
    function drawRadiatingLinesUsingRadialColour(g, cx, cy, minRadius, maxRadius, numLines, c1, c2) {
        var grad= g.createRadialGradient(cx, cy, minRadius, cx, cy, maxRadius);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        
        g.strokeStyle = grad;

        g.beginPath();
        drawRadiatingLines(g, cx, cy, minRadius, maxRadius, numLines);
        g.closePath();
        g.stroke();
    }
    
    function drawGlare(g, cx, cy, irisRadius) {
        var gradient = g.createRadialGradient(cx, cy, 0, cx, cy, irisRadius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, '#fff');

        g.fillStyle = gradient;
        g.beginPath();
        
        g.moveTo(cx - irisRadius * 0.6, cy - irisRadius * 0.6);
        g.lineTo(cx - irisRadius * 0.05, cy - irisRadius * 0.7);
        g.lineTo(cx - irisRadius * 0.3, cy - irisRadius * 0.1);
        g.lineTo(cx - irisRadius * 0.5, cy - irisRadius * 0.2);
        
        g.closePath();
        g.fill();
    }
    
    function drawTree(g, x, y, size, rotation, minSize, branchingAngle, shrinkRatio) {
        // rare case but I ran into it while resizing the window.
        if (!minSize || minSize < 1) {
            minSize = 1; 
        }
        if (size < minSize) {
            return;
        }

        var x2 = x + size * Math.cos(rotation), y2 = y + size * Math.sin(rotation);
        
        g.moveTo(x, y);
        g.lineTo(x2, y2);
        drawTree(g, x2, y2, size * shrinkRatio, rotation - branchingAngle, minSize, branchingAngle, shrinkRatio);
        drawTree(g, x2, y2, size * shrinkRatio, rotation + branchingAngle, minSize, branchingAngle, shrinkRatio);
    }
    
    function drawEyebrow(g, eyeMiddle, eyeLine, width) {
        var numHairs = eyebrowHairCount;
        var r = width * 1.7;
        var cx = eyeMiddle;
        var cy = eyeLine + r * 0.75;
        
        function getWidthMultiplier(ratio) {
            ratio = ratio - 0.5;
            return 0.2 + 3 * Math.sqrt(0.25 - ratio * ratio);
        }
        var xOffset;
        if (isLeftEye) {
            cx += width * 0.1;
            xOffset = width * 0.59;
        }
        else {
            cx -= width * 0.1;
            xOffset = width * 0.4;
        }
        g.lineWidth = '2';
        var eyebrowWidth = 0.055;
        var transparentHairColour = getTransparentColour(hairColour);
        for (var i = 0; i < numHairs; i++) {
            var x = cx - xOffset + i * width / numHairs;
            var dx = x - cx;
            var y = cy - Math.sqrt(r * r - dx * dx);
            
            var localBrowWidth = width * (eyebrowWidth * getWidthMultiplier(i / numHairs));
            if (isLeftEye) {
                localBrowWidth *= -1;
            }

            var x2 = x - localBrowWidth;
            var y2 = y - localBrowWidth;
            var x3 = x - localBrowWidth;
            var y3 = y + localBrowWidth;
            if (isLeftEye) {
                localBrowWidth *= -1;
            }
            var gradient = g.createRadialGradient(x, y, 0, x, y, localBrowWidth * 1.3);
            gradient.addColorStop(0, hairColour);
            gradient.addColorStop(0.6, hairColour);
            try {
                gradient.addColorStop(1.0, transparentHairColour);
            }
            catch (e) {
                
            }
            g.strokeStyle = gradient;
            
            g.beginPath();
            g.moveTo(x3, y3);
            g.lineTo(x, y);
            g.lineTo(x2, y2);
            g.moveTo(x3, y3);
            g.closePath();
            g.stroke();
        }
    }
    
    function drawVeins(g, cx, cy, maxRadius, irisRadius) {
        g.strokeStyle = 'rgba(200, 100, 100, ' + veinOpacity + ')';
        g.lineWidth = irisRadius * 0.005;
        var numVeins = 40;
        g.beginPath();
        for (var i = 0; i < numVeins; i++) {
            var angle = i * Math.PI * 2 / numVeins;
            var x = cx + maxRadius * Math.cos(angle);
            var y = cy + maxRadius * Math.sin(angle);
            drawTree(g, x, y, maxRadius * 0.1, angle + Math.PI, irisRadius * 0.08, 0.4, 0.87);
        }
        g.closePath();
        g.stroke();
    }
    
    function drawLashesArc(g, cx, cy, minX, maxX, radius, lashLength, numLashes, isLowerArc) {
        var gradient = g.createRadialGradient(cx, cy, radius, cx, cy, radius + lashLength);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        g.strokeStyle = gradient;
        g.lineWidth = (maxX - minX) * 0.003;
        g.beginPath();
        
        for (var i = 0; i < numLashes; i++) {
            var x = minX + (maxX - minX) * i / numLashes;
            var dx = x - cx;
            var dy = Math.sqrt(radius * radius - dx * dx);
            var y = cy;
            if (isLowerArc) {
                y += dy;
            }
            else {
                y -= dy;
            }
            var x2 = x + (x - cx) * lashLength / radius;
            var y2 = y + (y - cy) * lashLength / radius;
            
            g.moveTo(x, y);
            g.lineTo(x2, y2);
        }
        
        g.closePath();
        g.stroke();
    }
    
    function drawIrisAndPupil(g) {
        var irisRadius = getEyelidWidth() * irisRadiusCoefficient * 0.23;
        var pupilRadius = Math.max(1, irisRadius * pupilDilationRatio);
        var irisComplexity = irisRadius * 0.6;
        var cx = w / 2, cy = h / 2;
        
        var gradient = g.createRadialGradient(cx, cy, irisRadius, cx, cy, irisRadius * 2);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#cbb');
        g.fillStyle = gradient;
        g.fillRect(0, 0, w, h);

        gradient = g.createRadialGradient(cx, cy, 0, cx, cy, irisRadius);
        gradient.addColorStop(0, irisBackgroundColour);
        gradient.addColorStop(0.95, irisBackgroundColour);
        gradient.addColorStop(1, '#fff');
        g.fillStyle = gradient;
        g.beginPath();
        g.arc(cx, cy, irisRadius, 0, 2 * Math.PI);
        g.closePath();
        g.fill();
        
        drawVeins(g, cx, cy, irisRadius * 2, irisRadius);
        
        gradient = g.createRadialGradient(cx, cy, 0, cx, cy, pupilRadius * 0.82);
        gradient.addColorStop(0, pupilColour);
        gradient.addColorStop(0.85, pupilColour);
        gradient.addColorStop(1, eyeColour1);
        g.fillStyle = gradient;
        g.beginPath();
        g.arc(cx, cy, pupilRadius * 0.95, 0, 2 * Math.PI);
        g.closePath();
        g.fill();
        
        
        gradient = g.createRadialGradient(cx, cy, 0, cx, cy, irisRadius * 0.92);
        gradient.addColorStop(0, eyeColour1);
        gradient.addColorStop(0.95, eyeColour1);
        gradient.addColorStop(1, irisBackgroundColour);
        
        g.strokeStyle = gradient;
        g.lineWidth = irisRadius * 0.05;
        g.beginPath();
        g.arc(cx, cy, pupilRadius, 0, 2 * Math.PI);
        
        drawRadiatingLines(g, cx, cy, pupilRadius, irisRadius * 0.91,  Math.round(irisComplexity));

        g.closePath();
        g.stroke();

        g.lineWidth = irisRadius * 0.03;
        drawRadiatingLinesUsingRadialColour(g, cx, cy, pupilRadius, irisRadius * 0.6 + pupilRadius * 0.4,  Math.round(irisComplexity * 0.5), eyeColour2, eyeColour1);

        g.lineWidth = irisRadius * 0.01;
        drawRadiatingLinesUsingRadialColour(g, cx, cy, pupilRadius, irisRadius * 0.4 + pupilRadius * 0.6,  Math.round(irisComplexity * 0.5), eyeColour3, eyeColour1);

        // Draw some subtle tree patterns radiating from the pupil.
        var numTrees = Math.round(irisComplexity * 0.125);
        g.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        g.lineWidth = irisRadius * 0.008;
        g.beginPath();
        for (var i = 0; i < numTrees; i++) {
            var angle = i * Math.PI * 2 / numTrees;
            var x = cx + pupilRadius * Math.cos(angle);
            var y = cy + pupilRadius * Math.sin(angle);
            
            drawTree(g, x, y, (irisRadius - pupilRadius) * 0.12, angle, irisRadius * 0.015, 0.74, 0.76);
        }
        g.closePath();
        g.stroke();

        numTrees = Math.round(irisComplexity * 0.25);
        g.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        g.lineWidth = irisRadius * 0.008;
        g.beginPath();
        for (var i = 0; i < numTrees; i++) {
            var angle = i * Math.PI * 2 / numTrees;
            var x = cx + irisRadius * 0.95 * Math.cos(angle);
            var y = cy + irisRadius * 0.95 * Math.sin(angle);
            
            drawTree(g, x, y, (irisRadius - pupilRadius) * 0.2, angle + Math.PI, irisRadius * 0.015, 0.4, 0.65);
        }
        g.closePath();
        g.stroke();


        drawGlare(g, cx, cy, irisRadius);
    }
    
    function getEyeLine() {
        return h * 0.52;
    }
    
    function getEyelidWidth() {
        return w * 0.9;
    }
    
    function getSkinHighlightColour() {
        return shadeColour(skinColour, 50);
    }
    
    function highlightAboveEye(g, eyelidMiddle, eyelidWidth) {
        var minRadius = eyelidWidth * 1.4;
        var maxRadius = eyelidWidth * 2.8;
        var cx = eyelidMiddle, cy = getEyeLine() + eyelidWidth;
        if (isLeftEye) {
            cx -= eyelidWidth * 0.2;
        }
        else {
            cx += eyelidWidth * 0.2;
        }
        var skinHighlightColour = getSkinHighlightColour();
        var gradient = g.createRadialGradient(cx, cy, minRadius, cx, cy, maxRadius);
        gradient.addColorStop(0, skinColour);
        gradient.addColorStop(0.2, skinHighlightColour);
        gradient.addColorStop(1, skinHighlightColour);
        g.fillStyle = gradient;
        g.beginPath();
        g.arc(cx, cy, minRadius, Math.PI, 0);
        g.rect(w, 0, -w, h);
        g.closePath();
        g.fill();
    }
    
    function highlightBelowEye(g, eyelidMiddle, eyelidWidth) {
        var minRadius = eyelidWidth * 0.8;
        var maxRadius = eyelidWidth * 1.5;
        var cx = eyelidMiddle, cy = getEyeLine() - eyelidWidth * 0.4;
        if (isLeftEye) {
            cx += eyelidWidth * 0.1;
        }
        else {
            cx -= eyelidWidth * 0.1;
        }
        var skinHighlightColour = shadeColour(skinColour, 20);
        var gradient = g.createRadialGradient(cx, cy, minRadius, cx, cy, maxRadius);
        gradient.addColorStop(0, skinColour);
        gradient.addColorStop(0.1, skinHighlightColour);
        gradient.addColorStop(1, skinColour);
        g.fillStyle = gradient;
        g.beginPath();
        g.arc(cx, cy, minRadius, Math.PI * 2, 0);
        g.rect(w, 0, -w, h);
        g.closePath();
        g.fill();
    }
    
    // Draws the caruncle.  
    // The caruncle is part of the eye in the corner of the eyelids near the nose.
    function drawCaruncle(g, eyelidMiddle, eyelidWidth) {
        var cx = eyelidMiddle, cy = getEyeLine();
        var caruncleRadius = eyelidWidth * 0.08;
        if( isLeftEye ) {
            cx -= eyelidWidth * 0.5;
        }
        else {
            cx += eyelidWidth * 0.5;
        }

        var gradient = g.createRadialGradient(cx, cy + caruncleRadius * 0.2, 0, cx, cy + caruncleRadius * 0.2, caruncleRadius * 1.2);
        gradient.addColorStop(0, '#ffd0c8');
        gradient.addColorStop(0.7, '#ffd0c8');
        gradient.addColorStop(1, '#fff');

        g.fillStyle = gradient;
        g.beginPath();
        g.arc(cx, cy, caruncleRadius, Math.PI * 2, 0);
        g.closePath();
        g.fill();
    }

    function drawEyelids(g) {
        var eyeLine = getEyeLine();
        var minRadius = getEyelidWidth() * 0.7;
        var r = minRadius * (1 + Math.tan((1 - eyelidOpenness * eyelidOpennessCoefficient) * Math.PI * 0.5));
        var dx = getEyelidWidth() * 0.5;
        var hOffset = Math.sqrt(r * r - dx * dx);

        drawCaruncle(g, w / 2, dx * 2);

        // draw a shadow under upper eyelid.
        g.fillStyle = 'rgba(0, 0, 0, 0.15)';
        g.beginPath();
        
        g.arc(w/2, eyeLine + hOffset + minRadius * 0.05, r, Math.PI, 0);
        g.rect(w, 0, -w, h);

        g.closePath();
        g.fill();
        
        // Draw the unpigmented skin from the lower and upper eyelids.
        g.fillStyle = '#ffdddd';
        g.beginPath();
        
        g.arc(w/2, eyeLine + hOffset + minRadius * 0.01, r, Math.PI, 0);
        g.arc(w/2, eyeLine - hOffset - minRadius * 0.03, r, 0, Math.PI);
        g.rect(w, 0, -w, h);

        g.closePath();
        g.fill();
        

        // Draw the skin of the eyelids.
        g.fillStyle = skinColour;
        g.beginPath();
        
        g.arc(w/2, eyeLine - hOffset, r, 0, Math.PI);
        g.arc(w/2, eyeLine + hOffset, r, Math.PI, 0);
        g.rect(w, 0, -w, h);

        g.closePath();
        g.fill();
        
        var lowerEyelidY = eyeLine - hOffset + r;
        // Make sure all tears are below the lower eyelid.
        tearDrops.forEach(function(drop) {
            drop.cy = Math.max(drop.cy, lowerEyelidY);
        });
        if (tearVolumeOnLowerEyelid > 0.1) {
            var dropRadius = tearVolumeOnLowerEyelid * dx * 0.05;
            var drop = {
                'cx': w/2,
                'cy': lowerEyelidY - dropRadius * 1.5,
                'radius': dropRadius
            };
            drawTeardrop(g, drop);

            if (tearVolumeOnLowerEyelid > 0.7) {
                tearVolumeOnLowerEyelid -= 0.7;
                tearDrops.push({
                    'cx': drop.cx,
                    'cy': drop.cy,
                    'radius': dx * 0.05
                });
            }
        }
        
        highlightAboveEye(g, w/2, dx * 2);
        highlightBelowEye(g, w/2, dx * 2);

        drawLashesArc(g, w/2, eyeLine + hOffset, w/2 - dx, w/2 + dx, r + dx * 0.02, dx * 0.07, 40, false);
        drawLashesArc(g, w/2, eyeLine - hOffset, w/2 - dx, w/2 + dx, r + dx * 0.03, dx * 0.05, 20, true);
    }

    function draw() {
        var $canvas = $('canvas');
        var g = $canvas[0].getContext('2d');
        g.fillStyle = '#fff';
        g.rect(0, 0, w, h);
        g.fill();
        drawIrisAndPupil(g);
        drawEyelids(g);
        drawEyebrow(g, w/2, getEyeLine(), getEyelidWidth() * 1.1);
        drawTeardrops(g);
    }
    
    function resized() {
        w = $(window).width();
        h = $(window).height();
        $('canvas').attr('width', w);
        $('canvas').attr('height', h);
    }

    function updateAnimation() {
        // If in the process of blinking, make some progress.
        blinkingState += 1/10.0;
        if (blinkingState >= 1) {
            // finished blinking so schedule a future blink several seconds later.
            blinkingState = - (100 + 10 * Math.random());
            eyelidOpenness = 1;
        }
        else {
            if (blinkingState > 0) {
                eyelidOpenness = Math.abs(blinkingState - 0.5) * 2;
            }
        }
        // If the intro animation is over.
        if (introAnimationIsOver) {
            // Randomly adjust dilation to mimick a real eye's continuously adapting dilation.
            pupilDilationRatio = (0.0012 * (Math.random() - 0.5) + pupilDilationRatio) * 0.9995 + 0.0005 * 0.3;
            // the end of this expression averages in a general goal of 0.3 dilation so the dilation is likely to stay close to 0.3.
            // We don't want it looking ridiculous.
        }
        // Let the teardrops fall.
        tearDrops.forEach(function(drop) {
            drop.cy += (w + h) * 0.001;
            drop.cx += (Math.random() - 0.5) * (w + h) * 0.001; 
            // Let the teardrops randomly move slightly left or right as they fall.
            // This can look a little like wind pushing it.
        });

        // Remove tears that are off the bottom of the display and will not show.
        tearDrops = tearDrops.filter(function(drop) {
            return drop.cy - drop.radius < h;
        });
        
        // Let the tears in the eyelid dry slowly.
        tearVolumeOnLowerEyelid = tearVolumeOnLowerEyelid * 0.998;
        
        // let tears accumulate based on veinOpacity.
        tearVolumeOnLowerEyelid += veinOpacity * 0.01;
        
        // Fade the veins away slowly.
        veinOpacity = 0.997 * veinOpacity + 0.003 * 0.08;
        draw();
        requestAnimationFrame(updateAnimation);
    }

    function updateIntroAnimation() {
        if (eyelidOpennessCoefficient < 1) {
            // slowly open the eyes as if the person is waking up.
            eyelidOpennessCoefficient += 0.002 + (1 - eyelidOpennessCoefficient) * 0.03;
            setTimeout(updateIntroAnimation, 20);
        }
        else {
            introAnimationIsOver = true;
            showSettings();
        }
    }
    
    function clicked(event) {
        // if on or very close to the eye, simulate touching the eye by blinking and expanding the veins.
        var x = event.pageX, y = event.pageY;
        var cx = w / 2;
        var eyeLine = getEyeLine();
        var eyeWidth = getEyelidWidth();
        if (Math.abs(cx - x) < eyeWidth * 0.5 && Math.abs(y - eyeLine) < eyeWidth * 0.4 ) {
            // blink if not already blinking.
            if (blinkingState < 0) {
                blinkingState = 0;
            }
            veinOpacity = Math.min(0.8, veinOpacity + 0.1);
        }
    }
    
    function hideSettings() {
        $('.settings-dialog').removeClass('open');
    }
    
    function updateInputControlValues() {
        $('#pupilDilation').val(pupilDilationRatio);
        $('#maxEyelidOpenness').val(eyelidOpennessCoefficient);
        $('#irisRadiusCoefficient').val(irisRadiusCoefficient);
    }
    
    function showSettings() {
        $('.settings-dialog').addClass('open');
        updateInputControlValues();
    }
    
    function pupilDilationInputChanged() {
        var val = $('#pupilDilation').val();
        if (!isNaN(val)) {
            pupilDilationRatio = Math.min(0.99, Math.max(0.01, val));
        }
    }
    
    function maxEyelidOpennessChanged() {
        var val = $('#maxEyelidOpenness').val();
        if (!isNaN(val)) {
            eyelidOpennessCoefficient = Math.min(1, Math.max(0.01, val));
        }
    }
    
    function irisRadiusCoefficientChanged() {
        irisRadiusCoefficient = $('#irisRadiusCoefficient').val();
    } 
    
    function leftEyeClicked() {
        isLeftEye = true;
        updateEyeSelection();
    }
    
    function rightEyeClicked() {
        isLeftEye = false;
        updateEyeSelection();
    }
    
    function updateEyeSelection() {
        $('#leftEye, #rightEye').removeClass('selected');
        if (isLeftEye)
            $('#leftEye').addClass('selected');
        else
            $('#rightEye').addClass('selected');
    }
    
    function isUsingInternetExplorer() {
       var ua = window.navigator.userAgent;
       var msie = ua.indexOf("Trident");
       return msie !== -1; 
    }
    
    function handleOldBrowsers() {
        // if using Internet Explorer, replace range inputs with number inputs.
        if (isUsingInternetExplorer()) {
            $('input[type="range"]').attr('step', 'any');
            $('body').addClass('ie');
        }
    }

    handleOldBrowsers();
    setEnvironmentVariables(ethnicities[1], true);
    updateEyeSelection();
    updateIntroAnimation();
    addEthnicitiesToSettings();
    addEyeColoursToSettings();
    $('canvas').click(clicked);
    $('#leftEye').click(leftEyeClicked);
    $('#rightEye').click(rightEyeClicked);
    $('#pupilDilation').on('input', pupilDilationInputChanged);
    $('#maxEyelidOpenness').on('input', maxEyelidOpennessChanged);
    $('#irisRadiusCoefficient').on('input', irisRadiusCoefficientChanged);
    $('.settings-dialog .ok').click(hideSettings);
    $('.settings').click(showSettings);
    $(window).on('resize', resized);
    resized();
    updateAnimation();
}

$(document).ready(init);