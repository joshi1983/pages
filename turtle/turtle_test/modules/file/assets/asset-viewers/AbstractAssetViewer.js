import { Asset } from '../../../assets/Asset.js';

export class AbstractAssetViewer {
	constructor(asset) {
		if (!(asset instanceof Asset))
			throw new Error('asset must be an Asset but got: ' + asset);
		this.asset = asset;
	}

	getDiv() {
		throw new Error('getDiv not implemented yet in this subclass of AbstractAssetViewer');
	}
};