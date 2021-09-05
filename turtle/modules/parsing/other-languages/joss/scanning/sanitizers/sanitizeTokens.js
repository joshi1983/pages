import { sanitizeMinusOperators } from
'./sanitizeMinusOperators.js';

const sanitizers = [
	sanitizeMinusOperators
];

export function sanitizeTokens(tokens) {
	for (const sanitizer of sanitizers) {
		sanitizer(tokens);
	}
};