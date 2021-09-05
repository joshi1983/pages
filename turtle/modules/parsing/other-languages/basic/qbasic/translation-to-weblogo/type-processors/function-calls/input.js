import { getMakeCommandNameForToken } from
'../helpers/getMakeCommandNameForToken.js';
import { getRequiredTypesForVariableAtToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/getRequiredTypesForVariableAtToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const initializeWithIntTypes = new Set([
	'bool|int', 'bool|num', 'int', 'num'
]);

function shouldInitializeWithInt(requiredTypes) {
	if (requiredTypes === undefined)
		return true;
	if (requiredTypes.indexOf('string') !== -1)
		return false;

	return initializeWithIntTypes.has(requiredTypes);
}

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
			const webLogoName = options.identifierRenameMap.get(child.val.toLowerCase());
			const requiredTypes = getRequiredTypesForVariableAtToken(child.val, next);
			let initValueExpression;
			if (shouldInitializeWithInt(requiredTypes))
				initValueExpression = '1';
			else
				initValueExpression = '\'hi\'';
			result.append(` ${makeCommand} "${webLogoName} ${initValueExpression}\n`);
		}
	}
};