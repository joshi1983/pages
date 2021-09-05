import { argListToParameterValueTokens } from
'../../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/function-calls/argListToParameterValueTokens.js';
import { getValueExpression } from './getValueExpression.js';
import { processToken } from '../processToken.js';

export function fillRect(token, result, settings) {
	const argList = token.children[1];
	if (argList === undefined)
		return;
	const valueTokens = argListToParameterValueTokens(argList);
	const xToken = valueTokens[0];
	const yToken = valueTokens[1];
	const widthToken = valueTokens[2];
	const heightToken = valueTokens[3];
	const widthExpression = getValueExpression('width', widthToken, result, settings);
	result.append('jumpTo [');
	processToken(xToken, result, settings);
	result.append(` + ${widthExpression} / 2 `);
	processToken(yToken, result, settings);
	result.append(']\nstripes ');
	result.append(`${widthExpression} `);
	result.append(' ');
	processToken(heightToken, result, settings);
	result.append(' [ fillColor ]\n');
};