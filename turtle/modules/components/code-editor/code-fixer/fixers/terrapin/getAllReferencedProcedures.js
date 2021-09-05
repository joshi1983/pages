import { fetchJson } from
'../../../../../fetchJson.js';
import { fetchText } from
'../../../../../fetchText.js';
import { getDescendentsOfTypes } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

const procsPrefix = 'logo-scripts/terrapin/';
const migrationData = await fetchJson('json/logo-migrations/TerrapinWebLogo.json');
const procsIndex = await fetchJson(procsPrefix + 'index.json');
const procsMap = new Map();
for (const procFileName of procsIndex) {
	const url = procsPrefix + '/' + procFileName;
	const procName = procFileName.substring(0, procFileName.length - 4);
	procsMap.set(procName.toLowerCase(), await fetchText(url));
}
const translationMap = new Map();
migrationData.commands.forEach(function(info) {
	if (info.toProc !== undefined) {
		translationMap.set(info.primaryName.toLowerCase(), info.toProc);
		if (info.names !== undefined) {
			for (const name of info.names) {
				translationMap.set(name.toLowerCase(), info.toProc);
			}
		}
	}
});

function isOfInterest(token) {
	const name = token.val.toLowerCase();
	return procsMap.has(name) || translationMap.has(name);
}

export function getAllReferencedProcedureNames(tree) {
	const toProcs = getDescendentsOfTypes(tree, [
		ParseTreeTokenType.LEAF, ParseTreeTokenType.PARAMETERIZED_GROUP
		]).
		filter(isOfInterest);
	const procsToAdd = new Set();
	toProcs.forEach(function(toProcToken) {
		const name = toProcToken.val.toLowerCase();
		if (translationMap.has(name))
			procsToAdd.add(translationMap.get(name));
		else
			procsToAdd.add(name);
	});
	const procsNameArray = Array.from(procsToAdd);
	procsNameArray.sort();
	return procsNameArray;
}

/*
@param tree should be a ParseTreeToken.
*/
export function getAllReferencedProcedures(tree) {
	const procsNameArray = getAllReferencedProcedureNames(tree);
	if (procsNameArray.length === 0)
		return '';

	return procsNameArray.map(name => procsMap.get(name)).join('\n\n') + '\n\n';
};