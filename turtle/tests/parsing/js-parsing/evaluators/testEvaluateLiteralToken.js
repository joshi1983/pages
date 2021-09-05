import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateLiteralToken } from '../../../../modules/parsing/js-parsing/evaluators/evaluateLiteralToken.js';
import { parse } from '../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testEvaluateLiteralToken(logger) {
	const cases = [
		{'code': 'null', 'out': null},
		{'code': 'undefined', 'out': undefined},
		{'code': '2', 'out': 2},
		{'code': '"hi"', 'out': "hi"},
		{'code': '[]', 'out': []},
		{'code': '[1, 2]', 'out': [1, 2]},
		{'code': '1+2', 'out': 3},
		{'code': '-(2)', 'out': -2},
		{'code': '-(2+4)', 'out': -6},
		{'code': '[null, true, "hello"]', 'out': [null, true, "hello"]},
		{'code': 'true', 'out': true},
		{'code': 'false', 'out': false},
		{'code': 'new Map()', 'out': new Map()},
		{'code': 'new Map([])', 'out': new Map()},
		{'code': 'new Map([[1, 2]])', 'out': new Map([[1, 2]])},
		{'code': 'new Set()', 'out': new Set()},
		{'code': 'new Set([])', 'out': new Set()},
		{'code': 'new Set([1,2,3])', 'out': new Set([1,2,3])}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		if (parseResult.root.children.length !== 1)
			plogger(`Expected exactly 1 child but found ${parseResult.root.children.length}`);
		else {
			const onlyChild = parseResult.root.children[0];
			const result = evaluateLiteralToken(onlyChild);
			if (!DeepEquality.equals(result, caseInfo.out))
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};