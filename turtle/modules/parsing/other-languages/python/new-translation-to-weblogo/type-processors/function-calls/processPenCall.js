import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const nameWebLogoCommandMap = new Map([
	['fillcolor', 'setFillColor'],
	['pencolor', 'setPenColor'],
	['pensize', 'setPenSize'],
]);

function handlePenDown(token, result, cachedParseTree) {
	const penDownVal = cachedParseTree.getTokenValues().get(token);
	if (penDownVal === true)
		result.append(`penDown\n`);
	else if (penDownVal === false)
		result.append(`penUp\n`);
}

function handleShown(token, result, cachedParseTree) {
	const shownVal = cachedParseTree.getTokenValues().get(token);
	if (shownVal === true)
		result.append(`showTurtle\n`);
	else if (shownVal === false)
		result.append(`hideTurtle\n`);
}

const nameHandleFunctionMap = new Map([
	['pendown', handlePenDown],
	['shown', handleShown]
]);

/*
This is for the lower case 'pen' call.  Not Pen.
Pen is a Python class and pen is a method.
*/
export function processPenCall(token, result, cachedParseTree, settings) {
	const argList = token.children[0];
	if (argList === undefined)
		return;

	const parameterTokens = filterBracketsAndCommas(argList.children);
	for (let i = 0; i < parameterTokens.length; i++) {
		const t = parameterTokens[i];
		if (t.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			const webLogoCommandName = nameWebLogoCommandMap.get(t.children[0].val);
			if (webLogoCommandName !== undefined) {
				result.append(`${webLogoCommandName} `);
				processToken(t.children[1], result, cachedParseTree, settings);
				result.append('\n');
			}
			else {
				const handleFunc = nameHandleFunctionMap.get(t.children[0].val);
				if (handleFunc !== undefined)
					handleFunc(t.children[1], result, cachedParseTree, settings);
			}
		}
	}
};