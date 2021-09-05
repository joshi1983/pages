import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/other-languages/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/other-languages/kojo/ParseTreeTokenType.js';
import { ready } from '../../modules/ready.js';
import { simplify } from
'../../modules/parsing/other-languages/kojo/translation-to-weblogo/simplifiers/simplify.js';
import { translateKojoToWebLogo } from
'../../modules/parsing/other-languages/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { validateTokensByType } from
'../../modules/parsing/other-languages/kojo/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let kojoCode;
kojoCode = `clear`;

function init() {
	let simplifyInput = document.getElementById('simplify-parse-tree');

	function customizedParse(code) {
		const result = parse(code);
		if (simplifyInput.checked)
			simplify(result.root);
		
		return result;
	}

	const result = initGenericParsing(ParseTreeTokenType, customizedParse, kojoCode, validateTokensByType, undefined, translateKojoToWebLogo);
	simplifyInput.addEventListener('change', result.refreshOutputs);
}

ready(init);