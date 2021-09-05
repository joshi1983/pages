import { formatCode } from
'../../../../../../modules/components/code-editor/format/formatCode.js';
import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { processVariableReferences } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/processVariableReferences.js';
import { scanTokensToCode } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/scanTokensToCode.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedProcessVariableReferences(code) {
	const tokens = LogoScanner.scan(code);
	processVariableReferences(tokens);
	return formatCode(scanTokensToCode(tokens));
}

export function testProcessVariableReferences(logger) {
	const cases = [
		{'in': '$x=4', 'out': 'make "x 4'},
		{'in': 'to p\n$x=4\nend', 'out': 'to p\n\tlocalmake "x 4\nend'},
		{'in': 'to p\nend\n$x=4', 'out': 'to p\nend\n\nmake "x 4'},
		{'in': 'print $x=4', 'out': 'print :x = 4'},
		{'in': 'if $x=4', 'out': 'if :x = 4'},
	];
	testInOutPairs(cases, wrappedProcessVariableReferences, logger);
};