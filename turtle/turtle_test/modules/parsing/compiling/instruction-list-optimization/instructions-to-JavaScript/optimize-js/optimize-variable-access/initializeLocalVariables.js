import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isLocalVariablesToken } from '../token-classifiers/isLocalVariablesToken.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';

export function initializeLocalVariables(jsCode) {
	const parseResult = parse(jsCode);
	let allTokens = flatten(parseResult.root);
	allTokens.filter(isLocalVariablesToken).forEach(function(localVarToken) {
		// remove the "context.getCurrentExecutingProcedure().".
		const expressionDot = localVarToken.parentNode.parentNode;
		const expressionDotParent = expressionDot.parentNode;
		localVarToken.remove();
		expressionDotParent.replaceChild(expressionDot, localVarToken);
	});
	allTokens = flatten(parseResult.root);
	return 'const localVariables = context.getCurrentExecutingProcedure().localVariables;\n' +
	parseTreeTokensToCode(allTokens);
};