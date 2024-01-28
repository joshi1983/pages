import { Asset } from './Asset.js';

class PrivateAssetRepository {
	constructor() {
		this.assetsMap = new Map();
		this.loadFromLocalStorage();
	}

	add(asset) {
		if (!(asset instanceof Asset))
			throw new Error('asset must be an Asset.  Not: ' + asset);
		this.assetsMap.set(asset.filename, asset);
	}

	loadFromLocalStorage() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith(Asset.localStoragePrefix)) {
				const asset = Asset.createFromLocalStorageKey(key);
				this.assetsMap.set(asset.filename, asset);
			}
		}
	}

	getAllFileNames() {
		return new Set(this.assetsMap.keys());
	}

	getAssetByFilename(filename) {
		return this.assetsMap.get(filename);
	}

	getAssetsArray() {
		return Array.from(this.assetsMap.values());
	}

	getOrCreateAssetByFilename(filename) {
		if (typeof filename !== 'string')
			throw new Error('filename must be a string.  Not: ' + filename);
		let result = this.getAssetByFilename(filename);
		if (result === undefined) {
			result = new Asset(filename, '');
			result.saveToLocalStorage();
			this.assetsMap.set(filename, result);
		}
		return result;
	}

	remove(asset) {
		if (typeof asset.filename === 'string')
			asset = asset.filename;
		this.assetsMap.delete(asset);
	}
}

const AssetRepository = new PrivateAssetRepository();
export { AssetRepository };