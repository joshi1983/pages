import { Colour } from
'../../../modules/Colour.js';
import { fetchJson } from
'../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

const data = await fetchJson('json/logo-migrations/kojo/colors.json');

export function testColorsJSON(logger) {
	if (!(data instanceof Array))
		logger(`Expected data to be an Array but found ${data}`);
	else {
		data.forEach(function(info, index) {
			if (typeof info !== 'object' || info === null)
				logger(`At index ${index}, an object is required but found ${info}`);
			else {
				const plogger = prefixWrapper(`Color ${index}, name=${info.name}`, logger);
				if (typeof info.name !== 'string')
					plogger(`name must be a string`);
				else if (index > 0) {
					const prev = data[index - 1];
					if (typeof prev === 'object' && prev !== null && typeof prev.name === 'string') {
						if (prev.name.localeCompare(info.name) >= 0)
							plogger(`colors.json is to be sorted alphabetically by name but found a pair out of order:  ${prev.name} and ${info.name}`);
					}
				}

				if (typeof info.hex !== 'string')
					plogger(`hex must be a string but found ${info.hex}`);
				else if (info.hex[0] !== '#')
					plogger(`hex must start with # but found ${info.hex}`);
				else if (info.hex.length !== 7)
					plogger(`hex length must be 7 but found ${info.hex} which has a length of ${info.hex.length}`);
				else if (!Colour.isValidHTMLColourCode(info.hex))
					plogger(`Invalid hex code: ${info.hex}`);
			}
		});
	}
};