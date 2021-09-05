import { filterBracketsAndCommas } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { jsProcessingColorArgsToWebLogoColorLiteral } from
'../../../../../../modules/parsing/processing/js-processing/translation-to-weblogo/type-processors/processArgsAsSingleColor.js';
import { parse } from
'../../../../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedFunc(argsCode) {
	const code = `background(${argsCode})`;
	const parseResult = parse(code);
	const funcCall = parseResult.root.children[0];
	const argList = funcCall.children[1];
	const args = filterBracketsAndCommas(argList.children);
	return jsProcessingColorArgsToWebLogoColorLiteral(args);
}

export function testJsProcessingColorArgsToWebLogoColorLiteral(logger) {
	const cases = [
		{'in': '1,2,3', 'out': '#010203'},
		{'in': '"rgb(1,2,3)"', 'out': '#010203'},
		{'in': '"rgb(16,5,3)"', 'out': '#100503'},
		{'in': '"rgba(1,2,3,1)"', 'out': '#010203'},
		{'in': '"rgba(1,2,3,0.5)"', 'out': '#80010203'},
	];
	testInOutPairs(cases, wrappedFunc, logger);
};