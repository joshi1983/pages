import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getCommandNameFor(token) {
	if (token.children.some(t => 
	t.type === ParseTreeTokenType.ELSE ||
	t.type === ParseTreeTokenType.ELSEIF))
		return 'ifelse';
	else
		return 'if';
}

function getElseInstructionList(ifToken) {
	const children = ifToken.children;
	for (const child of children) {
		if (child.type === ParseTreeTokenType.ELSE)
			return child;
	}
}

export function processIf(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length > 2) {
		const condition = children[0];
		// children[1] should be "then" so we can skip that.
		const instructionList1 = children[2];
		const commandName = getCommandNameFor(token);
		result.append(' ' + commandName + ' ');
		processToken(condition, result, options);
		result.append(' ');
		processToken(instructionList1, result, options);
		if (commandName === 'ifelse') {
			const elseIfTokens = token.children.filter(t => t.type === ParseTreeTokenType.ELSEIF);
			if (elseIfTokens.length !== 0) {
				result.append(' [ ');
				for (const elseIf of elseIfTokens) {
					const eIChildren = elseIf.children;
					result.append(' if ');
					const conditionToken = eIChildren[0];
					const thenToken = eIChildren[1];
					if (thenToken !== undefined) {
						const codeBlock = thenToken.children[0];
						processToken(conditionToken, result, options);
						result.append(' ');
						processToken(codeBlock, result, options);
					}
				}
			}
			const elseInstructionList = getElseInstructionList(token);
			if (elseInstructionList !== undefined)
				processToken(elseInstructionList.children[0], result, options);
			result.append(' ]\n'.repeat(elseIfTokens.length));
		}
	}
};