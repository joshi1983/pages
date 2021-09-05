import { isInCustomFunction } from
'../../parsing/parse-tree-analysis/isInCustomFunction.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

export function processForEach(token, result, options) {
	const inToken = token.children[2];
	const codeBlock = token.children[3];
	if (codeBlock === undefined)
		return;

	const rightChild = inToken.children[1];
	if (rightChild === undefined)
		return;

	const leftChild = inToken.children[0];
	if (leftChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	const makeCommand = isInCustomFunction(token) ? 'localmake' : 'make';
	const varName = options.identifierRenameMap.get(leftChild.val.toLowerCase());;
	result.append('\nrepeat count ');
	if (rightChild.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`:${options.identifierRenameMap.get(rightChild.val.toLowerCase())}`);
	else
		processToken(rightChild, result, options);
	result.append(' [\n');
	result.append(`${makeCommand} "${varName} item repcount `);
	processToken(rightChild, result, options);

	processTokens(codeBlock.children, result, options);

	result.append('\n]\n');
};