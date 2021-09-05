import { evaluateToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { getClashRiskyIdentifiersFromParseTree } from
'../../../parsing/parse-tree-analysis/getClashRiskyIdentifiersFromParseTree.js';
import { getTreeRoot } from
'../../../../generic-parsing-utilities/getTreeRoot.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { shouldSwitchValueBeStoredInVariable } from './shouldSwitchValueBeStoredInVariable.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

export function getSwitchValueName(switchToken) {
	const switchValueToken = switchToken.children[0];
	if (!shouldSwitchValueBeStoredInVariable(switchToken)) {
		if (switchValueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
		switchValueToken.children.length >= 2) {
			const valToken = switchValueToken.children[1];
			if (valToken.type === ParseTreeTokenType.IDENTIFIER)
				return ':' + valToken.val;
			else if (valToken.type === ParseTreeTokenType.STRING_LITERAL)
				return valueToLiteralCode(evaluateToken(valToken));
			else
				return valToken.val;
		}
	}
	const identifiersAtRisk = getClashRiskyIdentifiersFromParseTree(getTreeRoot(switchToken));
	const prefix = 'switchValue';
	if (!identifiersAtRisk.has(prefix.toLowerCase()))
		return ':' + prefix;

	for (let i = 1; true; i++) {
		const newName = prefix + i;
		if (!identifiersAtRisk.has(newName.toLowerCase()))
			return ':' + newName;
	}
};