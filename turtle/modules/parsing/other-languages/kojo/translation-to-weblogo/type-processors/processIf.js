import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';

function isSimpleIf(token) {
	return !token.children.some(child =>
		child.type === ParseTreeTokenType.ELSE ||
		child.type === ParseTreeTokenType.ELSE_IF);
}

function isIfElseExpression(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.TREE_ROOT ||
	parent.type === ParseTreeTokenType.CODE_BLOCK)
		return false;
	const elseToken = token.children[2];
	return elseToken !== undefined &&
		elseToken.type === ParseTreeTokenType.ELSE;
}

export function processIf(token, result, settings) {
	const ifElseExpression = isIfElseExpression(token);
	let commandName = isSimpleIf(token) ? 'if' : 'ifelse';
	const children = token.children;
	const conditionToken = children[0];
	const codeBlock = children[1];
	if (conditionToken === undefined)
		return; // this is so invalid that there is no point in translating anything.

	if (!ifElseExpression)
		result.append('\n');
	result.append(` ${commandName} `);
	processToken(conditionToken, result, settings);
	if (!ifElseExpression)
		result.append(' [\n');

	if (codeBlock !== undefined)
		processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);

	if (!ifElseExpression)
		result.append('\n]\n');

	if (ifElseExpression) {
		const elseToken = token.children[2];
		const child = elseToken.children[0];
		if (child === undefined)
			result.append(' 0 ');
		else {
			processToken(child, result, settings);
			result.append(' ');
		}
	}
	else if (commandName === 'ifelse') {
		let bracketCount = 0;
		for (let i = 2; i < children.length; i++) {
			let child = children[i];
			
			if (child.type === ParseTreeTokenType.ELSE) {
				const codeBlock = child.children[0];
				result.append(' [\n');
				if (codeBlock !== undefined)
					processToken(codeBlock, result, settings);
				result.append('\n]\n');
			}
			else if (child.type === ParseTreeTokenType.ELSE_IF) {
				const grandchild = child.children[1];
				if (grandchild !== undefined) {
					const grandchildren = grandchild.children;
					const conditionToken = grandchildren[0];
					const codeBlock = grandchildren[1];
					if (conditionToken !== undefined) {
						commandName = i === children.length - 1 ? 'if' : 'ifelse';
						result.append(`\n[\n${commandName} `);
						processToken(conditionToken, result, settings);
						result.append(' [\n');
						if (codeBlock !== undefined)
							processToken(codeBlock, result, settings);				
						result.append('\n]\n');
						bracketCount++;
					}
				}
			}
		}
		result.append('\n]\n'.repeat(bracketCount));
	}
};