import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateTokenChildrenLength } from './validateTokenChildrenLength.js';
import { validateTokensByType } from './validateTokensByType.js';

const validators = [
validateTokenChildrenLength,
validateTokensByType
];

export function analyzeQuality(token, parseLogger) {
	const allTokens = flatten(token);
	validators.forEach(v => v(allTokens, parseLogger));
};