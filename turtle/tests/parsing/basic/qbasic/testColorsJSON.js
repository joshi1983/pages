import { Colour } from '../../../../modules/Colour.js';
import { fetchJson } from '../../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
await Colour.asyncInit();

const data = await fetchJson('json/logo-migrations/basic/qbasic/colors.json');

export function testColorsJSON(logger) {
	if (!(data.rules instanceof Array))
		logger(`rules must be an Array. Not ${data.rules}`);
	else {
		data.rules.forEach(function(ruleData, index) {
			const rlogger = prefixWrapper(`Rule ${index}`, logger);
			if (!(ruleData.screenNumbers instanceof Array))
				rlogger(`Every rules element must have screenNumbers as an Array but found ${ruleData.screenNumbers}`);
			if (!(ruleData.colorMap instanceof Array))
				rlogger(`Every rules element colorMap must have colorMap as an Array but found ${ruleData.colorMap}`);
			else {
				ruleData.colorMap.forEach(function(colorIndex, index) {
					if (!Number.isInteger(colorIndex) || colorIndex < 0)
						rlogger(`A positive integer color index is required but found ${colorIndex}`);
				});
			}
		});
	}
	if (!(data.colors instanceof Array))
		logger(`colors must be an Array. Not ${data.colors}`);
	else {
		data.colors.forEach(function(colorData, index) {
			if (colorData.index !== undefined && colorData.index !== index)
				logger(`If colors element specifies index, it should match the index in the Array but it does not.  Array index ${index} != index property ${colorData.index}`);
			if (typeof colorData.hex !== 'string')
				logger(`hex must be specified on every colors element but not found at index ${index}`);
			else if (colorData.hex[0] !== '#')
				logger(`hex must start with #.  Invalid hex: ${colorData.hex}`);
			else if (!Colour.isValidColourString(colorData.hex))
				logger(`Invalid hex colour: ${colorData.hex}`);
		});
	}
};