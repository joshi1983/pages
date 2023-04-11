import { AssetRepository } from '../../assets/AssetRepository.js';
import { fetchText } from '../../fetchText.js';

export async function getStringFromUrl(url) {
	if (url.startsWith('local://')) {
		const filename = url.substring('local://'.length);
		let resultEncoded = AssetRepository.getAssetByFilename(filename);
		if (resultEncoded === undefined)
			throw new Error(`Unable to find asset with name ${filename}`);
		return atob(resultEncoded.data);
	}
	else
		return await fetchText(url);
};