/*
FIXME: check if this module is used.
Remove this module if it is not used by anything except tests.
This module was created to troubleshoot a problem where the width and height of the pages is different/larger in saved PDF files.
After this bug is fixed, remove this module if it continues to be unused.

*/
import { isNumber } from '../../../isNumber.js';
import { PageSize } from '../post-script/PageSize.js';

function sizeToKey(widthInches, heightInches) {
	return widthInches.toFixed(2) + '-' + heightInches.toFixed(2);
}
const jspdfFormats = new Set(['a3', 'a4', 'a5', 'letter', 'legal']);
const formats = {};
PageSize.getPageSizes().filter(s => jspdfFormats.has(s.name.toLowerCase()) || 
	(s.shortName !== undefined && jspdfFormats.has(s.shortName.toLowerCase()))).
	forEach(function(pageSize) {
		let name;
		if (pageSize.shortName !== undefined)
			name = pageSize.shortName;
		else
			name = pageSize.name;
		formats[sizeToKey(pageSize.getWidthInches(), pageSize.getHeightInches())] = name.toLowerCase();
	});

export function getJSPDFFormat(widthInches, heightInches) {
	if (!isNumber(widthInches))
		throw new Error('widthInches must be a number.  Not: ' + widthInches);
	if (!isNumber(heightInches))
		throw new Error('heightInches must be a number.  Not: ' + heightInches);
	const sizeKey = sizeToKey(widthInches, heightInches);
	if (formats[sizeKey] !== undefined)
		return formats[sizeKey];
};