import { Command } from
'../../../../Command.js';
import { fetchJson } from
'../../../../../fetchJson.js';
import { FixLogger } from
'../../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../../components/code-editor/format/formatCode.js';
import { ParseLogger } from
'../../../../loggers/ParseLogger.js';
import { processLogoMigration } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/processLogoMigration.js';
import { sanitizeMigrationInfo } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';
import { translateHTBasicToQBasic } from
'./translateHTBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { wrappedFix } from
'../../../../../components/code-editor/code-fixer/wrappedFix.js';

await Command.asyncInit();
const migrationData = await fetchJson('json/logo-migrations/basic/htbasic/migrationToWebLogo.json');
sanitizeMigrationInfo(migrationData);

function processLogoMigration_(cachedParseTree, fixLogger) {
	processLogoMigration(cachedParseTree, fixLogger, migrationData);
}

const fix = processLogoMigration_;

export function translateHTBasicToWebLogo(code) {
	const qbasicCode = translateHTBasicToQBasic(code);
	const webLogoCode = translateQBASICToWebLogo(qbasicCode);
	const proceduresMap = new Map();
	const fixLogger = new FixLogger(new ParseLogger());
	const fixedCode = wrappedFix(webLogoCode, fix, fixLogger, proceduresMap);
	return formatCode(fixedCode);
};