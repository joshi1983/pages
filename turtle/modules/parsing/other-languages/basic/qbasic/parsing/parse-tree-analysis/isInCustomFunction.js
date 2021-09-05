import { isCustomFunctionOrSubToken } from
'./isCustomFunctionOrSubToken.js';

export function isInCustomFunction(token) {
	while (token !== null) {
		if (isCustomFunctionOrSubToken(token))
			return true;
		token = token.parentNode;
	}
	return false;
};