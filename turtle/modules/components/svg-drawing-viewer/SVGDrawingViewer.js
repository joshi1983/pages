import { Camera } from '../../drawing/vector/Camera.js';
import { cleanBorderSize } from './cleanBorderSize.js';
import { dragTranslation } from '../../components/svg-drawing-viewer/dragTranslation.js';
import { isNumber } from '../../isNumber.js';
import { loadTransformFromCamera } from './loadTransformFromCamera.js';
import { mouseWheelZoom } from './mouseWheelZoom.js';
import { SVGTransformer } from './SVGTransformer.js';
import { SVGVector2DDrawer } from '../../drawing/drawers/SVGVector2DDrawer.js';
import { validateAspectRatio } from './validateAspectRatio.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';

let idCounter = 1;

export class SVGDrawingViewer {
	constructor(container, drawing, aspectRatio) {
		if (!(container instanceof Element))
			throw new Error('container must be an Element. Not: ' + container);
		if (typeof drawing !== 'object')
			throw new Error('drawing must be an object.  Not: ' + drawing);
		validateAspectRatio(aspectRatio);
		this.container = container;
		this.container.classList.add('svg-drawing-viewer');
		this.drawing = drawing;
		this.resizableContainer = document.createElement('div');
		this.container.appendChild(this.resizableContainer);
		this.aspectRatioMatting = document.createElement('div');
		this.aspectRatioMatting.classList.add('aspect-ratio-matting');
		this.container.appendChild(this.aspectRatioMatting);
		this._initializeSVG(aspectRatio);
	}

	_adjustScaleForNewDimensions(box, isRelativeToCurrentScale) {
		const initialScaleFactor = Math.max(0.000001, this._getNewScale(isRelativeToCurrentScale));
		this.transformer.setScale(initialScaleFactor);
	}

	_fitDrawingTightlyInAspectRatio() {
		const box = this._getPaddedBox();
		if (box.width > 0 && box.height > 0) {
			this._fitTightlyInBox(box);
		}
	}

	_fitTightlyInBox(box) {
		if (typeof box !== 'object' || !isNumber(box.width) || !isNumber(box.height))
			throw new Error(`box must be an object with width and height number properties.  not: ${box}`);
		const drawingBoundingBox = this.drawing.getBoundingBox();
		this.transformer.translateBy(new Vector2D(-drawingBoundingBox.getAverageX(), drawingBoundingBox.getAverageY()));
		this._adjustScaleForNewDimensions(box, false);
	}

	_getBorderSizes() {
		const box = this.container.getBoundingClientRect();
		let borderWidth = 0;
		let borderHeight = 0;
		if (this.aspectRatio !== undefined && box.width > 1 && box.height > 1) {
			const boxRatio = box.width / box.height;
			if (this.aspectRatio < boxRatio) {
				borderWidth = box.width - this.aspectRatio * box.height;
			}
			else {
				borderHeight = box.height - box.width / this.aspectRatio;
			}
			borderWidth = Math.ceil(borderWidth / 2);
			borderHeight = Math.ceil(borderHeight / 2);
		}
		return [borderWidth, borderHeight];
	}

	_getNewScale(isRelativeToCurrentScale) {
		if (typeof isRelativeToCurrentScale !== 'boolean')
			throw new Error(`isRelativeToCurrentScale must be boolean.  Not: ${isRelativeToCurrentScale}`);

		const box = this._getPaddedBox();
		if (isRelativeToCurrentScale === true) {
			const paddedBox = this._paddedBox === undefined ? this : this._paddedBox;
			const oldAverageDimensions = (paddedBox.width + paddedBox.height) / 2;
			const newAverageDimensions = (box.width + box.height) / 2;
			return this.transformer.scale * newAverageDimensions / oldAverageDimensions;
		}
		else {
			const drawingBoundingBox = this.drawing.getBoundingBox();
			const drawingWidth = drawingBoundingBox.max.getX() - drawingBoundingBox.min.getX();
			const drawingHeight = drawingBoundingBox.max.getY() - drawingBoundingBox.min.getY();
			return Math.min(box.height / drawingHeight, box.width / drawingWidth) * 0.95;
			// 0.95 to give thin margins around the drawing.
		}
	}

	_getPaddedBox() {
		const box = this.container.getBoundingClientRect();
		if (box.width < 1 || box.height < 1)
			return; // do nothing.

		const [borderWidth, borderHeight] = this._getBorderSizes();
		box.width -= borderWidth * 2;
		box.height -= borderHeight * 2;
		// return only the width and height because the other properties are not calculated properly.
		return {
			'width': box.width,
			'height': box.height
		};
	}

	_initializeSVG(aspectRatio) {
		validateAspectRatio(aspectRatio);
		this.width = 5;
		this.height = 5;
		const drawer = new SVGVector2DDrawer(this.width, this.height);
		this.drawing.drawAsSingleLayer(drawer);
		const gID = 'svg-viewer-g-' + (idCounter++);
		const text = drawer.toString({'gID': gID});
		this.resizableContainer.innerHTML = text;
		const g = this.container.querySelector('#' + gID);
		this.transformer = new SVGTransformer(g, this.width, this.height);
		mouseWheelZoom(this.container, this.transformer);
		const camera = new Camera();
		loadTransformFromCamera(camera, this.transformer, 1);
		dragTranslation(this.container, this.transformer);
		this.aspectRatio = aspectRatio;
		this.updateDimensions(true);
	}

	_updateAspectRatioDOM() {
		const [borderWidth, borderHeight] = this._getBorderSizes();
		this.aspectRatioMatting.style.borderLeftWidth = borderWidth + 'px';
		this.aspectRatioMatting.style.borderRightWidth = borderWidth + 'px';
		this.aspectRatioMatting.style.borderTopWidth = borderHeight + 'px';
		this.aspectRatioMatting.style.borderBottomWidth = borderHeight + 'px';
	}

	getAspectHeight() {
		const box = this.aspectRatioMatting.getBoundingClientRect();
		let borderHeight = this.aspectRatioMatting.style.borderTopWidth;
		borderHeight = cleanBorderSize(borderHeight);
		return Math.floor(box.width - borderHeight * 2);
	}

	getAspectWidth() {
		const box = this.aspectRatioMatting.getBoundingClientRect();
		let borderWidth = this.aspectRatioMatting.style.borderLeftWidth;
		borderWidth = cleanBorderSize(borderWidth);
		return Math.floor(box.width - borderWidth * 2);
	}

	getScaleForDimensions(width, height) {
		const drawingBoundingBox = this.drawing.getBoundingBox();
		const drawingWidth = drawingBoundingBox.max.getX() - drawingBoundingBox.min.getX();
		const drawingHeight = drawingBoundingBox.max.getY() - drawingBoundingBox.min.getY();
		return Math.min(height / drawingHeight, width / drawingWidth) * 0.95;
		// 0.95 to give thin margins around the drawing.
	}

	nudgeIn() {
		this.transformer.multiplyScaleBy(1.01);
	}

	nudgeOut() {
		this.transformer.multiplyScaleBy(1/1.01);
	}

	setAspectRatio(aspectRatio) {
		validateAspectRatio(aspectRatio);
		if (aspectRatio !== this.aspectRatio) {
			this.aspectRatio = aspectRatio;
			this._fitDrawingTightlyInAspectRatio();
			this._updateAspectRatioDOM();
		}
	}

	setDrawing(drawing, isMaintainingTransform) {
		const originalTransformer = this.transformer.clone();
		this.drawing = drawing;
		const drawer = new SVGVector2DDrawer(this.width, this.height);
		this.drawing.drawAsSingleLayer(drawer);
		const gID = 'svg-viewer-g-' + (idCounter++);
		const text = drawer.toString({'gID': gID});
		this.resizableContainer.innerHTML = text;
		const g = this.container.querySelector('#' + gID);
		if (isMaintainingTransform === true) {
			this.transformer.g = g;
			this.transformer._updateG();
		}
		else
			this.transformer = new SVGTransformer(g, this.width, this.height);
		mouseWheelZoom(this.container, this.transformer);
		dragTranslation(this.container, this.transformer);
		this.updateDimensions(true);
		if (isMaintainingTransform) {
			this.transformer.scale = originalTransformer.scale;
			this.transformer.translation = originalTransformer.translation;
			this.transformer._updateG();
		}
	}

	updateDimensions(isInitialCall) {
		const box = this.container.getBoundingClientRect();
		if (box.width === 0 || box.height === 0)
			throw new Error('invalid dimensions for container.  width=' + box.width + ', height=' + box.height);
		if (isInitialCall === true)
			this._fitDrawingTightlyInAspectRatio();
		else
			this._adjustScaleForNewDimensions(this._getPaddedBox(), true);
		this.transformer.setDimensions(box.width, box.height);
		const svg = this.container.querySelector('svg');
		svg.setAttribute('width', box.width);
		svg.setAttribute('height', box.height);
		this.width = box.width;
		this.height = box.height;
		this._updateAspectRatioDOM();
		this._paddedBox = this._getPaddedBox();
	}

	zoomIn() {
		this.transformer.multiplyScaleBy(1.1);
	}

	zoomOut() {
		this.transformer.multiplyScaleBy(1/1.1);
	}
};