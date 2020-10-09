/*
This code is a crafty example for using JavaScript-controlled CSS variables and other CSS3 features like animations, gradients, and transformations.

CSS variables for the rose peddle colours are controlled through the user-interface with help from JavaScript.

Please remember to up vote if you like this code.  Also, have fun sharing digital roses with your friends using the "Download Snapshot" feature of the dialog.

Author: Josh Greig

You can chat with me on facebook at 
https://www.facebook.com/josh.greig.5 or email me at josh.greig@gmail.com if you have questions about this.  
I'm more than happy to help.a
*/
$(function() {
    var maxRadius;
    var numPeddlesPerCircle = 2;
    
    function resized() {
        maxRadius = ($('body').width() + $('body').height()) * 0.1;
        updateRosePainting();
    }
    
    /* Depending on the number of peddles per circle, the peddles would ordinarily appear too large at 3 
    and too small at 23.
    
    This function returns a value between 0 and 1 to multiply the maxRadius by to get the very largest peddle's size.
    */
    function getInitialRadiusMultiplier() {
        var presetValues = {
            "3": 0.7,
            "8": 0.95,
            "12": 1.2,
            "23": 1.25
        };
        if (presetValues["" + numPeddlesPerCircle]) {
            return presetValues["" + numPeddlesPerCircle];
        }
        var less = 3, more = 23;
        for (var key in presetValues) {
            key = parseInt(key);
            if (key < numPeddlesPerCircle && key > less) {
                less = key;
            }
            if (key > numPeddlesPerCircle && key < more) {
                more = key;
            }
        }
        var initialRadiusRatio = (numPeddlesPerCircle - less) / (more - less);
        return initialRadiusRatio * presetValues["" + more] + (1 - initialRadiusRatio) * presetValues["" + less];
    }
    
    function updateRosePainting() {
        var shrinkPeddlesFactor = 0.8;
        var expandPeddlesFactor = 10 / numPeddlesPerCircle;
        var cx;
        var cy;
        shrinkPeddlesFactor *= expandPeddlesFactor;
        $('.peddles').empty(); // remove all child elements.
        for (var r = maxRadius * getInitialRadiusMultiplier(); r > 3;) {
            var rDelta = r * 0.3 + 2;
            for (var i = 0; i < numPeddlesPerCircle; i++) {
                var angleDegrees = i * 360 / numPeddlesPerCircle - 90;
                var angleRadians = angleDegrees * Math.PI / 180 + Math.PI / 2;
                var top = (maxRadius - r) * shrinkPeddlesFactor * 0.5 + r * Math.sin(angleRadians) + "px";
                var left =  (maxRadius - r) * shrinkPeddlesFactor * 0.5 + r  * Math.cos(angleRadians) + "px";
                var properties = {
                    'width': r * shrinkPeddlesFactor + "px",
                    'height': r * shrinkPeddlesFactor + "px",
                    'top': top,
                    'left': left,
                    'transform': 'rotate(' + angleDegrees + 'deg)'
                };
                var $div = $('<div></div>').css(properties);
                $('.rose .peddles').append($div);
                r -= rDelta / numPeddlesPerCircle;
                cx = left;
                cy = top;
            }
        }
        $('.stem, .rose-centre').css({
            'left': left
        });
        $('.rose-centre').css({'top': top});
        top = parseInt(top); // remove the 'px' unit and convert to integer.
        left = parseInt(left);
        var leafSize = maxRadius + 'px';
        $('.leaf-1, .leaf-2').css({
            'width': leafSize,
            'height': leafSize
        });
        $('.leaf-1').css({
            'top': top + maxRadius * 1.4 + 'px',
            'left': left + maxRadius * 0.15 + 'px',
            'borderRadius': leafSize + ' 0'
        });
        $('.leaf-2').css({
            'top': top + maxRadius * 2 + 'px',
            'left': left - maxRadius * 1.05 + 'px',
            'borderRadius': '0 ' + leafSize
        });
        $('.rose').css('margin-left', 'calc(50% - ' + left + 'px)');
        $('.peddles div').on('click', showPeddleCountDialog);
    }
    
    function updateNumRosePeddlesPerCicle() {
        numPeddlesPerCircle = $('#numRosePeddlesPerCircle').val();
        updateRosePainting();
    }
    
    function updatePeddleColour() {
        let root = document.documentElement;
        root.style.setProperty('--peddle-colour', $('#peddleColour').val());
    }

    function updatePeddleHighlightColour() {
        let root = document.documentElement;
        root.style.setProperty('--peddle-highlight-colour', $('#peddleHighlightColour').val());
    }
    
    function showPeddleCountDialog() {
        $('.dialog').addClass('open');
    }
    
    function hideDialog() {
        $('.dialog').removeClass('open');
    }

    function downloadSnapshot() {
        function downloadWithSpec(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
        
            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
        
        var tempDocument = document.documentElement.cloneNode(true);
        $(tempDocument).find('.dialog').removeClass('open'); // hide the dialog initially.

        // Embed the current CSS variable values.
        ['peddle-colour', 'peddle-highlight-colour'].forEach(function(varName) {
            let root = document.documentElement;
            var value = getComputedStyle(root).getPropertyValue('--' + varName);
            var $styleElement = $(tempDocument).find('style');
            var cssContent = $styleElement.text();
            var index = cssContent.indexOf('--' + varName + ':');
            if (index !== -1) {
                var semicolonIndex = cssContent.indexOf(';', index + varName.length + '--'.length + 1);
                if (semicolonIndex !== -1) {
                    cssContent = cssContent.substring(0, index) + '--' + varName + ': ' + value + ';' + cssContent.substring(semicolonIndex + 1);
                }
            }
            $styleElement.text(cssContent);
        });
        downloadWithSpec('rose.html', tempDocument.innerHTML);
    }
    
    // This animation is just to grab the visitor's attention.
    function animateNumberOfPeddles() {
        if (numPeddlesPerCircle < $('#numRosePeddlesPerCircle').val()) {
            numPeddlesPerCircle++;
            updateRosePainting();
            setTimeout(animateNumberOfPeddles, 100);
        }
    }
    
    animateNumberOfPeddles();

    $('.dialog button.ok').on('click', hideDialog);
    $('.dialog button.download').on('click', downloadSnapshot);
    $('#numRosePeddlesPerCircle').on('input change', updateNumRosePeddlesPerCicle);
    $('#peddleColour').on('change', updatePeddleColour);
    $('#peddleHighlightColour').on('change', updatePeddleHighlightColour);
    $(window).on('resize', resized);
    resized();
});