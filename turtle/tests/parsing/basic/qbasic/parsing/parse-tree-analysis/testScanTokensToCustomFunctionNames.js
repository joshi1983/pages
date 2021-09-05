import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { scanTokensToCustomFunctionNames } from
'../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/scanTokensToCustomFunctionNames.js';

export function testScanTokensToCustomFunctionNames(logger) {
	const cases = [
		{'in': '', 'out': []},
		{'in': 'End Sub', 'out': []},
		{'in': 'print "hi"', 'out': []},
		{'in': 'sub s', 'out': ['s']},
		{'in': 'function s', 'out': ['s']},
		{'in': 'sub print', 'out': []}, 
		// weird code but we want to ensure an internal function/subroutine doesn't get added as a CUSTOM function.

		{'in': 'function print', 'out': []}, // similar to above.
		{'in': 'DECLARE SUB ADD', 'out': ['add']},
		{'in': 'SUB ADD (x, y)', 'out': ['add']},
		{'in': 'DEF fnTest', 'out': ['fntest']},
		{'in': 'DEFLNG A', 'out': []},
		{'in': 'GOSUB', 'out': []},
		{'in': 'GOSUB x', 'out': ['x']},
		{'in': 'GOSUB 100', 'out': []}, // the 100 won't be included because it is not a valid function name.
		// 100 is a valid label in QBasic and any label can mark the start of what is essentially a subroutine.
		// gosub is more like a goto statement, though.
		// gosub jumps into a section of code that can be globally scoped unlike the "sub" subroutines.

		{'in': `DECLARE SUB EndChat ()
DECLARE SUB Actions ()`, 'out': ['endchat', 'actions']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const tokens = scan(caseInfo.in);
		const names = scanTokensToCustomFunctionNames(tokens);
		if (!(names instanceof Set))
			plogger(`Expected a Set but found ${names}`);
		else {
			const namesStr = Array.from(names).join(',');
			if (names.size !== caseInfo.out.length)
				plogger(`Expected ${caseInfo.out.length} names but found ${names.size}.  The names are ${namesStr}`);
			else {
				for (const name of caseInfo.out) {
					if (!names.has(name)) {
						plogger(`Unable to find name ${name} in ${namesStr}`);
						break; // break to avoid unhelpful noise in the test report.
					}
				}
			}
		}
	});
};