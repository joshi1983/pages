import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function processIfElse(ifToken, elseToken, result) {
	if (typeof ifToken !== 'object')
		throw new Error(`ifToken must be an object and more specifically a ParseTreeToken but got ${ifToken}`);
	if (typeof elseToken !== 'object')
		throw new Error(`elseToken must be an object and more specifically a ParseTreeToken but got ${elseToken}`);
	
	result.append('ifElse ');
	const ifConditionToken = ifToken.children[0];
	const ifCodeBlock = ifToken.children[1];
	if (ifConditionToken === undefined)
		result.append('true ');
	else
		processToken(ifConditionToken, result);
	if (ifCodeBlock === undefined)
		result.append('[\n]\n');
	else
		processToken(ifCodeBlock, result);
	const elseTokenCodeBlock = elseToken.children[0];
	if (elseTokenCodeBlock === undefined)
		result.append('[\n]\n');
	else
		processToken(elseTokenCodeBlock, result);
}

export function processIf(token, result) {
	const commandName = token.children.length <= 2 ? 'if' : 'ifElse';
	result.append(commandName + ' ');
	if (token.children.length !== 0) {
		let conditionToken = token.children[0];
		if (conditionToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
		conditionToken.children.length === 3)
			conditionToken = conditionToken.children[1];
		processToken(conditionToken, result);
	}
	else
		result.append('true');
	result.append(' ');
	if (token.children.length === 1) {
		result.append('[\n]\n');
	}
	else if (token.children.length > 1) {
		let codeBlock = token.children[1];
		processToken(codeBlock, result);
		if (token.children.length > 2) {
			const elseToken = token.children[2];
			codeBlock = elseToken.children[0];
			if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
				result.append('[\n');

			if (codeBlock.type === ParseTreeTokenType.IF &&
			token.children.length > 3)
				processIfElse(codeBlock, token.children[3], result);
			else
				processToken(codeBlock, result);
			
			if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
				result.append('\n]\n');
		}
	}
};