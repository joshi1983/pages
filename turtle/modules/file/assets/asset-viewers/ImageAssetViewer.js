import { AbstractAssetViewer } from './AbstractAssetViewer.js';

const imageExtensions = new Set(['gif', 'jpg', 'jpeg', 'png', 'svg']);

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

	static matchesExtension(extension) {
		return imageExtensions.has(extension);
	}
};