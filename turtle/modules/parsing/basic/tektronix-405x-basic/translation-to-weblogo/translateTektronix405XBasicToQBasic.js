import { fetchJson } from '../../../../fetchJson.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateOperators } from '../../helpers/translateOperators.js';
const migrationData = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBASIC.json');

export function translateTektronix405XBasicToQBasic(code) {
	const scanTokens = scan(code);
	processRemoveInMigration(scanTokens, migrationData);
	translateOperators(scanTokens, migrationData);
	const result = scanTokensToCode(scanTokens);
	return result;
};