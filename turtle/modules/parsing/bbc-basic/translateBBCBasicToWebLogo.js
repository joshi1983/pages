import { fetchJson } from
'../../fetchJson.js';
import { renameCommandsFixer } from
'./renameCommandsFixer.js';
import { translate } from
'../qbasic/translation-to-weblogo/translate.js';
import { translateBBCBasicToQBasic } from
'./translateBBCBasicToQBasic.js';
const bbcBasicToWebLogoMigrationData = await fetchJson('json/logo-migrations/bbc-basic/BBC_Basic.json');
const fixer = renameCommandsFixer(bbcBasicToWebLogoMigrationData);

export function translateBBCBasicToWebLogo(bbcBasicCode) {
	const qbasicCode = translateBBCBasicToQBasic(bbcBasicCode);
	return translate(qbasicCode, fixer);
};