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
		this.drawerReady(image, dataUrl);
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

	drawerReady(image, dataUrl) {
		if (this.downloadPromise === undefined) {
			const outer = this;
			this.downloadPromise = new Promise(function(resolve, reject) {
				if (image === undefined) {
					outer.image = document.createElement('img');
					outer._isTainted = false;
					outer.image.addEventListener('error', function(error) {
						// give up on CORS.
						outer.image.removeAttribute('crossOrigin');
						outer._isTainted = true;
						reject(`error found while downloading from ${dataUrl}: ` + error);
					});
					function tryDownload() {
						outer.image.setAttribute('src', dataUrl);
					}
					outer.image.addEventListener('load', function(event) {
						outer.eventDispatcher._dispatchEvent('load', {});
						resolve();
					}, false);
					outer.image.crossOrigin = "Anonymous";
					tryDownload();
				}
				else {
					outer.image = image;
					resolve();
				}
			});
		}
		return this.downloadPromise;
	}
};