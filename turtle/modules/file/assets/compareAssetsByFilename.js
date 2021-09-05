export function compareAssetsByFilename(asset1, asset2) {
	return asset1.filename.localeCompare(asset2.filename);
};