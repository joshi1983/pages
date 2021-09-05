import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { refactor } from '../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/refactor.js';
import { translateQBASICToWebLogo } from
'../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

let qbasicCode;
qbasicCode = `100 PRINT "hi" 
IF x THEN 
	goto 100
END IF
IF y THEN 
	goto 100
END IF`;
let refactorParseTreeInput;

function parsePotentiallyWithRefactor(code) {
	const parseResult = parse(code);
	if (refactorParseTreeInput && refactorParseTreeInput.checked) {
		refactor(parseResult.root);
	}
	return parseResult;
}

const genericObject = initGenericParsing(ParseTreeTokenType, parsePotentiallyWithRefactor, qbasicCode, analyzeQuality, undefined, translateQBASICToWebLogo);

function init() {
	refactorParseTreeInput = document.getElementById('refactor-parse-tree');
	refactorParseTreeInput.addEventListener('change', genericObject.refreshOutputs);
}

init();