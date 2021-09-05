import { formatToken } from './formatToken.js';

export function formatBinaryOperator(binToken, logger) {
	const children = binToken.children;
	if (children.length !== 0)
		formatToken(children[0], logger);
	logger.log('' + binToken.val, binToken);
	if (children.length >= 2)
		formatToken(children[1], logger);
};