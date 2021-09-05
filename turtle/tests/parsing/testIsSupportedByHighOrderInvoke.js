import { isSupportedByHighOrderInvoke } from '../../modules/parsing/isSupportedByHighOrderInvoke.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testIsSupportedByHighOrderInvoke(logger) {
	const cases = [
	{'in': 'to', 'out': false},
	{'in': 'if', 'out': false},
	{'in': 'ifelse', 'out': false},
	{'in': 'for', 'out': false},
	{'in': 'while', 'out': false},
	{'in': 'repeat', 'out': false},
	{'in': 'repcount', 'out': false},
	{'in': 'until', 'out': false},
	{'in': 'print', 'out': false},
	{'in': 'sum', 'out': true},
	{'in': 'minus', 'out': true},
	{'in': 'power', 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const result = isSupportedByHighOrderInvoke(caseInfo.in);
		const plogger = prefixWrapper(`Case ${index}, primayName: ${caseInfo.in}`, logger);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};