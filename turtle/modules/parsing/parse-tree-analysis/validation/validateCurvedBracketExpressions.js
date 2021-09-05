import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateCurvedBracketExpressions(cachedParseTree, parseLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	tokens.forEach(function(token) {
		if (token.children.length !== 3) {
			let msg = undefined;
			if (token.children.length < 3) {
				if (token.children.length === 2 && token.children[0].val === '(' && token.children[1].val === ')')
					msg = 'Your curved brackets are balanced but you must place an expression between the brackets.';
				else
					msg = 'Make sure the curved brackets are balanced.';
			}
			else {
				msg = 'Check that everything in the curved brackets is recognized and that all other error messages about the expression are resolved.';
			}
			msg += ' Expected 3 parse tree child nodes for every curved bracket expression but found ' + token.children.length;
			parseLogger.error(msg, token);
		}
		else {
			if (token.children[0].val !== '(')
				parseLogger.error('Expected curved bracket expression to start with ( but first token was ' + token.children[0].val, token.children[0]);
			if (token.children[2].val !== ')')
				parseLogger.error('Expected curved bracket expression to end with ) but last token was ' + token.children[2].val, token.children[2]);
		}
	});
};