import { fetchJson } from '../../../../modules/fetchJson.js';
const resolutions = await fetchJson('json/resolutions.json');

export function testResolutionsJSON(logger) {
	resolutions.forEach(function(resolution, index) {
		if (typeof resolution.name !== 'string')
			logger('each resolution must have a name but one is missing at index ' + index);
		if (typeof resolution.width !== 'number')
			logger('width must be a number.  width invalid at index ' + index + ' and name ' + resolution.name);
		else if (resolution.width <= 0)
			logger('width must be over 0 but got ' + resolution.width);
		if (typeof resolution.height !== 'number')
			logger('height must be a number.  height invalid at index ' + index + ' and name ' + resolution.name);
		else if (resolution.height <= 0)
			logger('height must be over 0 but got ' + resolution.height);
	});
};