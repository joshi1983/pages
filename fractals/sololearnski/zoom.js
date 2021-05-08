
function Zoom() {
    var self = this;
    var offsetX;
    var offsetY;
    var width, height;
    var pixelWidth, pixelHeight;
    var scaleFactorChange = 0.2;
    
    self.getPixelSize = function() {
        return {
            "width": pixelWidth,
            "height": pixelHeight
        };
    };

    self.getAverageSize = function() {
        return (width + height) * 0.5;
    };
    
    self.resized = function() {
        var $canvas = $('canvas');
        pixelWidth = $canvas.width();
        pixelHeight = $canvas.height();

        var newAspectRatio = pixelWidth / pixelHeight;
        var area = width * height;

        // preserve the aspect ratio.        
        width = Math.sqrt(area * newAspectRatio);
        height = width / newAspectRatio;
    };
    
    self.setDimensionsForDownload = function(width, height) {
        var $canvas = $('canvas');
        $canvas.width(width).attr('width', width);
        $canvas.height(height).attr('height', height);
        self.resized();
    };

    self.reset = function() {
        self.resized();
        var newAspectRatio = pixelWidth / pixelHeight;
        var area = 4 * 4;
        width = Math.sqrt(area * newAspectRatio);
        height = width / newAspectRatio;

        offsetX = - width * 0.5;
        offsetY = - height * 0.5;
    };
    
    // Used for dragging the view around.
    self.translatePixelsBy = function(dx, dy) {
        offsetX -= dx * width / pixelWidth;
        offsetY -= dy * height / pixelHeight;
    };
    
    self.viewerCoordinatesToPixels = function (x, y) {
        return {
            'x': (x - offsetX) * pixelWidth / width,
            'y': (y - offsetY) * pixelHeight / height
        };
    };

    self.pixelsToViewerCoordinates = function(x, y) {
        return {
            'x': x / pixelWidth * width + offsetX,
            'y': y / pixelHeight * height + offsetY
        };
    }

    function getZoomInCoordinates(x, y) {
        var p = self.pixelsToViewerCoordinates(x, y);
        var result = {
            'width': width * scaleFactorChange,
            'height': height * scaleFactorChange
        };
        result.offsetX = p.x - result.width * 0.5;
        result.offsetY = p.y - result.height * 0.5;

        return result;
    }

    // Finds pixel coordinates that would be zoomed into if clicking at the specified x, y position.    
    self.getZoomInCoordinates = function(x, y) {
        var viewerCoordinateInfo = getZoomInCoordinates(x, y);
        var p = self.viewerCoordinatesToPixels(viewerCoordinateInfo.offsetX, viewerCoordinateInfo.offsetY);

        return {
            'width': viewerCoordinateInfo.width * pixelWidth / width,
            'height': viewerCoordinateInfo.height * pixelHeight / height,
            'offsetX': p.x,
            'offsetY': p.y
        };
    };

    self.zoomInto = function(x, y) {
        var newInfo = getZoomInCoordinates(x, y);
        offsetX = newInfo.offsetX;
        offsetY = newInfo.offsetY;
        width = newInfo.width;
        height = newInfo.height;
		console.log('zoomInto called. offsetX = ' + offsetX + ', offsetY = ' + offsetY + ', width = ' + width + ', height = ' + height);
    };
    
    self.zoomOut = function() {
        var middleX = offsetX + width * 0.5;
        var middleY = offsetY + height * 0.5;
        offsetX = middleX - (width / scaleFactorChange) * 0.5;
        offsetY = middleY - (height / scaleFactorChange) * 0.5;
        width /= scaleFactorChange;
        height /= scaleFactorChange;
    };

    self.reset();
    self.resized();
}
