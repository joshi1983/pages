import { identifierToWebLogoIdentifier } from './helpers/identifierToWebLogoIdentifier.js';
import { processDefinitionArgList } from './function-definitions/processDefinitionArgList.js';
import { processToken } from './processToken.js';

export function processSub(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length < 3)
		return;
	const nameToken = children[0];
	const argList = children[1];
	const codeBlock = children[2];
	const name = identifierToWebLogoIdentifier(nameToken.val);
	result.append('to ' + name);
	processDefinitionArgList(argList, result, options);
	processToken(codeBlock, result, options);
	result.append('\nend\n');
};