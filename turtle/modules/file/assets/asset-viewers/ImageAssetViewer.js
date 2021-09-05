import { AbstractAssetViewer } from './AbstractAssetViewer.js';
import { bmpDataToImageDataUrl } from
'../../../assets/bmpDataToImageDataUrl.js';
import { isAvifReadSupported } from '../../../drawing-menu/download/avif/isAvifReadSupported.js';
import { pcxDataToImageDataUrl } from
'../../../assets/pcxDataToImageDataUrl.js';
import { ppmDataToImageDataUrl } from
'../../../assets/ppmDataToImageDataUrl.js';

const imageExtensions = new Set(['avif', 'bmp', 'gif',
'jfif', 'jpg', 'jpeg', 'pcx', 'png', 'ppm', 'svg', 'webp']);
isAvifReadSupported().then(function(bool) {
	if (bool === false) {
		// We don't want to depict the image as a broken link
		// if the browser can't render AVIF images.
		imageExtensions.remove('avif');
	}
});

export class ImageAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	_isBMP() {
		if (this.asset.filename.toLowerCase().endsWith('.bmp')) {
			return true;
		}
		return false;
	}

	_isPCX() {
		if (this.asset.filename.toLowerCase().endsWith('.pcx')) {
			return true;
		}
		return false;
	}

	_isPPM() {
		if (this.asset.filename.toLowerCase().endsWith('.ppm')) {
			return true;
		}
		return false;
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('image-asset-view');
			const img = document.createElement('img');
			let uri = this.asset.getBase64URI();
			if (this._isPCX()) {
				pcxDataToImageDataUrl(this.asset.data).then(function(uri) {
					img.setAttribute('src', uri);
				});
			}
			else if (this._isPPM()) {
				ppmDataToImageDataUrl(this.asset.data).then(function(uri) {
					img.setAttribute('src', uri);
				});
			}
			else if (this._isBMP()) {
				bmpDataToImageDataUrl(this.asset.data).then(function(uri) {
					img.setAttribute('src', uri);
				});
			}
			else
				img.setAttribute('src', uri);
			this.div.appendChild(img);
		}
		return this.div;
	}

	static matchesExtension(extension) {
		return imageExtensions.has(extension);
	}
};