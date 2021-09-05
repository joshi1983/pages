import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { bbcBasicParse } from '../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/bbcBasicParse.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { insertSpaces } from
'../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/insertSpaces.js';
import { insertSpacesAfterIntegerLabels } from
'../../../modules/parsing/basic/helpers/insertSpacesAfterIntegerLabels.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { refactor } from '../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/refactor.js';
import { translateBBCBasicToQBasic } from
'../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToQBasic.js';
import { translateBBCBasicToWebLogo } from
'../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';

let bbcBasicCode;
bbcBasicCode = `@%=&0002020A`;
let refactorCheckbox = document.getElementById('refactor');
let translationTarget = document.getElementById('translation-target');

function flexibleBBCBasicParse(code) {
	const result = bbcBasicParse(code);
	if (refactorCheckbox.checked)
		refactor(result.root);
	return result;
}

function translate(code) {
	if (translationTarget.value === 'insert-spaces') {
		return insertSpaces(insertSpacesAfterIntegerLabels(code));
	}
	else if (translationTarget.value === 'WebLogo')
		return translateBBCBasicToWebLogo(code);
	else
		return translateBBCBasicToQBasic(code);
}

const genericObject = initGenericParsing(ParseTreeTokenType, flexibleBBCBasicParse, bbcBasicCode, analyzeQuality,
	undefined, translate);

refactorCheckbox.addEventListener('change', genericObject.refreshOutputs);
translationTarget.addEventListener('change', genericObject.refreshOutputs);