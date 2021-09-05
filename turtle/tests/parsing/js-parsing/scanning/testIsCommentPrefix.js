import { isCommentPrefix } from '../../../../modules/parsing/js-parsing/scanning/isCommentPrefix.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCommentPrefix(logger) {
	const cases = [
		{'in': 'a', 'out': false},
		{'in': '~', 'out': false},
		{'in': '/4', 'out': false},
		{'in': '', 'out': true},
		{'in': '/', 'out': true},
		{'in': '//', 'out': true},
		{'in': '/*', 'out': true},
	];
	testInOutPairs(cases, isCommentPrefix, logger);
};