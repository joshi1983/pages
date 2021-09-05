import { validateDuplicateDeclarations } from './validateDuplicateDeclarations.js';
import { validateUndefinedIdentifiers } from './validateUndefinedIdentifiers.js';
import { validateUnusedIdentifiers } from './validateUnusedIdentifiers.js';

const validators = [
validateDuplicateDeclarations,
validateUndefinedIdentifiers,
validateUnusedIdentifiers
];

export function validateModule(cachedParseTree, parseLogger) {
	validators.forEach(function(validator) {
		validator(cachedParseTree, parseLogger);
	});
};