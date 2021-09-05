import { isInScope } from
'./isInScope.js';

export function getInScopeDeclaration(identifier, declarations) {
	if (!(declarations instanceof Array))
		throw new Error(`declarations must be an Array but found ${declarations}`);

	let tok = identifier.parentNode;
	while (tok !== null) {
		for (const dec of declarations) {
			if (isInScope(dec, tok))
				return dec;
		}
		tok = tok.parentNode;
	}
};