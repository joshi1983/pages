import { evaluateTemplateLiteral } from
'../../../../../../parsing/js-parsing/evaluateTemplateLiteral.js';
import { stringValueToWebLogoStringLiteral } from
'../../../../../../parsing/generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processTemplateLiteral(token, result) {
	const val = stringValueToWebLogoStringLiteral(evaluateTemplateLiteral(token.val, function() {}));
	result.append(val);
};