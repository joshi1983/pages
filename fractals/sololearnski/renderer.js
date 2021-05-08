
function Renderer(zoom, selectedFractal) {
    var self = this;
    var maxSquareSize = 4;
    self.selectedFractal = selectedFractal;
    var renderingQueue = [];
    var lastResetQueueSize = 0;
    var renderProgressListeners = [];
    
    self.addListener = function(listener) {
        renderProgressListeners.push(listener);  
    };
    
    self.removeListener = function(listener) {
        var index;
        do {
            index = renderProgressListeners.indexOf(listener);
            if (index !== -1) {
                renderProgressListeners.splice(index, 1);
            }
        } while (index !== -1);
    };
    
    function processSection(squareSize, minX, minY, maxX, maxY) {
        if (self.valueToColour === undefined || self.selectedFractal === undefined) {
            return;
        }
        var $canvas = $('canvas');
        var g = $canvas[0].getContext('2d');

        var pixeledSquareSize = Math.max(1, squareSize);

        // Make sure the range starts with integers to avoid having pixels blurred into each other.
        minX = parseInt(minX);
        minY = parseInt(minY);
        for (var x = minX; x < maxX; x += pixeledSquareSize) {
            for (var y = minY; y < maxY; y += pixeledSquareSize) {
                var p;
                var value;
                if (squareSize < 1) {
                    var totalValue = 0;
                    for (var microX = 0; microX < 1; microX += squareSize) {
                        for (var microY = 0; microY < 1; microY += squareSize) {
                            p = zoom.pixelsToViewerCoordinates(x + microX, y + microY);
                            totalValue += self.selectedFractal.getValueAt(p.x, p.y);
                        }
                    }
                    value = totalValue * squareSize * squareSize;
                }
                else {
                    p = zoom.pixelsToViewerCoordinates(x, y);
                    value = self.selectedFractal.getValueAt(p.x, p.y);
                }
                
                var colour = self.valueToColour(value);
                g.fillStyle = colour;
                g.fillRect(x, y, pixeledSquareSize, pixeledSquareSize);
            }
        }
    }

    function trimBottomRight(renderingTask) {
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        var g = $canvas[0].getContext('2d');
        g.fillStyle = self.valueToColour(0);
        g.fillRect(renderingTask.minX, renderingTask.maxY, renderingTask.maxX - renderingTask.minX + 5, 5);
        g.fillRect(renderingTask.maxX, renderingTask.minY, 5, renderingTask.maxY - renderingTask.minY + 5);
    }
    
    function clearDisplay() {
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        var g = $canvas[0].getContext('2d');
        var backgroundColour = self.valueToColour(0);
        g.fillStyle = backgroundColour;
        g.fillRect(0,0,w,h);
    }
    
    function dispatchRenderingUpdate(renderingInfo) {
        renderProgressListeners.forEach(function(listener) {
            listener(renderingInfo);
        });
    }
    
    function processRenderingChunk() {
        if (renderingQueue.length > 0) {
            var renderingTask = renderingQueue[0];
            renderingQueue.shift();
            if (renderingTask.squareSize === undefined) {
                trimBottomRight(renderingTask);
            }
            else {
                if (renderingTask.squareSize === maxSquareSize) {
                    clearDisplay();
                }
                processSection(renderingTask.squareSize, renderingTask.minX, renderingTask.minY, renderingTask.maxX, renderingTask.maxY);
            }
            dispatchRenderingUpdate({
                'percentRemaining': renderingQueue.length * 100 / lastResetQueueSize
            });
        }
        setTimeout(processRenderingChunk, 0);
        // Call again as soon as possible but give browser an opportunity 
        // to respond to user input.
        // This is to maximize rendering speeds while keeping the page fairly responsive.
    }

    self.resetDisplay = function(isForDownloading) {
        if (isForDownloading === undefined) {
            isForDownloading = false;
        }
        // Resets the processing queue so a new region is drawn completely fresh.
        var $canvas = $('canvas');
        var w = $canvas.width(), h = $canvas.height();
        if (typeof self.selectedFractal.draw === 'function') {
            renderingQueue = []; // Don't do the other type of drawing.
            lastResetQueueSize = 0;
            self.selectedFractal.draw($canvas[0].getContext('2d'), self.valueToColour, zoom);
            dispatchRenderingUpdate({
                'percentRemaining': 0
            });
            return;
        }
        if (typeof self.selectedFractal.adaptToZoom === 'function') {
            self.selectedFractal.adaptToZoom(zoom.getAverageSize());
        }
        squareSize = maxSquareSize;
        renderingQueue = [];
        var squareSizes = [];
        if (isForDownloading === false) {
            for (var squareSize = maxSquareSize; squareSize >= 1; squareSize --) {
                squareSizes.push(squareSize);
            }
            squareSizes.push(0.5);
        }
        else {
            clearDisplay();
        }
        squareSizes.push(0.25);
        var minP, maxP;
        if (typeof self.selectedFractal.getRangeInfo === 'function') {
            var rangeInfo = self.selectedFractal.getRangeInfo();
            minP = zoom.viewerCoordinatesToPixels(rangeInfo.minX, rangeInfo.minY);
            maxP = zoom.viewerCoordinatesToPixels(rangeInfo.maxX, rangeInfo.maxY);
        }
        squareSizes.forEach(function(squareSize) {
            var numSlices;
            if (squareSize >= 1) {
                numSlices = 1 << (maxSquareSize - squareSize); 
            }
            else {
                numSlices = (1 << (maxSquareSize - 1)) / squareSize;
            }
            if (isForDownloading === true) {
                numSlices *= 2; // The downloaded resolutions are likely to be much higher so the slices need to be smaller.
            }
            for (var x = 0; x < numSlices; x++) {
                for (var y = 0; y < numSlices; y++) {
                    var minX = x * w / numSlices;
                    var maxX = (x + 1) * w / numSlices;
                    var minY = y * h / numSlices;
                    var maxY =  (y + 1) * h / numSlices;
                    if (minP) {
                        minX = Math.max(minP.x, minX);
                        minY = Math.max(minP.y, minY);
                        maxX = Math.min(maxP.x, maxX);
                        maxY = Math.min(maxP.y, maxY);
                    }
                    if (minX < maxX && minY < maxY) {
                        renderingQueue.push({
                            'squareSize': squareSize,
                            'minX': minX,
                            'minY': minY,
                            'maxX': maxX,
                            'maxY': maxY
                        });
                    }
                }
            }
            if (minP) {
                renderingQueue.push({
                    'minX': minP.x,
                    'minY': minP.y,
                    'maxX': maxP.x,
                    'maxY': maxP.y
                });
            }
            lastResetQueueSize = renderingQueue.length;
        });
    };

    // process the queue of rendering tasks continuously so the page doesn't lock up so much.
    processRenderingChunk();
}
