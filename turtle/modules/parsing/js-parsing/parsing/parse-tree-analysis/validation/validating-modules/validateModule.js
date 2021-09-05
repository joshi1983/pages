import { validateUndefinedIdentifiers } from './validateUndefinedIdentifiers.js';

const validators = [
validateUndefinedIdentifiers
];

export function validateModule(cachedParseTree, parseLogger) {
	validators.forEach(function(validator) {
		validator(cachedParseTree, parseLogger);
	});
};