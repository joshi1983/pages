import { getWebLogoSafeFunctionNameFrom } from
'../../../../modules/parsing/python-parsing/refactoring/getWebLogoSafeFunctionNameFrom.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function testForConflictingCommandNames(logger) {
	const cases = [
	{'in': 'p', 'out': 'p'},
	{'in': 'P', 'out': 'P'},
	{'in': 'fals', 'out': 'fals'},
	{'in': 'end', 'out': 'end2'}, // end is a keyword in WebLogo.
	{'in': 'true', 'out': 'true2'},
	{'in': 'tRue', 'out': 'tRue2'},
	{'in': 'false', 'out': 'false2'},
	{'in': 'pyCircle', 'out': 'pyCircle2'},
	// Avoid a procedure names from WebLogo code snippets used in translation.

	{'in': 'Fd', 'out': 'Fd2'},
	{'in': 'fd', 'out': 'fd2'},
	{'in': 'forward', 'out': 'forward2'},
	{'in': 'circle', 'out': 'circle3'} // circle2 is taken by a command.
	];
	testInOutPairs(cases, getWebLogoSafeFunctionNameFrom, logger);
}

function testCaseInsensitiveMatchees(logger) {
	const cases = [
	{'in': 'P', 'takenNames': ['p'], 'out': 'P2'},
	{'in': 'f_', 'takenNames': ['f_'], 'out': 'f_2'},
	{'in': 'F_', 'takenNames': ['F_'], 'out': 'F_2'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const takenNames = new Set(caseInfo.takenNames);
		const result = getWebLogoSafeFunctionNameFrom(caseInfo.in, takenNames);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
}

export function testGetWebLogoSafeFunctionNameFrom(logger) {
	testForConflictingCommandNames(prefixWrapper('testForConflictingCommandNames', logger));
};