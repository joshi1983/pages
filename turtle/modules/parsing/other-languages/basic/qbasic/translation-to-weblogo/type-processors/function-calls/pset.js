import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processTokens } from '../helpers/processTokens.js';
import { processTupleLiteral } from '../processTupleLiteral.js';

export function getToName(token) {
	const argList = token.children[1];
	const ch = argList.children;
	let name;
	if (ch.length !== 0 &&
	ch[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
	ch[ch.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		name = 'pset1';
	else if (ch.length === 1)
		name = 'pset1';
	else
		name = 'psetCoordsColor';
	return name;
};

function isCallingStep(argList) {
	return argList.children.some(function(t) { 
		if (t.type !== ParseTreeTokenType.FUNCTION_CALL)
			return false;
		const firstChild = t.children[0];
		if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
		firstChild.val.toLowerCase() !== 'step')
			return false;
		return true;
	});
}

export function pset(token, result, options) {
	const argList = token.children[1];
	const ch = argList.children;
	const name = getToName(token);
	result.append('\n' + name + ' ');
	if (name === 'pset1' && !isCallingStep(argList))
		processTupleLiteral(argList, result, options);
	else
		processTokens(ch, result, options);
};