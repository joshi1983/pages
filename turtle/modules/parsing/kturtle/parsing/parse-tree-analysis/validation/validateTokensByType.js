import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateIndividualTokens } from '../../../../generic-parsing-utilities/validateIndividualTokens.js';
import { validateToken } from './type-validators/validateToken.js';

const f = validateIndividualTokens(validateToken);

export function validateTokensByType(tree, parseLogger) {
	f(flatten(tree), parseLogger);
};