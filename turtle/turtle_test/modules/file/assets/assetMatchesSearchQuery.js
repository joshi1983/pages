export function assetMatchesSearchQuery(query) {
	return function(asset) {
		if (asset.filename.indexOf(query) !== -1)
			return true;
		return false;
	};
};