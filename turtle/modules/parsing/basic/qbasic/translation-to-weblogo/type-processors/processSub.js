import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processDefinitionArgList } from './function-definitions/processDefinitionArgList.js';
import { processToken } from './processToken.js';

export function processSub(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length < 3)
		return;
	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return; // weird case.  subroutine name is not the expected type of token
		// We want to return instead of throwing an exception.

	const argList = children[1];
	const codeBlock = children[2];
	const name = options.identifierRenameMap.get(nameToken.val.toLowerCase());
	result.append('to ' + name);
	processDefinitionArgList(argList, result, options);
	processToken(codeBlock, result, options);
	result.append('\nend\n');
};