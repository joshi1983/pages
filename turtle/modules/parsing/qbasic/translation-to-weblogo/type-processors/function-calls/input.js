import { getMakeCommandNameForToken } from
'../helpers/getMakeCommandNameForToken.js';
import { identifierToWebLogoIdentifier } from
'../helpers/identifierToWebLogoIdentifier.js';
import { getRequiredTypesForVariableAtToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/getRequiredTypesForVariableAtToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function input(token, result, options) {
	const argList = token.children[1];
	if (argList === undefined)
		return;
	const makeCommand = getMakeCommandNameForToken(token);
	const next = token.getNextSibling();
	if (next === null)
		return;
	for (const child of argList.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			const webLogoName = identifierToWebLogoIdentifier(child.val);
			const requiredTypes = getRequiredTypesForVariableAtToken(child.val, next);
			let initValueExpression;
			console.log(`requiredTypes = ${requiredTypes}`);
			if (requiredTypes === undefined || requiredTypes === 'num' || requiredTypes === 'int')
				initValueExpression = '1';
			else
				initValueExpression = '\'hi\'';
			result.append(` ${makeCommand} "${webLogoName} ${initValueExpression}\n`);
		}
	}
};