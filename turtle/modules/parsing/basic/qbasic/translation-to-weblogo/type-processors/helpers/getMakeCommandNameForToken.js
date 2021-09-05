import { getContainingFunction } from
'../../../parsing/parse-tree-analysis/variable-data-types/getContainingFunction.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getMakeCommandNameForToken(token) {
	const funcToken = getContainingFunction(token);
	if (funcToken === null)
		return 'make';

	let varName;
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		varName = token.val.toLowerCase();
	else if (token.children.length === 0)
		throw new Error(`Unable to get variable name`); 
	else {
		const firstChild = token.children[0];
		if (typeof firstChild.val === 'string')
			varName = firstChild.val.toLowerCase();
		else
			throw new Error(`Unable to get variable name.  First child val is not a string.`);
	}
	const shareds = getDescendentsOfType(funcToken, ParseTreeTokenType.SHARED);
	for (const shared of shareds) {
		for (const child of shared.children) {
			if (child.type === ParseTreeTokenType.IDENTIFIER &&
			child.val.toLowerCase() === varName)
				return 'make';
		}
	}
	return 'localmake';
};