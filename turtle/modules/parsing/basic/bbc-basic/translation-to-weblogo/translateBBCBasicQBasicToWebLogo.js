import { fetchJson } from
'../../../../fetchJson.js';
import { genericLeafsToVariableReadsFixer } from
'../../../../components/code-editor/code-fixer/fixers/helpers/genericLeafsToVariableReadsFixer.js';
import { removeCommaInValuesFixer } from
'./removeCommaInValuesFixer.js';
import { renameCommandsFixer } from
'./renameCommandsFixer.js';
import { runAllFixers } from
'../../../../components/code-editor/code-fixer/runAllFixers.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

const bbcBasicToWebLogoMigrationData = await fetchJson('json/logo-migrations/basic/bbc-basic/BBC_Basic.json');
const excludedNames = new Set();
for (const info of bbcBasicToWebLogoMigrationData.commands) {
	if (info.applicableForQBasicFixer) {
		excludedNames.add(info.primaryName.toLowerCase());
	}
}
const fixer = runAllFixers([
	removeCommaInValuesFixer,
	genericLeafsToVariableReadsFixer(excludedNames),
	renameCommandsFixer(bbcBasicToWebLogoMigrationData)
]);

// bbcBasicQBasicCode should be mostly valid QBASIC code.
// It can include QB64 functions and some BBC Basic functions too, though.
// For example, bbcBasicQBasicCode may contain calls to BBC Basic's MOVE which is not in QBASIC.
export function translateBBCBasicQBasicToWebLogo(bbcBasicQBasicCode) {
	return translateQBASICToWebLogo(bbcBasicQBasicCode, undefined, fixer);
};