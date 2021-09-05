import { lineCap } from '../../../../modules/parsing/parse-tree-analysis/string-formats/lineCap.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testLineCap(logger) {
	const cases = [
		{'in': 'round', 'valid': true},
		{'in': 'square', 'valid': true},
		{'in': 'butt', 'valid': true},
		{'in': 'rnd', 'valid': false}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = lineCap(caseInfo.in);
		if ((typeof result === 'string') === caseInfo.valid)
			plogger(`Expected valid? ${caseInfo.valid} but got validation message of "${result}"`);
	});
};