import { minusFixer } from '../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/minusFixer.js';
import { ParseLogger } from '../../../../../../modules/parsing/loggers/ParseLogger.js';
import { TestFixLogger } from '../../../../../helpers/TestFixLogger.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function wrappedMinusFixer(logger) {
	return function(code) {
		const parseLogger = new ParseLogger();
		const fixLogger = new TestFixLogger(parseLogger);
		const result = minusFixer(code, fixLogger);
		if ((result !== code) !== fixLogger.hasLogged)
			logger(`Expected logging a message of ${result !== code} but got ${fixLogger.hasLogged}.  input code=${code}`);
		return result;
	};
}

export function testMinusFixer(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': '2', 'changed': false},
		{'in': '-2', 'changed': false},
		{'in': 'print 2', 'changed': false},
		{'in': 'print -2', 'changed': false},
		{'in': 'print abs -2', 'changed': false},
		{'in': 'print :x + -2', 'changed': false},
		{'in': 'print :x-2', 'changed': false},
		{'in': 'print :x -2', 'out': 'print :x - 2', 'changed': true},
		{'in': 'print :x -2 fd 1', 'out': 'print :x - 2 fd 1', 'changed': true},
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.logged === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, wrappedMinusFixer(logger), logger);
};