import { customFunctionOrSubTypes } from './isCustomFunctionOrSubToken.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isCustomFunctionOrSub(root, name) {
	name = name.toLowerCase();
	return getDescendentsOfTypes(root, customFunctionOrSubTypes).
		some(function(def) {
			const nameToken = def.children[0];
			if (nameToken === undefined || nameToken.type !== ParseTreeTokenType.IDENTIFIER)
				return false;
			return nameToken.val.toLowerCase() === name;
		});
};