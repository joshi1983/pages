import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { ProcessingIdentifiers } from '../../ProcessingIdentifiers.js';
import { SetUtils } from '../../../../SetUtils.js';

export function getClashRiskyIdentifiersFromParseTree(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER);
	const result = new Set(['setup']);
	SetUtils.addAll(result, identifiers.map(t => t.val.toLowerCase()));
	SetUtils.addAll(result, ProcessingIdentifiers.getAllSpecialIdentifiers());
	return result;
};