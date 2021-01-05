class RealtimeRenderer {
	constructor() {
		this.isDrawPending = false;
		this.pixelStretch = 3;
		this.canvas = document.querySelector('#main-canvas');
	}

	// init should not be called more than once.
	init(benchmarker, draw, downloader, animation, displayMode, pixelSubsampling, refreshPixelStretchCentreAndScale) {
		if (pixelSubsampling === undefined)
			throw new Error('pixelSubsampling must be defined.');
		this._draw = draw;
		this._refreshPixelStretchCentreAndScale = refreshPixelStretchCentreAndScale;
		this.downloader = downloader;
		this.animation = animation;
		this.displayMode = displayMode;
		this.pixelSubsampling = pixelSubsampling;
		var outer = this;
		benchmarker.initScreenRefreshRate().then(function() {
			outer.redraw();
		});
		this.checkIfBusy();
	}

	_pixelStretchUpdated() {
		this.canvas.setAttribute('width', Math.ceil(this.canvas.clientWidth / this.pixelStretch));
		this.canvas.setAttribute('height', Math.ceil(this.canvas.clientHeight / this.pixelStretch));
		if (typeof this._refreshPixelStretchCentreAndScale === 'function')
			this._refreshPixelStretchCentreAndScale();
	}

	volumetricModeSelected() {
		// adjust the render settings accordingly.
		this.pixelStretch = Math.max(3, this.pixelStretch);
		this._pixelStretchUpdated();
		if (this.pixelSubsampling !== undefined)
			this.pixelSubsampling.useLowestQuality();
	}

	planeCutModeSelected() {
		this.pixelStretch = 1;
		this._pixelStretchUpdated();
	}

	redraw() {
		if (!this.isDrawPending) {
			this.isDrawPending = true;
			// don't actually draw unless the callback is initialized.
			if (typeof this._draw === 'function') {
				var outer = this;
				requestAnimationFrame(function() {
					outer.draw();
				});
			}
		}
	}
	
	canDraw() {
		return !this.downloader.isBusy() && !this.animation.isBusy();
	}

	checkIfBusy() {
		if (this.canDraw() && this.isDrawPending) {
			this.draw();
		}
	}

	draw() {
		if (!this.canDraw()) {
			return;
		}
		this._draw();
		this.isDrawPending = false;
	}
}