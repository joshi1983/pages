import { isCompleteComment } from '../../../../modules/parsing/js-parsing/scanning/isCompleteComment.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteComment(logger) {
	const cases = [
		{'in': 'a', 'out': false},
		{'in': '~', 'out': false},
		{'in': '/4', 'out': false},
		{'in': '', 'out': false},
		{'in': '/', 'out': false},
		{'in': '//', 'out': false},
		{'in': '/*', 'out': false},
		{'in': '/*/', 'out': false},
		{'in': '//\n', 'out': true},
		{'in': '/**/', 'out': true},
	];
	testInOutPairs(cases, isCompleteComment, logger);
};