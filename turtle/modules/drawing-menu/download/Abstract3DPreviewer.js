import { PerspectiveTransformer } from '../../drawing/drawers/transformers/PerspectiveTransformer.js';

export class Abstract3DPreviewer {
	constructor(container) {
		this.root = container;
		this.canvas = document.createElement('canvas');
		this.perspectiveTransformer = new PerspectiveTransformer(100, 100);
	}

	multiplyScaleBy(scaleFactor) {
		this.perspectiveTransformer.multiplyScaleBy(scaleFactor);
		this.redrawNeeded();
	}

	nudgeIn() {
		this.perspectiveTransformer.multiplyScaleBy(1.01);
		this.redrawNeeded();
	}

	nudgeOut() {
		this.perspectiveTransformer.multiplyScaleBy(1/1.01);
		this.redrawNeeded();
	}

	redrawNeeded() {
		this._redrawNeeded = true;
		if (this._lastRedrawTime === undefined || (new Date).getTime() - this._lastRedrawTime > 30)
			this.redraw();
	}

	setRotatingMode(mode) {
		this.rotatingTransformer.setMode(mode);
	}

	updateDimensions() {
		this.redrawNeeded();
	}

	zoomIn() {
		this.perspectiveTransformer.multiplyScaleBy(1.1);
		this.redrawNeeded();
	}

	zoomOut() {
		this.perspectiveTransformer.multiplyScaleBy(1/1.1);
		this.redrawNeeded();
	}};