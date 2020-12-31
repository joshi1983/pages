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
