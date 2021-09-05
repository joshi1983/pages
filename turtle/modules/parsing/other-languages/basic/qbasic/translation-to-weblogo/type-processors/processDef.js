import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processDefinitionArgList } from
'./function-definitions/processDefinitionArgList.js';
import { processToken } from './processToken.js';

function shouldReplaceWithOutput(name, child) {
	if (child.type !== ParseTreeTokenType.ASSIGNMENT)
		return false;
	const children = child.children;
	if (children.length !== 2)
		return false;
	const left = children[0];
	if (left.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	name = name.toLowerCase();
	if (left.val.toLowerCase() !== name)
		return false;
	return true;
}

function processOutput(token, result, options) {
	result.append(' output ');
	const right = token.children[1];
	processToken(right, result, options);
	result.append(' ');
}

export function processDef(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length < 3)
		return;
	const nameToken = children[0];
	const argList = children[1];
	const codeBlock = children[2];
	const originalName = nameToken.val;
	const name = options.identifierRenameMap.get(originalName.toLowerCase());
	result.append('to ' + name);
	processDefinitionArgList(argList, result, options);
	for (const child of codeBlock.children) {
		if (shouldReplaceWithOutput(originalName, child))
			processOutput(child, result, options);
		else
			processToken(child, result, options);
	}
	result.append('\nend\n');
};