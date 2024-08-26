import { AsyncCachedMap } from '../../../components/AsyncCachedMap.js';
import { fetchText } from '../../../fetchText.js';

const cachedFetchText = new AsyncCachedMap(fetchText, 10);

export async function getStringFromUrl(url) {
	if (url.startsWith('local://')) {
		return '';
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