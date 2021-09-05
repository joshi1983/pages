import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { StringBuffer } from '../../../StringBuffer.js';
const migrationInfo = await fetchJson('json/logo-migrations/SonicWebTurtle.json');
const procedureMap = new Map();
const prefix = migrationInfo.toProcPath + '/';
const toProcs = migrationInfo.commands.filter(c => c.toProc !== undefined).map(c => c.toProc);
for (const procName of toProcs) {
	procedureMap.set(procName, await fetchText(prefix + procName + '.lgo'));
}

function mightCallProcedure(code, procName) {
	if (code.indexOf(procName.toLowerCase()) === -1)
		return false;
	const commandFindRegex = new RegExp('(^|\\s)' + procName + '(\\s|$)', 'i');
	return commandFindRegex.test(code);
}

export function processPredefinedProcedures(webLogoCode) {
	let result = new StringBuffer();
	const lowerCaseVersion = webLogoCode.toLowerCase();
	for (const [name, content] of procedureMap) {
		if (mightCallProcedure(lowerCaseVersion, name)) {
			result.append('\n' + content + '\n');
		}
	}
	return result.toString() + webLogoCode;
};