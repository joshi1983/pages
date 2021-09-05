import { getEndingMakeStatement } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getEndingMakeStatement.js';
import { MaybeDecided } from '../../../../../../../modules/MaybeDecided.js';
import { testInOutPairs } from '../../../../../../helpers/testInOutPairs.js';

export function testGetEndingMakeStatement(logger) {
	const cases = [
	{'inArgs': ['x', 'x', MaybeDecided.Yes, MaybeDecided.No, true], 'out': 'localVariables.set("x", x);'},
	{'inArgs': ['x', 'x2', MaybeDecided.Yes, MaybeDecided.No, true], 'out': 'localVariables.set("x2", x);'},
	{'inArgs': ['x', 'x2', MaybeDecided.Yes, MaybeDecided.No, false], 'out': 'context.localmake("x2", x);'},
	{'inArgs': ['x', 'x2', MaybeDecided.No, MaybeDecided.Yes, false], 'out': 'context.globalVariables.set("x2", x);'},
	{'inArgs': ['x', 'x2', MaybeDecided.No, MaybeDecided.Maybe, false], 'out': 'context.make("x2", x);'},
	];
	cases.forEach(function(caseInfo) {
		caseInfo.out = '\n' + caseInfo.out;
	});
	testInOutPairs(cases, getEndingMakeStatement, logger);
};