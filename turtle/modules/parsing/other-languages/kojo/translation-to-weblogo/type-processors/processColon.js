import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function shouldNotGetTranslated(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.CODE_BLOCK) {
		if (parent.children.indexOf(token) === 0)
			return true; // marking start of a code block should not get translated to WebLogo.
	}
	return false;
}

export function processColon(token, result) {
	if (shouldNotGetTranslated(token))
		return;

	result.append(':');
};