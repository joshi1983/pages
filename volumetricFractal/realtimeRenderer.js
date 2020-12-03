class RealtimeRenderer {
	constructor() {
		this.isDrawPending = false;
	}

	// init should not be called more than once.
	init(benchmarker, draw, downloader, animation) {
		this._draw = draw;
		this.downloader = downloader;
		this.animation = animation;
		var outer = this;
		benchmarker.initScreenRefreshRate().then(function() {
			outer.redraw();
		});
		this.checkIfBusy();
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