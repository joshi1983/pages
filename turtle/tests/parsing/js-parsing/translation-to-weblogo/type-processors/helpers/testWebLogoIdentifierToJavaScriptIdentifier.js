import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { webLogoIdentifierToJavaScriptIdentifier } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/helpers/webLogoIdentifierToJavaScriptIdentifier.js';

export function testWebLogoIdentifierToJavaScriptIdentifier(logger) {
	const cases = [
		{'in': 'f', 'out': 'f'},
		{'in': 'f3', 'out': 'f3'},
		{'in': '.', 'out': '_'},
		{'in': '..', 'out': '_'},
		{'in': '...', 'out': '_'},
		{'in': '._', 'out': '_'},
		{'in': '.3', 'out': '_'},
		{'in': '.f', 'out': 'f'}
	];
	testInOutPairs(cases, webLogoIdentifierToJavaScriptIdentifier, logger);
};