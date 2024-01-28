import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isLocalVariablesDeclaration } from '../token-classifiers/isLocalVariablesDeclaration.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';
function getRootForDeclaration(varIdentifierToken) {
	return varIdentifierToken.parentNode.parentNode;
}

export function removeLocalVariablesDeclarations(jsCode) {
	if (typeof jsCode !== 'string')
		throw new Error(`removeLocalVariablesDeclarations expected jsCode to be a string but got ${jsCode}`);
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const declarations = allTokens.filter(isLocalVariablesDeclaration);
	if (declarations.length === 0)
		return jsCode; // nothing to remove
	declarations.forEach(function(declaration) {
		const root = getRootForDeclaration(declaration);
		root.remove();
	});
	return parseTreeTokensToCode(flatten(parseResult.root)).trim();
};