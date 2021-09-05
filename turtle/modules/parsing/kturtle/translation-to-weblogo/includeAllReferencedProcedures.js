import { KTurtleCommand } from '../KTurtleCommand.js';
import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const migrationData = await fetchJson('json/logo-migrations/KTurtle.json');
const toProcs = migrationData.commands.filter(c => c.toProc !== undefined).map(c => c.toProc);
const procsMap = new Map();
for (let i = 0; i < toProcs.length; i++) {
	const p = toProcs[i];
	const url = migrationData.toProcPath + `/${p}.lgo`;
	procsMap.set(p, await fetchText(url));
}

function isOfInterest(token) {
	const info = KTurtleCommand.getCommandInfo(token.val);
	return info !== undefined && info.toProc !== undefined;
}

export function includeAllReferencedProcedures(root, result) {
	const toProcs = getDescendentsOfType(root, ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	toProcs.forEach(function(toProcToken) {
		const info = KTurtleCommand.getCommandInfo(toProcToken.val);
		const toProcName = info.toProc;
		result.append(procsMap.get(toProcName));
		result.append('\n\n');
	});
};