import { Basic256Procedures } from
'../Basic256Procedures.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { StringBuffer } from
'../../../../StringBuffer.js';

export function getAllReferencedProcedures(tree) {
	const nameSet = new Set(getDescendentsOfType(tree, ParseTreeTokenType.LEAF).
		filter(t => Basic256Procedures.has(t.val)).map(t => t.val.toLowerCase()));
	const procNames = Array.from(nameSet);
	procNames.sort();
	let result = new StringBuffer();
	for (const name of procNames) {
		result.append(Basic256Procedures.get(name) + '\n');
	}
	return result.toString();
};