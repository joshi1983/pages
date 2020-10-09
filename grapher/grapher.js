document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.querySelector('textarea');
    var errorMessage = document.getElementById('error-message');
    var expandCollapseInputs = document.getElementById('expand-collapse-inputs');
	var colourMapErrorMessage = document.getElementById('colour-map-error-message');
    var f = function() {return 0;};
    var tStart;
	var isCreatingDownloadLink = false;
	var refreshTimes = [];
    var canvas = document.querySelector('canvas');
    var $canvas = $(canvas);
    var maxT = 10000;
	var tValue; /* maintained undefined unless the download dialog is open. */
	var colourMapFunction;
	var useCustomColourMapFunction;
	var hasCustomColourMapFunction;
    var resolutionScale = 1;
    var exampleFunctions = [
	        {
            'name': 'Expanding Hemisphere',
            'code': `var y = t - (x * x + z * z);
if (y < 0)
  return 0;

return Math.sqrt(y);`
        },
		{
			'name': 'Julia Set 2',
			'code': `x *= 0.01;
z *= 0.01;
var cRe = -0.704029749122184;
var cIm = t * 0.00001 - 0.005 -0.3383527246917294;
var newRe = x;
var newIm = z;
for(var i = 0; i < 155; i++)
{
  //remember value of previous iteration
  var oldRe = newRe;
  var oldIm = newIm;
  //the actual iteration, the real and imaginary part are calculated
  newRe = oldRe * oldRe - oldIm * oldIm + cRe;
  newIm = 2 * oldRe * oldIm + cIm;
  //if the point is outside the circle with radius 2: stop
  if((newRe * newRe + newIm * newIm) > 4) break;
}

return i;`
		},
        {
            'name': 'Pulsating Cone',
            'code': `t *= 0.004;
return Math.sqrt(x * x + z * z) * (1 + Math.sin(t));
`
        },{
        'name': 'Twisted Waves',
        'code': `var a = Math.atan2(x, z);
x = Math.abs(x) + a * 10;
z = Math.abs(z) + a * 10;
x *= 0.1;
z *= 0.1;
t *= 0.001;
var r = Math.sqrt(x * x + z * z) + t;
return (1 + Math.sin(r)) * 25;
`},
        {
        'name': 'Waves',
        'code': `x *= 0.1;
z *= 0.1;
t *= 0.001;
var r = Math.sqrt(x * x + z * z) + t;
return (1 + Math.sin(r)) * 25;`
        },
        {
            'name': 'Mandelbrot',
            'code': `x *= 0.01;
z *= 0.01;

var xt;
var zx = 0, zy = 0;
var cy = z;
var cx = x;

for (var i = 0; i < 25 && zx < 2; i++) {
   xt = zx * zy;
   zx = zx * zx - zy * zy + cx;
   zy = 2 * xt + cy;
}

return i;`
        },{
            'name': 'Warped Mandelbrot',
            'code': `x *= 0.01;
z *= 0.01;
t *= 0.002;
x += 0.1 * (1 + Math.sin(x * 2 + z * 2 + t));

var xt;
var zx = 0, zy = 0;
var cy = z;
var cx = x;

for (var i = 0; i < 25 && zx < 2; i++) {
   xt = zx * zy;
   zx = zx * zx - zy * zy + cx;
   zy = 2 * xt + cy;
}

return i;`
        },{
            'name': 'Julia Set',
            'code': `x *= 0.01;
z *= 0.01;
var cRe = -0.704029749122184;
var cIm = t * 0.001 - 5; // -0.3383527246917294
var newRe = x;
var newIm = z;
for(var i = 0; i < 25; i++)
{
  //remember value of previous iteration
  var oldRe = newRe;
  var oldIm = newIm;
  //the actual iteration, the real and imaginary part are calculated
  newRe = oldRe * oldRe - oldIm * oldIm + cRe;
  newIm = 2 * oldRe * oldIm + cIm;
  //if the point is outside the circle with radius 2: stop
  if((newRe * newRe + newIm * newIm) > 4) break;
}

return i;`
        },
        {
            'name': 'Circle',
            'code': `if (Math.sqrt(x * x + z * z) < 50)
    return 10;
else 
    return 0;`
        }, {
            'name': 'Expanding Circle',
            'code': `if (Math.sqrt(x * x + z * z) < t * 0.01)
    return 10;`
        }
];    
    var editor;

	function processRefreshTime() {
		// remove all refresh times older than 1 second.
		var currentTime = new Date().getTime();
		refreshTimes = refreshTimes.filter(function(time) {
			return currentTime - time <= 1000;
		});
		// once per second, check if the resolutionScale should change.
		// The goal is to use the highest resolution that also maintains a smooth frame rate.
		if (refreshTimes.length > 1 && Math.floor(currentTime / 1000) !== Math.floor(refreshTimes[refreshTimes.length - 1] / 1000))
		{
			if (refreshTimes.length > 55 && resolutionScale > 1) {
				resolutionScale --;
			}
			else if (refreshTimes.length < 10) {
				resolutionScale ++;
			}
		}
		refreshTimes.push(currentTime);
	}
    
    function setMessage(msg) {
        errorMessage.innerText = msg;
    }
	
	function setColourMapMessage(msg) {
		colourMapErrorMessage.innerText = msg;
		if (msg === '') {
			useCustomColourMapFunction = true;
		}
		else {
			useCustomColourMapFunction = false;
		}
	}

    function updateFunction() {
        try {
            f = new Function('x', 'z', 't', editor.getDoc().getValue());
            setMessage('');
        }
        catch (e) {
            setMessage('' + e);
        }
    }
    
    function twoDigits(v) {
        v = Math.min(255, Math.max(0, Math.round(v)));
        if (v < 16)
            return '0' + v.toString(16);
        else
            return v.toString(16);
    }

    function colourBound(v){
        return Math.min(255, Math.max(0, Math.round(v)));
    }
    
    function numberToColour(v) {
		var result;
		if (useCustomColourMapFunction) {
			try {
				result = colourMapFunction(v);
			} catch(e) {
				setColourMapMessage(e);
			}
		}
		if (typeof result === 'object' && result.length === 3) {
			return result.map(colourBound);
		}
		else {
			return [colourBound(v), colourBound(v * 10), colourBound(v * 50)];
		}
    }
	
    function drawColourGraph(canvas, minX, minY, maxX, maxY, t, isSubsampling) {
        var w = canvas.getAttribute('width');
        var h = canvas.getAttribute('height');
        var g = canvas.getContext('2d');
        var cx = w * 0.5, cy = h * 0.5;
		var ph = maxY - minY;
		var pw = maxX - minX;
        var pixels = g.createImageData(pw, ph);
        var data = pixels.data;
		var averageDimension = (w + h) * 0.5;
		var scale = 500 / Math.sqrt(averageDimension);
		if (!isSubsampling && resolutionScale !== 1) {
			scale *= Math.sqrt(resolutionScale);
		}

		if (hasCustomColourMapFunction) {
			setColourMapMessage('');
		}
        for (var x = minX; x < maxX; x++) {
            for (var y = minY; y < maxY; y++) {
				var c;
				if (isSubsampling) {
					c = [0, 0, 0];
					var increment = 0.45;
					for (var dx = 0; dx <= increment; dx += increment) {
						for (var dy = 0; dy <= increment; dy += increment) {
							var v = f((x + dx - cx) * scale, (y + dy - cy) * scale, t);
							var tempC = numberToColour(v);
							for (var i = 0; i < c.length; i++) {
								c[i] += tempC[i];
							}
						}
					}
					for (var i = 0; i < c.length; i++) {
						c[i] *= 0.25;
					}
				}
				else {
					var v = f((x - cx) * scale, (y - cy) * scale, t);
					c = numberToColour(v);
				}
                var offset = ((x - minX) + (y - minY) * pw) * 4;
                data[offset + 3] = 255;
                data[offset] = c[0];
                data[offset + 1] = c[1];
                data[offset + 2] = c[2];
            }
        }
        g.putImageData(pixels, minX, minY);
    }
    
    function updateGraph() {
		if (!isCreatingDownloadLink) {
			processRefreshTime();
			resized();
			try{
				drawColourGraph(canvas, 0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'), getT(), false);
			}
			catch (e) {
				setMessage(e);
			}
		}
        requestAnimationFrame(updateGraph);        
    }
    
    function resized() {
        canvas.setAttribute('width', Math.round($canvas.width() / resolutionScale));
        canvas.setAttribute('height', Math.round($canvas.height() / resolutionScale));
    }
    
    function expandCollapseInputsClicked()
    {
        var h = $('body').height() - $('.CodeMirror').offset().top - $('#inputs footer').height() - 10;
        h = Math.round(h);
        if ($(textarea).height() > h * 0.5) {
            h = 60;
			editor.setSize(60);
        }
        else {
            $canvas.height(5);
        }
        $(textarea).height(h);
		editor.setSize('100%', h);
    }

    function getT() {
        if (tValue !== undefined)
            return tValue;

        var result = (new Date().getTime() - tStart);
        if (result > maxT)
        {
            resetT();
            result = 0;
        }
        return result;
    }   

    function resetT() {
        tStart = new Date().getTime();
    }
	
	function initDownloader() {
		var downloadButton = document.getElementById('download-button');
		var downloadDialog = document.getElementById('download-dialog');
		var downloadCancel = document.getElementById('download-cancel');
		var resolutionSelect = document.getElementById('download-resolution');
		var downloadDownloadButton = document.getElementById('download-download');
		var downloadProgress = document.getElementById('download-progress');
		var tValueInput = document.getElementById('download-t');
		var x;
		var intervalWidth;
		var tempCanvas;

		function open() {
			downloadDialog.setAttribute('class', 'open');
			tValue = getT();
			tValueInput.value = tValue;
		}

		function close() {
			downloadDialog.setAttribute('class', '');
			tValue = undefined;
		}
		
		function getSelectedResolution() {
			var resolution = resolutionSelect.value;
			var dimensions = resolution.split('x').map(function(v) {
				return parseInt(v);
			});
			return {
				'width': dimensions[0],
				'height': dimensions[1]
			};
		}
		
		function createDownload(){
			tempCanvas.toBlob(function(blob) {
				saveAs(blob, 'colour_4D_grapher.png');
			}, 'image/png');
		}
		
		function drawPiece() {
			var w = tempCanvas.getAttribute('width');
			var h = tempCanvas.getAttribute('height');
			var t = new Date().getTime();
			do {
				drawColourGraph(tempCanvas, x, 0, x + intervalWidth, h, tValue, true);
				x += intervalWidth;
			}
			while ((new Date().getTime() - t) < 100 && x < w);
			if (x < w) {
				downloadProgress.value = x * 100 / w;
				requestAnimationFrame(drawPiece);
			}
			else {
				isCreatingDownloadLink = false;
				createDownload();
				close();
			}
		}
		
		function download() {
			// prevent double-clicking the download button.
			if (isCreatingDownloadLink)
				return;

			isCreatingDownloadLink = true;
			var size = getSelectedResolution();
			tempCanvas = document.createElement('canvas');
			tempCanvas.setAttribute('width', size.width);
			tempCanvas.setAttribute('height', size.height);
			x = 0;
			var pixelArea = $canvas.width() * $canvas.height() / (resolutionScale * resolutionScale);
			intervalWidth = Math.max(1, Math.round(pixelArea / 4 / size.height));
			drawPiece();
		}
		
		function setTValue() {
		    tValue = parseFloat(tValueInput.value);
		}
		
		tValueInput.addEventListener('input', setTValue);
		downloadDownloadButton.addEventListener('click', download);
		downloadCancel.addEventListener('click', close);
		downloadButton.addEventListener('click', open);
	}
	
	function initColoursSelector() {
		var colourMapCode = document.getElementById('colour-map-code');
		var coloursButton = document.getElementById('edit-colours-button');
		var colourMapSelector = document.getElementById('colour-map-selector');
		var colourMapResetButton = document.getElementById('colour-map-select-reset');
		var okButton = document.getElementById('colour-map-select-ok');
		var originalCode = colourMapCode.value;

		function loadColourMapFunction()
		{
			try {
				colourMapFunction = new Function('v', colourMapCode.value);
				hasCustomColourMapFunction = true;
			} catch (e) {
				hasCustomColourMapFunction = false;
				setColourMapMessage('' + e);
			}
		}
		
		function resetCode() {
			colourMapCode.value = originalCode;
			loadColourMapFunction();
		}

        function close() {
            colourMapSelector.setAttribute('class', '');
        }
		
		function open() {
            colourMapSelector.setAttribute('class', 'open');
		}

		colourMapResetButton.addEventListener('click', resetCode);
		coloursButton.addEventListener('click', open);
		okButton.addEventListener('click', close);
		colourMapCode.addEventListener('input', loadColourMapFunction);
		loadColourMapFunction();
	}
	
	function getCodeByName(codeName)
	{
        var selectedCode = exampleFunctions.filter(function(example) {
            return example.name === codeName;
        })[0];
        if (selectedCode) {
            return selectedCode.code;
        }
		return '';
	}
	
    function loadCodeByName(codeName)
    {
		editor.getDoc().setValue(getCodeByName(codeName));
		updateFunction();
    }

    function initExampleSelector() {
        var exampleCancel = document.getElementById('example-select-cancel');
        var exampleOk = document.getElementById('example-select-ok');
        var exampleSelector = document.getElementById('example-selector');
        var exampleSelection = document.getElementById('example-selection');
        var exampleLoaderButton = document.getElementById('example-loader');

        function close() {
            exampleSelector.setAttribute('class', '');
        }

        function okClicked() {
            var selectedName = exampleSelection.value;
            loadCodeByName(selectedName);
            close();
        }

        function open() {
            exampleSelector.setAttribute('class', 'open');
        }
        
        function compareByName(code1, code2) {
            return code1.name.localeCompare(code2.name);
        }
        
        function loadExamplesIntoSelect() {
            exampleFunctions.sort(compareByName);
            exampleFunctions.forEach(function(exampleCode) {
                var option = document.createElement('option');
                option.innerText = exampleCode.name;
                exampleSelection.append(option);
            });
        }
        
        loadExamplesIntoSelect();
        exampleCancel.addEventListener('click', close);
        exampleOk.addEventListener('click', okClicked);
        exampleLoaderButton.addEventListener('click', open);
    }

	textarea.value = getCodeByName('Julia Set 2');
	editor = CodeMirror.fromTextArea(textarea, {
		mode: 'javascript',
		lineNumbers: true
	});
	initDownloader();
	initColoursSelector();
	editor.on('change', updateFunction);
    resetT(); 
    expandCollapseInputs.addEventListener('click', expandCollapseInputsClicked);
    resized();
    updateFunction();
    updateGraph();
    window.addEventListener('resize', resized);
    textarea.addEventListener('resize', resized);
    initExampleSelector();
});