import { AbstractAssetViewer } from './AbstractAssetViewer.js';

const videoExtensions = new Set(['avi', 'mp4']);

export class VideoAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('video-asset-view');
			const video = document.createElement('video');
			const source = document.createElement('source');
			video.setAttribute('controls', '');
			source.setAttribute('src', this.asset.getBase64URI());
			source.setAttribute('type', this.asset.getMime());
			video.appendChild(source);
			this.div.appendChild(video);
		}
		return this.div;
	}

	static async matchesExtension(extension) {
		return videoExtensions.has(extension);
	}
};