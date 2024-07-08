import { AbstractAssetViewer } from './AbstractAssetViewer.js';
import { isAvifReadSupported } from '../../../drawing-menu/download/avif/isAvifReadSupported.js';

const imageExtensions = new Set(['avif', 'gif', 'jfif', 'jpg', 'jpeg', 'png', 'svg', 'webp']);
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

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('image-asset-view');
			const img = document.createElement('img');
			img.setAttribute('src', this.asset.getBase64URI());
			this.div.appendChild(img);
		}
		return this.div;
	}

	static async matchesExtension(extension) {
		return imageExtensions.has(extension);
	}
};