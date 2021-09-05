import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateRuleSet(token, parseLogger) {
	if (token.children.length !== 2) {
		parseLogger.error(`Expected 2 children for RULE_SET but found ${token.children.length}`, token);
	}
	else {
		const first = token.children[0];
		const second = token.children[1];
		if (first.type !== ParseTreeTokenType.SELECTOR)
			parseLogger.error(`Expected first child for RULE_SET to be a SELECTOR but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (second.type !== ParseTreeTokenType.DECLARATION_BLOCK)
			parseLogger.error(`Expected second child for RULE_SET to be a DECLARATION_BLOCK but found ${ParseTreeTokenType.getNameFor(second.type)}`, second);
	}
};