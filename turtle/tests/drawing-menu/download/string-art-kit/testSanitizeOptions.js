import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { sanitizeOptions } from '../../../../modules/drawing-menu/download/string-art-kit/sanitizeOptions.js';

export function testSanitizeOptions(logger) {
	const cases = [
	{'in': undefined, 'out': {
		'lineHints': false
	}},
	{'in': {}, 'out': {
		'lineHints': false
	}},
	{
		'in': {'lineHints': true},
		'out': {'lineHints': true}
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = sanitizeOptions(caseInfo.in);
		if (!DeepEquality.equals(result, caseInfo.out))
			plogger(`Expected ${JSON.stringify(caseInfo.out)} but got ${JSON.stringify(result)}`);
	});
};