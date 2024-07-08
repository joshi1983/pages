import { AbstractAssetViewer } from './AbstractAssetViewer.js';
import { AnimatedGifAssetViewer } from './AnimatedGifAssetViewer.js';
import { AudioAssetViewer } from './AudioAssetViewer.js';
import { FileExtensions } from '../../../drawing-menu/download/FileExtensions.js';
import { ImageAssetViewer } from './ImageAssetViewer.js';
import { PlainTextAssetViewer } from './PlainTextAssetViewer.js';
import { VideoAssetViewer } from './VideoAssetViewer.js';

const viewerClasses = [
	AnimatedGifAssetViewer,
	AudioAssetViewer,
	ImageAssetViewer,
	PlainTextAssetViewer,
	VideoAssetViewer
];

export class GeneralAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	static async createAssetViewer(asset) {
		const extension = FileExtensions.getFileExtensionFromFilename(asset.filename);
		for (let i = 0; i < viewerClasses.length; i++) {
			const viewerClass = viewerClasses[i];
			if (await viewerClass.matchesExtension(extension, asset.getBase64URI()))
				return new viewerClass(asset);
		}
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('general-asset-view');
			const numberElement = document.createElement('span');
			numberElement.classList.add('number');
			const byteCount = this.asset.getDataSize();
			numberElement.innerText = byteCount;
			const dataSizeLabel = document.createElement('label');
			dataSizeLabel.innerText = 'Data size';
			const unitSpan = document.createElement('span');
			unitSpan.classList.add('unit');
			unitSpan.innerText = 'byte' + (byteCount === 1 ? '' : 's');
			// add s only for cases where plural sounds good.

			this.div.appendChild(dataSizeLabel);
			this.div.appendChild(numberElement);
			this.div.appendChild(unitSpan);
		}
		return this.div;
	}

	static async matchesExtension(extension) {
		return true;
	}
};

viewerClasses.push(GeneralAssetViewer);