import { getStringFromUrl } from '../../../../modules/command-groups/helpers/io/getStringFromUrl.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function stringToDataUrl(s) {
	return 'data:text/plain;base64,' + btoa(s);
}

export function testGetStringFromUrl(logger) {
	const cases = ['hi', 'Hi', 'hello', 'hello world'].map(function(text1) { 
		return {'in': stringToDataUrl(text1), 'out': text1}
	});
	cases.forEach(async function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = await getStringFromUrl(caseInfo.in);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};