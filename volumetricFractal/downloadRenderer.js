
class DownloadRenderer {
	constructor(gl, pid, mandelbrotDisplay, pixelSubsampling, sphereRadius, displayMode,
		scale, peakOpacity, circles, realtimeRenderer) {
		this.mainGL = gl;
		this.mainPID = pid;
		this.mandelbrotDisplay = mandelbrotDisplay;
		this.pixelSubsampling = pixelSubsampling;
		this.sphereRadius = sphereRadius;
		this.displayMode = displayMode;
		this.scale = scale;
		this.circles = circles;
		this.realtimeRenderer = realtimeRenderer;
		this.peakOpacity = peakOpacity;
		this.filename = 'cloud.png';
		this.downloadBar = document.getElementById('render-and-download-progress');
		this.progressBar = document.getElementById('download-progress-bar');
		this.downloadButton = document.getElementById('download-image');
		var outer = this;
		this.downloadButton.addEventListener('click', function() {
			outer.startDownload();
		});

		this.isRenderingOrDownloading = false;
		this.canvas2D = document.createElement('canvas');
		this.g = this.canvas2D.getContext('2d');
		this.canvasWebGL = document.createElement('canvas');
		this.gl = this.canvasWebGL.getContext('webgl', {
			'preserveDrawingBuffer': false
		});
		this.pid = this.gl.createProgram();
		loadShaders(this.gl, this.pid);
		initCoords(this.gl, this.pid);
		this.uniforms = this.getUniforms([
			'ambientFactor', 'centre', 'circleRadiusRange', 'cReal',
			'fractalIterationDelta', 'isShowingCircumference', 'displayMode',
			'lightDirection', 'lightObstructionDeltaRatio', 'opacityCutOff', 'peakSampleOpacity',
			'pixelSubsampling', 'planeCutValue', 'planeCutAxis',
			'position3D', 'scale', 
			'sphereRadius', 'sphereRadiusSquared',
			'sphereRadiusWithPlaneLineSquared',
			'viewRotation'
		]);
	}
	
	getUniforms(keys) {
		var result = {};
		var outer = this;
		keys.forEach(function(key) {
			result[key] = outer.gl.getUniformLocation(outer.pid, key);
		});
		return result;
	}
	
	_showDownloadProgress() {
		this.downloadBar.setAttribute('class', 'shown');
		this.downloadButton.disabled = true;
	}
	
	_hideDownloadProgress() {
		this.downloadBar.setAttribute('class', '');
		this.downloadButton.disabled = false;
	}
	
	_updateProgress() {
		this.progressBar.setAttribute('value', 100.0 * this.left / this.w);
	}
	
	_fillBlackBackground(g, w, h) {
		g.fillStyle = '#000';
		g.beginPath();
		g.rect(0, 0, w, h);
		g.closePath();
		g.fill();
	}
	
	download(filename) {
		this.filename = filename;
		var outer = this;
		var promise = new Promise(function(resolver, rejecter) {
			outer.downloadCompleteCallback = function() {
				outer.downloadCompleteCallback = undefined;
				outer.filename = 'cloud.png';
				resolver();
			};
			outer.startDownload();
		});
		return promise;
	}

	startDownload(downloadConfigOverrides) {
		if (this.isRenderingOrDownloading) {
			console.log('Can not download because we are already downloading.');
			return;
		}
		var defaultDownloadConfig = {
			'w': 1920,
			'h': 1080,
			'lightObstructionDeltaRatio': 0.01,
			'pixelSubsamplingQuality': this.pixelSubsampling.DEFAULT_QUALITY,
			'isBenchmarking': false
		};
		if (this.displayMode.isPlaneCut())
			defaultDownloadConfig.pixelSubsamplingQuality = 7;
		var config = defaultDownloadConfig;
		if (typeof downloadConfigOverrides === 'object') {
			Object.assign(config, downloadConfigOverrides);
		}
		if (!config.isBenchmarking)
			this._showDownloadProgress();
		this.isBenchmarking = config.isBenchmarking;
		this.w = config.w;
		this.h = config.h;
		this.isRenderingOrDownloading = true;
		this.canvas2D.setAttribute('width', this.w);
		this.canvas2D.setAttribute('height', this.h);
		var scaleValue = this.scale.getScaleFromDimensions(this.w, this.h);
		this.gl.uniform1f(this.uniforms.scale, scaleValue);
		var maxPixelRadius = this.circles.updateCircleRadiusRange(this.gl, this.w, this.h, scaleValue, this.uniforms.circleRadiusRange);
		this.gl.uniform1i(this.uniforms.pixelSubsampling, config.pixelSubsamplingQuality);
		this.gl.uniform2fv(this.uniforms.centre, [this.w / 2, this.h / 2]);
		this.gl.uniform1f(this.uniforms.scale, this.scale.getScaleFromDimensions(this.w, this.h));
		this.gl.uniform1f(this.uniforms.lightObstructionDeltaRatio, config.lightObstructionDeltaRatio);
		var peakSampleOpacity = this.peakOpacity.getPeakOpacityForLightObstructionDeltaRatio(config.lightObstructionDeltaRatio);
		this.gl.uniform1f(this.uniforms.peakSampleOpacity, peakSampleOpacity);
		this.gl.uniform1f(this.uniforms.opacityCutOff, this.peakOpacity.getOpacityCutOffFromPeakSampleOpacity(peakSampleOpacity));
		
		this.sphereRadius.updateUniforms(this.gl, this.w, this.h, this.uniforms.sphereRadiusSquared,
			this.uniforms.sphereRadiusWithPlaneLineSquared);
		var outer = this;
		['ambientFactor', 'cReal', 'fractalIterationDelta',
		'isShowingCircumference', 'displayMode',
		'lightDirection',
		'planeCutAxis', 'planeCutValue', 'sphereRadiusSquared',
		'sphereRadiusWithPlaneLineSquared', 'position3D', 'viewRotation'].forEach(function(key) {
			copyUniform(outer.mainGL, outer.gl, outer.mainPID, outer.pid, key);
		});
		this._fillBlackBackground(this.g, this.w, this.h);
		this.left = Math.floor(Math.max(0, this.w / 2 - maxPixelRadius));
		this.maxToRender = Math.ceil(Math.min(this.w, this.w / 2 + maxPixelRadius));
		this.intervalSize = 1;
		this.canvasWebGL.setAttribute('width', this.intervalSize);
		this.canvasWebGL.setAttribute('height', this.h);
		return new Promise(function(resolver, rejecter) {
			requestAnimationFrame(function() {
				outer.updateDrawing(resolver, rejecter);
			});
		});
	}

	updateDrawing(resolver, rejecter) {
		if (this.updateLoopStartTime === undefined) {
			this.updateLoopStartTime = new Date().getTime();
		}
		this.gl.uniform2fv(this.uniforms.centre, [this.w / 2 - this.left, this.h / 2]);
		drawGraphics(this.gl, this.intervalSize, this.h);
		var outer = this;
		console.log('updateDrawing called.  this.left = ' + this.left);
		setTimeout(function() {
			outer.g.drawImage(outer.canvasWebGL, outer.left, 0);
			if (outer.left + outer.intervalSize >= outer.maxToRender) {
				if (outer.mandelbrotDisplay.shouldBeVisible())
					outer.mandelbrotDisplay.drawAll(outer.canvas2D).then(function() {
						outer.downloadCanvas();
					});
				else
					outer.downloadCanvas();
				resolver();
			}
			else {
				outer.left += outer.intervalSize;
				var newTime = new Date().getTime();
				var maxLoopTime = 50;
				var renderTime = newTime - outer.updateLoopStartTime;
				if (renderTime > maxLoopTime) {
					if (renderTime > 200) {
						console.log('Rendering slice took ' + renderTime + 'ms.  May need to reduce slice size.');
					}
					outer._updateProgress();
					outer.updateLoopStartTime = undefined;
					requestAnimationFrame(function() {
						outer.updateDrawing(resolver, rejecter);
					});
				}
				else {
					// no delay.  continue immediately so the 
					// render completes faster.
					outer.updateDrawing(resolver, rejecter);
				}
			}
		}, 0);
	}
	
	downloadCanvas() {
		if (this.isBenchmarking) {
			this.isRenderingOrDownloading = false;
			this.realtimeRenderer.checkIfBusy();
			return;
		}
		var outer = this;
		this.canvas2D.toBlob(function(blob) {
			saveAs(blob, outer.filename);
			outer.isRenderingOrDownloading = false;
			outer._hideDownloadProgress();
			if (typeof outer.downloadCompleteCallback === 'function') {
				outer.downloadCompleteCallback();
			}
			outer.realtimeRenderer.checkIfBusy();
		}, 'image/png', 1.0);
	}

	isDownloading() {
		return this.isRenderingOrDownloading;
	}
}
