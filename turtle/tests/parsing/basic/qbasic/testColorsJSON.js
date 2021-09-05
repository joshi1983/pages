import { Colour } from '../../../../modules/Colour.js';
import { fetchJson } from '../../../../modules/fetchJson.js';
await Colour.asyncInit();

const data = await fetchJson('json/logo-migrations/basic/qbasic/colors.json');

export function testColorsJSON(logger) {
	if (!(data.rules instanceof Array))
		logger(`rules must be an Array. Not ${data.rules}`);
	else {
		data.rules.forEach(function(ruleData, index) {
			if (!(ruleData.screenNumbers instanceof Array))
				logger(`Every rules element must have screenNumbers as an Array but found something else at index ${index}`);
			if (!(ruleData.colorMap instanceof Array))
				logger(`Every rules element colorMap must have colorMap as an Array but found something else at index ${index}`);
			else {
				ruleData.colorMap.forEach(function(colorPair, index) {
					if (colorPair.length !== 2)
						logger(`Every colorMap element must have length 2 but found length ${colorPair.length} at index ${index}`);
					else if (colorPair[0] !== index)
						logger(`Every colorPair should have first element equal the array index but array index ${index} does not equal first value ${colorPair[0]}`);
					else if (!Number.isInteger(colorPair[1]) || data.colors[colorPair[1]] === undefined)
						logger(`Invalid color index ${colorPair[1]}`);
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