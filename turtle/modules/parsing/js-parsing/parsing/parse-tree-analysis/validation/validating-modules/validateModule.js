import { validateUndefinedIdentifiers } from './validateUndefinedIdentifiers.js';
import { validateUnusedIdentifiers } from './validateUnusedIdentifiers.js';

const validators = [
validateUndefinedIdentifiers,
validateUnusedIdentifiers
];

export function validateModule(cachedParseTree, parseLogger) {
	validators.forEach(function(validator) {
		validator(cachedParseTree, parseLogger);
	});
};