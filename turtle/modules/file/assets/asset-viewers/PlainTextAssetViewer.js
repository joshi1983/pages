import { AbstractAssetViewer } from './AbstractAssetViewer.js';
const textExtensions = new Set([
'css','htm', 'html', 'ini', 'js', 'json', 'lgo',
'rss', 'txt', 'xml', 'xsl', 'xslt']);

export class PlainTextAssetViewer extends AbstractAssetViewer {
	constructor(asset) {
		super(asset);
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('text-asset-view');
			const pre = document.createElement('pre');
			pre.innerText = this.asset.getDataAsString().trim();
			this.div.appendChild(pre);
		}
		return this.div;
	}

	static async matchesExtension(extension) {
		return textExtensions.has(extension);
	}
};