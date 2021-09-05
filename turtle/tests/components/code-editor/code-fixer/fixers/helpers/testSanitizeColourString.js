import { sanitizeColourString } from '../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/sanitizeColourString.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testSanitizeColourString(logger) {
	const cases = [
		{'in': 'bla', 'out': 'bla'},
		{'in': 'red', 'out': 'red'},
		{'in': '"red', 'out': 'red'},
		{'in': '#123', 'out': '#123'},
		{'in': '####123', 'out': '#123'},
		{'in': '####1#2##3#', 'out': '#123'},
		{'in': '123', 'out': '#123'},
		{'in': '1234', 'out': '#1234'},
		{'in': '00FFf0', 'out': '#00FFf0'},
	];
	testInOutPairs(cases, sanitizeColourString, logger);
};