import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { sanitizeAssetFilename } from '../../../modules/file/assets/sanitizeAssetFilename.js';

export function testSanitizeAssetFilename(logger) {
	const cases = [
		{'in': 'hello.txt', 'out': 'hello.txt'},
		{'in': 'hello.txt ', 'out': 'hello.txt'},
		{'in': ' hello.txt ', 'out': 'hello.txt'},
	];
	cases.forEach(function(caseInfo, index) {
		const result = sanitizeAssetFilename(caseInfo.in);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (result !== caseInfo.out)
			plogger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};