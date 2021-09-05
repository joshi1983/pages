import { Camera } from '../../drawing/vector/Camera.js';
import { dragTranslation } from '../../components/svg-drawing-viewer/dragTranslation.js';
import { fetchText } from '../../fetchText.js';
import { loadTransformFromCamera } from './loadTransformFromCamera.js';
import { mouseWheelZoom } from './mouseWheelZoom.js';
import { SVGTransformer } from './SVGTransformer.js';
import { SVGVector2DDrawer } from '../../drawing/drawers/SVGVector2DDrawer.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';

let idCounter = 1;

function cleanBorderSize(s) {
	if (s === undefined)
		s = 0;
	else if (typeof s === 'string' && s.endsWith('px'))
		s = s.substring(0, s.length - 2);
	if (typeof s === 'string') {
		s = parseFloat(s);
		if (isNaN(s))
			console.error('border size expected to be a number but got NaN');
	}
	return s;
}

export class SVGDrawingViewer {
	constructor(container, drawing) {
		if (!(container instanceof Element))
			throw new Error('container must be an Element');
		if (typeof drawing !== 'object')
			throw new Error('drawing must be an object.  Not: ' + drawing);
		this.container = container;
		this.container.classList.add('svg-drawing-viewer');
		this.drawing = drawing;
		this.resizableContainer = document.createElement('div');
		this.container.appendChild(this.resizableContainer);
		this.aspectRatioMatting = document.createElement('div');
		this.aspectRatioMatting.classList.add('aspect-ratio-matting');
		this.container.appendChild(this.aspectRatioMatting);
		this._initializeSVG();
		this.setAspectRatio(undefined);
	}

	_getScaleForDimensions(width, height) {
		const drawingBoundingBox = this.drawing.getBoundingBox();
		const drawingWidth = drawingBoundingBox.max.getX() - drawingBoundingBox.min.getX();
		const drawingHeight = drawingBoundingBox.max.getY() - drawingBoundingBox.min.getY();
		return Math.min(height / drawingHeight, width / drawingWidth) * 0.95;
		// 0.95 to give thin margins around the drawing.
	}

	_initializeSVG() {
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
		this._updateDimensions();
	}

	_updateAspectRatio() {
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
		this.aspectRatioMatting.style.borderLeftWidth = borderWidth + 'px';
		this.aspectRatioMatting.style.borderRightWidth = borderWidth + 'px';
		this.aspectRatioMatting.style.borderTopWidth = borderHeight + 'px';
		this.aspectRatioMatting.style.borderBottomWidth = borderHeight + 'px';
	}

	_updateDimensions() {
		const box = this.container.getBoundingClientRect();
		if (box.width === 0 || box.height === 0)
			throw new Error('invalid dimensions for container.  width=' + box.width + ', height=' + box.height);
		const initialScaleFactor = Math.max(0.000001, this._getScaleForDimensions(box.width, box.height));
		const drawingBoundingBox = this.drawing.getBoundingBox();
		this.transformer.translateBy(new Vector2D(-drawingBoundingBox.getAverageX(), drawingBoundingBox.getAverageY()));
		this.transformer.setScale(initialScaleFactor);
		this.transformer.setDimensions(box.width, box.height);
		const svg = this.container.querySelector('svg');
		svg.setAttribute('width', box.width);
		svg.setAttribute('height', box.height);
		this._updateAspectRatio();
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

	getWidth() {
		const box = this.container.getBoundingClientRect();
		return Math.round(box.width);
	}

	setAspectRatio(ratio) {
		if (ratio !== undefined && typeof ratio !== 'number')
			throw new Error('ratio must be either undefined or a number');
		if (ratio !== this.aspectRatio) {
			this.aspectRatio = ratio;
			this._updateAspectRatio();
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
		this._updateDimensions();
		if (isMaintainingTransform) {
			this.transformer.scale = originalTransformer.scale;
			this.transformer.translation = originalTransformer.translation;
			this.transformer._updateG();
		}
	}

	zoomIn() {
		this.transformer.multiplyScaleBy(1.1);
	}

	zoomOut() {
		this.transformer.multiplyScaleBy(1/1.1);
	}
};