import { evaluateTemplateLiteral } from
'../../evaluateTemplateLiteral.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processTemplateLiteral(token, result) {
	const val = stringValueToWebLogoStringLiteral(evaluateTemplateLiteral(token.val, function() {}));
	result.append(val);
};