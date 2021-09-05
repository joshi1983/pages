import { curlyBracketFixer } from './curlyBracketFixer.js';
import { declareMissingEqualFixer } from './declareMissingEqualFixer.js';
import { erroneousKeyValuePairFixer } from './erroneousKeyValuePairFixer.js';

const sanitizers = [
curlyBracketFixer,
declareMissingEqualFixer,
erroneousKeyValuePairFixer
];

export function sanitize(root) {
	sanitizers.forEach(sanitize => sanitize(root));
};