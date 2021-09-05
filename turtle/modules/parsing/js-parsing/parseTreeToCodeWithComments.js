import { ArrayUtils } from
'../../ArrayUtils.js';
import { getAllDescendentsAsArray } from
'../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { parseTreeTokensToCode } from
'./parseTreeTokensToCode.js';

export function parseTreeToCodeWithComments(root, comments) {
	if (typeof root !== 'object')
		throw new Error(`root must be an object but root=${root}`);
	if (root.parentNode !== null)
		throw new Error(`root must be a root node but root.parentNode=${root.parentNode}`);
	if (!(comments instanceof Array))
		throw new Error(`comments must be an Array but found ${comments}`);
	
	const allTokens = getAllDescendentsAsArray(root);
	ArrayUtils.pushAll(allTokens, comments);
	
	return parseTreeTokensToCode(allTokens);
};