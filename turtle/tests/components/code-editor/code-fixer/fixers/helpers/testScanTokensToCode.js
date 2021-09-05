import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { scanTokensToCode } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/scanTokensToCode.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedScanTokensToCode(code) {
	const tokens = LogoScanner.scan(code);
	return scanTokensToCode(tokens);
}

export function testScanTokensToCode(logger) {
	const cases = [
		{'in': 'fd 100', 'out': 'fd 100'},
		{'in': 'print "hi', 'out': 'print "hi'},
		{'in': `repeat 2 [
print "hi
]`, 'out': `repeat 2 [ 
print "hi 
]`},
	];
	testInOutPairs(cases, wrappedScanTokensToCode, logger);
};