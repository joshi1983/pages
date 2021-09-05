import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { fixQBasicParseTree } from
'../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/fixers/fixQBasicParseTree.js';
import { initGenericParsing } from
'../../helpers/initGenericParsing.js';
import { parse } from
'../../../modules/parsing/basic/qbasic/parse.js';
import { parseTreeToCode } from
'../../../modules/parsing/basic/qbasic/parseTreeToCode.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { translateCommodoreBasicToQBasic } from
'../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToQBasic.js';
import { translateCommodoreBasicToWebLogo } from
'../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';

let commodoreBasicCode;
commodoreBasicCode = `def fnx(x) = x * 3
80 def fny(x) = x * 20`;
let translationTarget = document.getElementById('translation-target');

function translateCommodoreBasicToQBasicFixed(code) {
	const qbasicCode = translateCommodoreBasicToQBasic(code);
	const qbParseResult = parse(qbasicCode);
	fixQBasicParseTree(qbParseResult.root);
	const fixedQBasicCode = parseTreeToCode(qbParseResult.root, qbasicCode);
	return fixedQBasicCode.trim();
}

function translate(code) {
	if (translationTarget.value === 'weblogo')
		return translateCommodoreBasicToWebLogo(code);
	else if (translationTarget.value === 'qbasic')
		return translateCommodoreBasicToQBasic(code);
	else
		return translateCommodoreBasicToQBasicFixed(code);
}

function parseBasedOnUI(code) {
	const qbParseResult = parse(translateCommodoreBasicToQBasic(code));
	if (translationTarget.value === 'qbasic-fixed')
		fixQBasicParseTree(qbParseResult.root);
	return qbParseResult;
}

const genericObject = initGenericParsing(ParseTreeTokenType, parseBasedOnUI,
	commodoreBasicCode, analyzeQuality, undefined, translate);

translationTarget.addEventListener('change', genericObject.refreshOutputs);