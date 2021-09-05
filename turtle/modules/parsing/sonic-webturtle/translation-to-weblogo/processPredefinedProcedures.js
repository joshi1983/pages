import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { processProcedureCodeTemplate } from './processProcedureCodeTemplate.js';
import { processSettingsCodeTemplate } from './processSettingsCodeTemplate.js';
import { StringBuffer } from '../../../StringBuffer.js';
const migrationInfo = await fetchJson('json/logo-migrations/SonicWebTurtle.json');
const procedureMap = new Map();
const prefix = migrationInfo.toProcPath + '/';
const toProcs = migrationInfo.commands.filter(c => c.toProc !== undefined).map(c => c.toProc);
toProcs.push('webTurtleColor', 'webTurtleOffsetColor');
for (const procName of toProcs) {
	procedureMap.set(procName, processProcedureCodeTemplate(await fetchText(prefix + procName + '.lgo')));
}
export { procedureMap };

function mightCallProcedure(code, procName) {
	if (procName === 'webTurtleOffsetColor') {
		// The webTurtleColor procedure calls webTurtleOffsetColor.
		// If webTurtleColor is required, so is webTurtleOffsetColor.
		if (mightCallProcedure(code, 'webTurtleColor'))
			return true;
	}
	if (code.indexOf(procName.toLowerCase()) === -1)
		return false;
	const commandFindRegex = new RegExp('(^|\\s)' + procName + '(\\s|$)', 'i');
	return commandFindRegex.test(code);
}

export function processPredefinedProcedures(webLogoCode, settings) {
	let result = new StringBuffer();
	const lowerCaseVersion = webLogoCode.toLowerCase();
	for (const [name, content] of procedureMap) {
		if (mightCallProcedure(lowerCaseVersion, name)) {
			result.append('\n' + processSettingsCodeTemplate(content, settings) + '\n');
		}
	}
	return result.toString() + webLogoCode;
};