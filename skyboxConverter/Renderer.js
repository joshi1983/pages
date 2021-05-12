class Renderer {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.outputCanvas = document.getElementById('converted-image');
		this.inputImage = document.getElementById('input-image-preview');
		this.swapXY = document.getElementById('swap-x-y');
		var outer = this;
		this.swapXY.addEventListener('click', function() {
			outer.draw();
		});
	}

	setInputGetter(getter) {
		this.inputGetter = getter;
		this.draw();
	}

	setOutputGetter(getter) {
		this.outputGetter = getter;
		this.draw();
	}

	invalidateImageDataCache() {
		this.image_data = undefined;
	}

	_updateImageData() {
		var img = new Image();
		var url = this.inputImage.style.backgroundImage;
		url = url.substring(5, url.length - 2); // remove the preceding url("
		img.setAttribute('src', url);
		var outer = this;
		return new Promise(function(resolve, reject) {
			if (outer.image_data !== undefined && outer.dimensionsCache !== undefined)
				resolve(outer.dimensionsCache);
			else {
				img.onload = function() {
					var w = img.width, h = img.height;
					outer.canvas.setAttribute('width', w);
					outer.canvas.setAttribute('height', h);
					var g = outer.canvas.getContext('2d');
					g.drawImage(img, 0, 0);
					outer.image_data = g.getImageData(0, 0, w, h);
					outer.dimensionsCache = {
						'w': w,
						'h': h
					};
					resolve(outer.dimensionsCache);
				}
			}
		});
	}

	draw() {
		if (this.inputGetter === undefined || this.outputGetter === undefined)
			return;
		var outer = this;
		this._updateImageData().then(function(info) {
			if (typeof info !== 'object' || isNaN(info.w) || isNaN(info.h))
			{
				console.error('info: ' + JSON.stringify(info));
				return;
			}
			outer.outputCanvas.setAttribute('width', info.w);
			outer.outputCanvas.setAttribute('height', info.h);
			var g = outer.outputCanvas.getContext('2d');
			var myImageData = g.createImageData(info.w, info.h);
			var pixels = myImageData.data;
			var fromPixels = outer.image_data.data;
			var isSwappingXY = outer.swapXY.checked;
			// update data.
			for (var y = 0; y < info.h; y++) {
				for (var x = 0; x < info.w; x++) {
					var index = (x + y * info.w) << 2;
					var coords;
					if (isSwappingXY)
						coords = outer.outputGetter.getDirection(y / info.h, x / info.w);
					else
						coords = outer.outputGetter.getDirection(x / info.w, y / info.h);
					var isTransparent = false;
					if (typeof coords !== 'object')
						isTransparent = true;
					else
						coords = outer.inputGetter.get(coords.lng, coords.lat);
					if (typeof coords !== 'object')
						isTransparent = true;
					if (isTransparent) {
						pixels[index] = 0;
						pixels[index + 1] = 0;
						pixels[index + 2] = 0;
					}
					else {
						var px = Math.round(coords.x * info.w);
						var py = Math.round(coords.y * info.h);
						// get the colour from this.image_data.
						// copy value.
						var fromIndex = (px + py * info.w) << 2;
						pixels[index] = fromPixels[fromIndex];
						pixels[index + 1] = fromPixels[fromIndex + 1];
						pixels[index + 2] = fromPixels[fromIndex + 2];
					}
					pixels[index + 3] = 0xff;
				}
			}
			g.putImageData(myImageData, 0, 0);
		});
	}
}