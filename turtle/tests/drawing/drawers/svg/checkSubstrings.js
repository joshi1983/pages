import { escapeHTML } from '../../../helpers/escapeHTML.js';

export function checkSubstrings(substrings, svg, logger) {
	if (!(substrings instanceof Array))
		throw new Error(`substrings expected to be an Array but got ${substrings}`);
	if (typeof svg !== 'string')
		throw new Error(`svg expected to be a string but got ${svg}`);
	if (typeof logger !== 'function')
		throw new Error(`logger expected to be a function but got ${logger}`);
	for (let i = 0; i < substrings.length; i++) {
		const substring = substrings[i];
		if (svg.indexOf(substring) === -1)
			logger(`Unable to find the expected "${substring}" substring in "${escapeHTML(svg)}"`);
	}
};