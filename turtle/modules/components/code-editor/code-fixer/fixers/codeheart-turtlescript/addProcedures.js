import { fetchJson } from '../../../../../fetchJson.js';
import { fetchText } from '../../../../../fetchText.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from '../../../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { StringBuffer } from '../../../../../StringBuffer.js';
const migrationInfo = await fetchJson('json/logo-migrations/CodeHeartTurtleScript.json');
const procsMap = new Map();
const toProcs = migrationInfo.commands.filter(t => t.toProc !== undefined).map(t => t.toProc);
for (const toProc of toProcs) {
	procsMap.set(toProc, await fetchText(migrationInfo.toProcPath + '/' + toProc + '.lgo'));
}

function isOfInterest(token) {
	return procsMap.has(token.val);
}

export function addProcedures(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (tree === undefined)
		return webLogoCode; // parsing failed so unable to add procedures.

	const potentialProcReferences = getDescendentsOfType(tree, ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (potentialProcReferences.length === 0)
		return webLogoCode;
	else {
		const procNameSet = new Set(potentialProcReferences.map(t => t.val));
		const procNames = Array.from(procNameSet);
		procNames.sort();
		const prefix = new StringBuffer();
		for (const name of procNames) {
			prefix.append(procsMap.get(name));
			prefix.append('\n\n');
		}
		return prefix.toString() + webLogoCode;
	}
};