import { BBCBasicInternalFunctions } from '../BBCBasicInternalFunctions.js';
import { genericLeafsToVariableReadsFixer } from
'../../../../components/code-editor/code-fixer/fixers/helpers/genericLeafsToVariableReadsFixer.js';
import { ParseTreeTokenType } from
'../../qbasic/ParseTreeTokenType.js';
import { removeCommaInValuesFixer } from
'./removeCommaInValuesFixer.js';
import { renameCommandsFixer } from
'./renameCommandsFixer.js';
import { runAllFixers } from
'../../../../components/code-editor/code-fixer/runAllFixers.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

const excludedNames = new Set();
for (const info of BBCBasicInternalFunctions.getAllFunctionsInfo()) {
	if (info.applicableForQBasicFixer) {
		excludedNames.add(info.primaryName.toLowerCase());
	}
}
const fixer = runAllFixers([
	removeCommaInValuesFixer,
	genericLeafsToVariableReadsFixer(excludedNames),
	renameCommandsFixer(BBCBasicInternalFunctions.getFullMigrationData())
]);

function skipStringArgumentChecksFor(argListToken) {
	const parent = argListToken.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_CALL) {
		const nameToken = parent.children[0];
		if (nameToken.type === ParseTreeTokenType.IDENTIFIER) {
			if (nameToken.val.toLowerCase() === 'print')
				return false;

			const info = BBCBasicInternalFunctions.getFunctionInfo(nameToken.val);
			if (info !== undefined) {
				if (info.args !== undefined) {
					for (const argInfo of info.args) {
						if (argInfo.types === undefined || argInfo.types === 'string')
							return false;
					}
					return info.args.length > 1;
				}
			}
		}
	}
	return false;
}

// bbcBasicQBasicCode should be mostly valid QBASIC code.
// It can include QB64 functions and some BBC Basic functions too, though.
// For example, bbcBasicQBasicCode may contain calls to BBC Basic's MOVE which is not in QBASIC.
export function translateBBCBasicQBasicToWebLogo(bbcBasicQBasicCode) {
	return translateQBASICToWebLogo(bbcBasicQBasicCode, undefined, fixer, undefined, skipStringArgumentChecksFor);
};