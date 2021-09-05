import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { optimizeBooleanExpression } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeBooleanExpression.js';
import { parse } from
'../../../../../../modules/parsing/js-parsing/parse.js';
import { parseTreeTokensToCode } from
'../../../../../../modules/parsing/js-parsing/parseTreeTokensToCode.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testOptimizeBooleanExpression(logger) {
	const cases = [
		{'code': 'true', 'resultVal': 'true', 'out': 'true'},
		{'code': 'false', 'resultVal': 'false', 'out': 'false'},
		{'code': '3', 'resultVal': '3', 'out': '3'},
		{'code': '!!3', 'resultVal': '3', 'out': '3'},
		{'code': '!!!!3', 'resultVal': '3', 'out': '3'},
		{'code': '!context.math.not(x)', 'resultVal': 'x', 'out': 'x'},
		{'code': 'context.math.not(x)', 'resultVal': '!', 'out': '!x'},
		{'code': '!!context.math.not(x)', 'resultVal': '!', 'out': '!x'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const inputToken = parseResult.root.children[0];
		const resultToken = optimizeBooleanExpression(inputToken);
		resultToken.remove();
		resultToken.parentNode = null;
		const resultStr = parseTreeTokensToCode(flatten(resultToken)).trim();
		if (resultToken.val !== caseInfo.resultVal)
			plogger(`Expected resultToken.val of ${caseInfo.resultVal} but got ${resultToken.val}.`);
		if (resultStr !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${resultStr}.`);
	});
};