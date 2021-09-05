import { getUnsafeIdentifiers } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getUnsafeIdentifiers.js';
import { parse } from '../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetUnsafeIdentifiers(logger) {
	const cases = [
	{'code': '', 'out': []},
	{'code': 'let x = context.readVariable("x")', 'out': ['x']},
	{'code': 'let x = context.readVariable("x"), y = 3;', 'out': ['x', 'y']},
	{'code': 'context.turtle.right(180)', 'out': []},
	{'code': 'context.localmake("oldstate",context.turtle.turtleState())', 'out': []}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.out.push('context', 'this');
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const unsafe = getUnsafeIdentifiers(parseResult.root);
		if (!(unsafe instanceof Set))
			plogger(`Expected getUnsafeIdentifiers to return a Set but got ${unsafe}`);
		else {
			caseInfo.out.forEach(function(unsafeIdentifier) {
				if (!unsafe.has(unsafeIdentifier))
					plogger(`Expected ${unsafeIdentifier} to be found unsafe but it was not in the result`);
			});
			if (caseInfo.safe instanceof Array) {
				caseInfo.safe.forEach(function(safeIdentifier) {
					if (unsafe.has(safeIdentifier))
						plogger(`Expected ${safeIdentifier} to be considered safe but it was indicated as unsafe.`);
				});
			}
		}
	});
};