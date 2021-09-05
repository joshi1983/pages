import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { ready } from '../../../modules/ready.js';
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
let foreachLoopsInput;

function parsePotentiallyWithRefactor(code) {
	const parseResult = parse(code, {
		'parseForEachLoops': foreachLoopsInput !== undefined && foreachLoopsInput.checked
	});
	if (refactorParseTreeInput && refactorParseTreeInput.checked) {
		refactor(parseResult.root);
	}
	return parseResult;
}

function translate(code) {
	return translateQBASICToWebLogo(code, {
		'parseForEachLoops': foreachLoopsInput !== undefined && foreachLoopsInput.checked
	});
}

const genericObject = initGenericParsing(ParseTreeTokenType, parsePotentiallyWithRefactor, qbasicCode, analyzeQuality, undefined, translate);

function init() {
	refactorParseTreeInput = document.getElementById('refactor-parse-tree');
	foreachLoopsInput = document.getElementById('look-for-foreach-loops');
	refactorParseTreeInput.addEventListener('change', genericObject.refreshOutputs);
	foreachLoopsInput.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);