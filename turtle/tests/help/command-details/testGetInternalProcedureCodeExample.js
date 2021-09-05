import { getInternalProcedureCodeExample } from
'../../../modules/help/command-details/getInternalProcedureCodeExample.js';

export function testGetInternalProcedureCodeExample(logger) {
	const html = getInternalProcedureCodeExample('map');
	if (typeof html !== 'string')
		logger(`html expected to be a string but found ${html}`);
	else {
		const substrings = ['<code>', ';', 'to map', 'end', '</code>'];
		for (const substring of substrings) {
			if (html.indexOf(substring) === -1)
				logger(`Expected to find "${substring}" but did not in html: ${html}`);
		}
	}
};