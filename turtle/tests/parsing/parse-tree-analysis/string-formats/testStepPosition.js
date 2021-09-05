import { stepPosition } from '../../../../modules/parsing/parse-tree-analysis/string-formats/stepPosition.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testStepPosition(logger) {
	const cases = [
		{'in': 'jumps', 'valid': false},
		{'in': 'jumpEnd', 'valid': true},
		{'in': 'jumpstart', 'valid': true},
		{'in': 'jumpboth', 'valid': true}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = stepPosition(caseInfo.in);
		if ((typeof result === 'string') === caseInfo.valid)
			plogger(`Expected valid? ${caseInfo.valid} but got validation message of "${result}"`);
	});
};