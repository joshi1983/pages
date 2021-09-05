import { fetchBlob } from '../../../../../modules/fetchBlob.js';
import { getAssetFileName } from '../../../../../modules/components/syntax-highlighter/context-menu/convert-to-asset/getAssetFileName.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

const testPNGBlob = await fetchBlob('images/logo-32px.png');

export function testGetAssetFileName(logger) {
	const cases = [
		{'inArgs': ['https://www.google.com', testPNGBlob, []], 'out': 'google.png'},
		{'inArgs': ['https://www.google.com/bla.png', testPNGBlob, []], 'out': 'bla.png'},
		{'inArgs': ['https://www.google.com/bla.png', testPNGBlob, ['bla.png']], 'out': 'bla1.png'},
		{'inArgs': ['https://www.google.com/bla.png', testPNGBlob, ['bla.png', 'bla1.png']], 'out': 'bla2.png'}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.inArgs[2] = new Set(caseInfo.inArgs[2]);
	});
	cases.forEach(async function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = await getAssetFileName(...caseInfo.inArgs);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};