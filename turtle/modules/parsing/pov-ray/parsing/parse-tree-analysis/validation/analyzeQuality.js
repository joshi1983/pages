import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateIndividualTokens } from '../../../../generic-parsing-utilities/validateIndividualTokens.js';
import { validateNoChildrenTokens } from './validateNoChildrenTokens.js';
import { validateToken } from './type-validators/validateToken.js';
import { validateTokenComplete } from './validateTokenComplete.js';

const validators = [
validateIndividualTokens(validateToken),
validateNoChildrenTokens,
validateTokenComplete,
];

export function analyzeQuality(token, parseLogger) {
	const allTokens = flatten(token);
	validators.forEach(v => v(allTokens, parseLogger));
};