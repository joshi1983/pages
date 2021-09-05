import { stringValueToWebLogoStringLiteral } from
'../../../modules/parsing/generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testStringValueToWebLogoStringLiteral(logger) {
	const cases = [
		{'in': '', 'out': '"'},
		{'in': '1', 'out': '"1'},
		{'in': 'red', 'out': '"red'},
		{'in': '#123', 'out': '"#123'},
		{'in': 'hello world', 'out': "'hello world'"},
		{'in': '(', 'out': "'('"},
		{'in': '[', 'out': "'['"},
		{'in': ';', 'out': "';'"},
		{'in': '"', 'out': "'\"'"},
		{'in': "'", 'out': "'\\''"},
	];
	testInOutPairs(cases, stringValueToWebLogoStringLiteral, logger);
};