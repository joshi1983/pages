import { removeSquareBracketsForNumberArguments } from './removeSquareBracketsForNumberArguments.js';

const sanitizersArray = [
removeSquareBracketsForNumberArguments
];
export const sanitizerMap = new Map();
sanitizersArray.forEach(function(sanitizer) {
	sanitizerMap.set(sanitizer.name, sanitizer);
});

export function sanitizeForLogoMigration(cachedParseTree, fixLogger, migrationInfo) {
	if (migrationInfo.sanitization === undefined)
		return;
	migrationInfo.sanitization.forEach(function(name) {
		sanitizerMap.get(name)(cachedParseTree, fixLogger);
	});
};