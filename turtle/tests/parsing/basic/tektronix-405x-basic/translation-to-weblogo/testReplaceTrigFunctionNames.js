import { fetchJson } from
'../../../../../modules/fetchJson.js';
import { trigFunctions } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/translation-to-weblogo/replaceTrigFunctionNames.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

const migrationData = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json');

function checkTrigFunctionsAreInQBASICMigrationData(logger) {
	const fNameSet = new Set(migrationData.functions.map(f => f.name.toLowerCase()));
	for (const f of trigFunctions) {
		if (!fNameSet.has(f.toLowerCase()))
			logger(`Unable to find trigonometry function "${f}"`);
	}
}

export function testReplaceTrigFunctionNames(logger) {
	wrapAndCall([
		checkTrigFunctionsAreInQBASICMigrationData
	], logger);
};