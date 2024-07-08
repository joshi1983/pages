import { AbstractAssetViewer } from './AbstractAssetViewer.js';

/*
AnimatedGifAssetViewer is for showing some basic information about 
animated GIF files such as frame count, width, and height.

This is incomplete and we're temporarily pausing work on this because testing revealed it
to make the assets feature unacceptably slow.
It took a few seconds to load the Asset Index with a 2MB animated GIF in it, for example.
Optimizing speed with caches could help but it will likely complicate the code base and 
take too much development time to be worth completing.
*/

const imageExtensions = new Set(['gif']);
export class AnimatedGifAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('animated-gif-asset-view');
			const img = document.createElement('img');
			const lengthElement = document.createElement('div');
			this.div.appendChild(lengthElement);
			// We use a separate img element with SuperGif to avoid having 
			// the element manipulated into a canvas.
			const imgTemp = document.createElement('img');
			imgTemp.onload = function() {
				const gif = new SuperGif({'gif': imgTemp});
				gif.load(function() {
					const span = document.createElement('span');
					span.innerText = 'Frame count: ' + gif.get_length() +
					', width: ' + imgTemp.width + ', height: ' + imgTemp.height;
					lengthElement.appendChild(span);
				});
			};
			const base64Url = this.asset.getBase64URI();
			imgTemp.setAttribute('src', base64Url);
			img.setAttribute('src', base64Url);
			this.div.appendChild(img);
		}
		return this.div;
	}

	static matchesExtension(extension, dataUrl) {
		return new Promise(function(resolve, reject) {
			if (!imageExtensions.has(extension))
				return false;
			if (typeof window.SuperGif !== 'function')
				return false;
			const img = document.createElement('img');
			img.onload = function() {
				const gif = new SuperGif({'gif': img});
				gif.load(function() {
					resolve(gif.get_length() !== 1);
				});
			};
			img.src = dataUrl;
			return true;
		});
	}
};