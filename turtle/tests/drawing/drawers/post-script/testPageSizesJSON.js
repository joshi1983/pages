import { fetchJson } from '../../../../modules/fetchJson.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
const url = 'json/pageSizes.json';
const pageSizes = await fetchJson(url);

export function testPageSizesJSON(logger) {
	if (pageSizes instanceof Array) {
		let defaultCount = 0;
		pageSizes.forEach(function(pageSize, index) {
			const plogger = prefixWrapper('Checked page size at index ' + index, logger);
			if (typeof pageSize === 'object') {
				if (typeof pageSize.name !== 'string')
					plogger('Expected name but got: ' + pageSize.name);
				if (typeof pageSize.dimensionsInch !== 'object')
					plogger('dimensionsInch expected to be an object but got: ' + pageSize.dimensionsInch);
				else {
					const dimensions = pageSize.dimensionsInch;
					if (typeof dimensions.width !== 'number')
						plogger(`width expected to be a number but got ${dimensions.width}`);
					if (typeof dimensions.height !== 'number')
						plogger(`height expected to be a number but got ${dimensions.height}`);
				}
				if (pageSize.isDefault !== undefined && typeof pageSize.isDefault !== 'boolean')
					plogger('isDefault must either be undefined or a boolean but got ' + pageSize.isDefault);
				else if (pageSize.isDefault === true)
					defaultCount++;
				if (pageSize.shortName !== undefined) {
					if (typeof pageSize.shortName !== 'string')
						plogger('shortName must either not be defined or be a string but got: ' + pageSize.shortName);
					else if (typeof pageSize.name === 'string' && pageSize.shortName.length > pageSize.name)
						plogger(`shortName must be shorter or equal to length of name but got shortName length ${pageSize.shortName.length} and name length ${pageSize.name.length}`);
				}
			}
			else
				logger(`Every element in ${url} expected to be an object`);
		});
		if (defaultCount !== 1)
			logger('Exactly 1 page size expected to have isDefault=true but found ' + defaultCount);
	}
	else
		logger(`${url} expected to define an Array but got: ${pageSizes}`);
};