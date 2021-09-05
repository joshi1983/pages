import { exceptionToString } from
'../../modules/exceptionToString.js';
import { fetchJson } from
'../../modules/fetchJson.js';
import { names } from
'../../modules/drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';
import { prefixWrapper } from
'../helpers/prefixWrapper.js';

function testDefinedNamesMatchDocumentedNames(data, logger) {
	if (names.length !== data.length)
		logger(`Expected ${names.length} blend modes but found ${data.length}`);
	const dataNames = new Set(data.filter(d =>
		typeof d === 'object' &&
		d !== null &&
		typeof d.name === 'string').map(d => d.name));
	for (const name of names) {
		if (!dataNames.has(name))
			logger(`Could not find blend mode with name ${name} in documentation`);
	}
	if (dataNames.size !== data.length)
		logger(`The number of distinct names(${dataNames.size}) should be the same as data.length(${data.length})`);
}

export async function testColourBlendModesJSON(logger) {
	try {
		const data = await fetchJson('json/blendModes.json');
		if (!(data instanceof Array))
			logger(`Expected an Array but found ${data}`);
		else {
			testDefinedNamesMatchDocumentedNames(data, prefixWrapper(`testDefinedNamesMatchDocumentedNames`, logger));
			data.forEach(function(blendInfo, index) {
				if (typeof blendInfo !== 'object' || blendInfo === null)
					logger(`At index ${index}, expected an object but found ${blendInfo}`);
				else {
					const plogger = prefixWrapper(`Element ${blendInfo}`, logger);
					if (typeof blendInfo.name !== 'string') {
						plogger(`Expected name to be a string but found ${blendInfo.name}`);
					}
					else if (index > 0) {
						const prev = data[index - 1];
						if (typeof prev === 'object' && prev !== null &&
						typeof prev.name === 'string') {
							if (prev.name.localeCompare(blendInfo.name) >= 0)
								plogger(`Blend modes are to be sorted by name but a pair is out of order.  ${prev.name} and ${blendInfo.name}`);
						}
					}
					if (typeof blendInfo.description !== 'string')
						plogger(`description must be a string but found ${blendInfo.description}`);
				}
			});
		}
	}
	catch (e) {
		console.error(e);
		logger(`Exception thrown. e=${exceptionToString(e)}`);
	}
};