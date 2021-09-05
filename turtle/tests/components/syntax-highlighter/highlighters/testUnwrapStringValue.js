import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { unwrapStringValue } from '../../../../modules/components/syntax-highlighter/highlighters/unwrapStringValue.js';

export function testUnwrapStringValue(logger) {
	const cases = [
		{'in': '"red', 'out': 'red'},
		{'in': "'red'", 'out': 'red'},
		{'in': '"blue', 'out': 'blue'},
		{'in': "'blue'", 'out': 'blue'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const result = unwrapStringValue(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};