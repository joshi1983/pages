import { fetchJson } from '../../../../modules/fetchJson.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

const data = await fetchJson('json/logo-migrations/l-systems/0L/command-symbols.json');

export function testCommandSymbolsJSON(logger) {
	if (typeof data !== 'object' || data === null)
		logger(`Expected data to be an object but found ${data}`);
	else {
		for (const key in data) {
			const plogger = prefixWrapper(`Key ${key}`, logger);
			const info = data[key];
			if (typeof info !== 'object' || info === null)
				plogger(`Expected value to be an object but found ${info}`);
			else {
				if (typeof info.to !== 'string')
					plogger(`Expected to to be a string, some WebLogo code, but found ${info.to}`);
			}
		}
	}
};