import { simplifyJavaScriptCode } from
'../../../../../modules/parsing/compiling/to-js/js-simplifiers/simplifyJavaScriptCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testSimplifyJavaScriptCode(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '// some comment', 'out': '// some comment'},
		{'in': '(3)', 'out': '3'},
		{'in': 'Math.round(3.2)', 'out': 'Math.round(3.2)'}
	];
	testInOutPairs(cases, simplifyJavaScriptCode, logger);
};