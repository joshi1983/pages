import { fetchJson } from '../../../../fetchJson.js';
import { fetchText } from '../../../../fetchText.js';
import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getGlobalVariableInitializationsFor } from './getGlobalVariableInitializationsFor.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { StringBuffer } from '../../../../StringBuffer.js';

const prefix = 'logo-scripts/processing-content/js-processing/';
const procFiles = await fetchJson(`${prefix}index.json`);
const procsMap = new Map();
for (const procFilename of procFiles) {
	const content = await fetchText(prefix + procFilename);
	const procName = procFilename.substring(0, procFilename.length - '.lgo'.length);
	procsMap.set(procName, content);
}

/*
root is a ParseTreeToken of a WebLogo parse tree.
*/
export function getAllReferencedProcedures(root) {
	const leafs = getDescendentsOfType(root, ParseTreeTokenType.LEAF).filter(t => procsMap.has(t.val));
	const procsToAddSet = new Set(leafs.map(leaf => leaf.val));
	const procsToAddArray = Array.from(procsToAddSet);
	procsToAddArray.sort();
	const result = new StringBuffer();
	for (const procToAdd of procsToAddArray) {
		result.append(procsMap.get(procToAdd));
		result.append('\n\n');
	}
	result.append(getGlobalVariableInitializationsFor(root, result.toString()));

	return result.toString();
};