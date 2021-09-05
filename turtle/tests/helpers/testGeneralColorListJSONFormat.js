import { prefixWrapper } from './prefixWrapper.js';

export function testGeneralColorListJSONFormat(data, logger, isSortedByName) {
	if (typeof isSortedByName !== 'boolean')
		throw new Error(`isSortedByName must be a boolean but got ${isSortedByName}`);
	if (!(data instanceof Array))
		logger(`Expected an Array but got ${data}`);
	else {
		data.forEach(function(colorInfo, index) {
			const plogger = prefixWrapper(`Case ${index}`, logger);
			if (typeof colorInfo !== 'object' || colorInfo === null) {
				plogger(`Expected each element to be an object but found ${colorInfo}`);
				return;
			}
			if (typeof colorInfo.name !== 'string')
				plogger(`name expected to be a string but found ${colorInfo.name}`);
			if (typeof colorInfo.hex !== 'string')
				plogger(`hex expected to be a string but found ${colorInfo.hex}`);
			else if (!colorInfo.hex.startsWith('#'))
				plogger(`hex expected to start with # but found ${colorInfo.hex}`);
			else if (colorInfo.hex.length !== 7 && colorInfo.hex.length !== 9)
				plogger(`hex.length expected to be 7 or 9 but found ${colorInfo.hex.length}`);
			if (isSortedByName && index !== 0 && typeof colorInfo.name === 'string' &&
			typeof data[index - 1].name === 'string' &&
			colorInfo.name < data[index - 1].name)
				plogger(`Colors are expected to be sorted alphabetically by name but ${colorInfo.name} is out of order with ${data[index - 1].name}`);
		});
	}
};