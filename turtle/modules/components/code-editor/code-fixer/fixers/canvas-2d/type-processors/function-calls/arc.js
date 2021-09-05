import { argListToParameterValueTokens } from
'../../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/function-calls/argListToParameterValueTokens.js';
import { evaluateLiteralToken } from
'../../../../../../../parsing/js-parsing/evaluators/evaluateLiteralToken.js';
import { getDistinctVariableNameDeclared } from './getDistinctVariableNameDeclared.js';
import { getValueExpression } from './getValueExpression.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

function shouldUseCircle(valueTokens) {
	const startAngleToken = valueTokens[3];
	const endAngleToken = valueTokens[4];
	const startAngleValue = evaluateLiteralToken(startAngleToken);
	if (startAngleValue === undefined)
		return false;
	const endAngleValue = evaluateLiteralToken(endAngleToken);
	if (endAngleValue === undefined)
		return false;
	return endAngleValue - startAngleValue > Math.PI * 2 - 0.00001;
}

export function arc(token, result, settings) {
	const argList = token.children[1];
	const valueTokens = argListToParameterValueTokens(argList);
	result.append('\njumpTo [');
	processToken(valueTokens[0], result, settings);
	result.append(' ');
	processToken(valueTokens[1], result, settings);
	result.append(']\n');
	if (shouldUseCircle(valueTokens)) {
		result.append('circle ');
	}
	else {
		let headingAngleValueExpression = getValueExpression('heading_', valueTokens[3], result, settings);
		const endAngleToken = valueTokens[4];
		result.append(`setHeading ${headingAngleValueExpression}\n`);
		result.append('arc ');
		processToken(endAngleToken, result, settings);
		result.append(`- ${headingAngleValueExpression} `);
	}
	const radiusToken = valueTokens[2];
	processToken(radiusToken, result, settings);
	result.append('\n');
};