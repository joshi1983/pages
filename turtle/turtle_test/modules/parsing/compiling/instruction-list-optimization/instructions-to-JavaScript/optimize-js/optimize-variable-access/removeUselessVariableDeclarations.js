import { isUselessVariableDeclaration } from '../token-classifiers/isUselessVariableDeclaration.js';
import { removeSemicolonsImmediatelyAfter } from '../removeSemicolonsImmediatelyAfter.js';

function isOfInterest(identifiersOfInterest) {
	if (!(identifiersOfInterest instanceof Set))
		identifiersOfInterest = new Set(identifiersOfInterest);
	return function(token) {
		if (!isUselessVariableDeclaration(token))
			return false;
		if (!identifiersOfInterest.has(token.val))
			return false;
		return true;
	};
}

export function removeUselessVariableDeclarations(tokens, identifiersOfInterest) {
	const uselessDeclarations = tokens.filter(isOfInterest(identifiersOfInterest));
	uselessDeclarations.forEach(function(token) {
		token = token.parentNode.parentNode;
		removeSemicolonsImmediatelyAfter(token);
		token.remove();
	});
};