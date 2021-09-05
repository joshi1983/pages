import { AssetRepository } from '../../../assets/AssetRepository.js';
import { EventDispatcher } from '../../../EventDispatcher.js';
import { getProtocol } from '../../../parsing/parse-tree-analysis/string-formats/absoluteUrl.js';
import { LineSegmentShape } from './LineSegmentShape.js';
import { Shape } from './Shape.js';
import { ShapeStyle } from './style/ShapeStyle.js';

export class RasterRectangleShape extends Shape {
	constructor(position, width, height, rotationRadians, dataUrl, opacity, style, image) {
		super(position, style);
		this.eventDispatcher = new EventDispatcher(['load']);
		if (getProtocol(dataUrl) === 'local') {
			const asset = AssetRepository.getAssetByFilename(dataUrl.substring('local://'.length));
			if (asset !== undefined) {
				dataUrl = asset.getBase64URI();
			}
		}
		this.dataUrl = dataUrl;
		this.width = width;
		this.height = height;
		this.opacity = opacity;
		this.rotationRadians = rotationRadians;
		if (image === undefined) {
			this.image = document.createElement('img');
			this._isTainted = false;
			this.image.addEventListener('error', function() {
				// give up on CORS.
				outer.image.removeAttribute('crossOrigin');
				outer._isTainted = true;
			});
			const outer = this;
			function tryDownload() {
				outer.image.setAttribute('src', dataUrl);
			}
			this.image.addEventListener('load', function(event) {
				outer.eventDispatcher._dispatchEvent('load', {});
			}, false);
			this.image.crossOrigin = "Anonymous";
			tryDownload();
		}
		else
			this.image = image;
	}

	addEventListener(key, listener) {
		this.eventDispatcher.addEventListener(key, listener);
	}

	getBoundingBox() {
		const style = new ShapeStyle();
		style.setPenWidth(this.width);
		const lineSegment = new LineSegmentShape(this.position,
			this.position.getDisplacedByPolar(Math.PI * 0.5 - this.rotationRadians, this.height), style);
		return lineSegment.getBoundingBox();
	}

	isTainted() {
		return this._isTainted;
	}

	isVisible() {
		return this.width > 0 && this.height > 0 &&
			this.opacity !== 0;
	}

	transformBy(camera) {
		const result = new RasterRectangleShape(camera.transform(this.position),
			this.width * camera.getZoomScale(), this.height * camera.getZoomScale(),
			this.rotationRadians, this.dataUrl, this.opacity, this.style.transformBy(camera), this.image);
		result._isTainted = this._isTainted;
		return result;
	}
};