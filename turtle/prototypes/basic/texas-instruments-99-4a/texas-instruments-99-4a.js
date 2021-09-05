import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/texas-instruments-99-4a/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateTI99BasicToWebLogo } from
'../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';

let ti99BasicCode;
ti99BasicCode = `10 call SCREEN(3)`;
let ti99scan;

function ti99Parse(code) {
	if (ti99scan !== undefined && ti99scan.checked) {
		code = scanTokensToCode(scan(code));
	}
	return parse(code);
}

function init() {
	ti99scan = document.getElementById('ti99-parse-tree');
	const genericObject = initGenericParsing(ParseTreeTokenType, ti99Parse, ti99BasicCode, undefined,
	undefined, translateTI99BasicToWebLogo);
	ti99scan.addEventListener('change', genericObject.refreshOutputs);
}

init();
