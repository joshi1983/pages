import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processTokens } from '../helpers/processTokens.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

function filterToValueTokens(argList) {
	return argList.children.filter(t => !ignoredTypes.has(t.type));
}

export function getToName(token) {
	const argList = token.children[1];
	const ch = filterToValueTokens(argList);
	let name;
	if (ch.length < 2)
		return; // indicate not of interest.
	if (ch.length === 2)
		name = 'qbCircleCoordsRadius';
	else if (ch.length === 3)
		name = 'qbCircleCoordsRadiusColor';
	else
		name = 'qbCircle5';
	return name;
};

export function circle(token, result, options) {
	const argList = token.children[1];
	const ch = filterToValueTokens(argList);
	const name = getToName(token);
	if (name === undefined)
		return; // do not translate.
	result.append('\n' + name + ' ');
	processTokens(ch, result, options);
};