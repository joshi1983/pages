import { AssetRepository } from '../../../assets/AssetRepository.js';
import { AsyncCachedMap } from '../../../components/AsyncCachedMap.js';
import { fetchText } from '../../../fetchText.js';

const cachedFetchText = new AsyncCachedMap(fetchText, 10);

export async function getStringFromUrl(url) {
	if (url.startsWith('local://')) {
		const filename = url.substring('local://'.length);
		let resultEncoded = AssetRepository.getAssetByFilename(filename);
		if (resultEncoded === undefined)
			throw new Error(`Unable to find asset with name ${filename}`);
		return atob(resultEncoded.data);
	}
	else {
		// data URL's are fast enough to decode that we don't need them to occupy memory in cache.
		if (url.startsWith('data:'))
			return await fetchText(url);
		else {
			// remote HTTP and HTTPS URL's can be very slow so caching is important.
			return await cachedFetchText.get(url);
		}
	}
};