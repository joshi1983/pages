import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateNoChildrenTokens } from './validateNoChildrenTokens.js';
import { validateTokenComplete } from './validateTokenComplete.js';
import { validateTokensByType } from './validateTokensByType.js';

const validators = [
validateNoChildrenTokens,
validateTokenComplete,
validateTokensByType
];

export function analyzeQuality(token, parseLogger) {
	const allTokens = flatten(token);
	validators.forEach(v => v(allTokens, parseLogger));
};