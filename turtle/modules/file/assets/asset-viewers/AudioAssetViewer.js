import { AbstractAssetViewer } from './AbstractAssetViewer.js';

const audioExtensions = new Set(['mid', 'mp3', 'wav']);

export class AudioAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('audio-asset-view');
			const audio = document.createElement('audio');
			const source = document.createElement('source');
			audio.setAttribute('controls', '');
			source.setAttribute('src', this.asset.getBase64URI());
			source.setAttribute('type', this.asset.getMime());
			audio.appendChild(source);
			this.div.appendChild(audio);
		}
		return this.div;
	}

	static async matchesExtension(extension) {
		return audioExtensions.has(extension);
	}
};