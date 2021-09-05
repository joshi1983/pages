import { ExpectedChildrenResult, hasAllExpectedChildren } from '../../hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function validateTokenComplete(tokens, parseLogger) {
	tokens.forEach(function(token) {
		if (!ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
			parseLogger.error(`A token of type ${ParseTreeTokenType.getNameFor(token.type)} did not have all the expected children`, token);
	});
};