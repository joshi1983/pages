import { getStringFromUrl } from './helpers/getStringFromUrl.js';
import { plainDataToWebLogoDataStructure } from './helpers/plainDataToWebLogoDataStructure.js';

export class AsyncCommands {
	async readJson(url) {
		const resultString = await getStringFromUrl(url);
		return plainDataToWebLogoDataStructure(JSON.parse(resultString));
	}
};