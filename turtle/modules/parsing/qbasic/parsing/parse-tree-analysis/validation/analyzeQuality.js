import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateIndividualTokens } from '../../../../generic-parsing-utilities/validateIndividualTokens.js';
import { validateToken } from './type-validators/validateToken.js';

const validators = [
validateIndividualTokens(validateToken)
];

export function analyzeQuality(token, parseLogger) {
	const allTokens = flatten(token);
	validators.forEach(v => v(allTokens, parseLogger));
};