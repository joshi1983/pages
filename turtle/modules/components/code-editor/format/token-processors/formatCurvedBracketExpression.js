import { formatToken } from './formatToken.js';

export function formatCurvedBracketExpression(cbToken, logger) {
	logger.log('(', cbToken);
	logger.indent();
	cbToken.children.filter(t => t.val !== '(' && t.val !== ')').forEach(function(child) {
		formatToken(child, logger);
	});
	logger.deindent();
	logger.log(')', cbToken);
};