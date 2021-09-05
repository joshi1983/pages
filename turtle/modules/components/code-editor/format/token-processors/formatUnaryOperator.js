import { formatToken } from './formatToken.js';

export function formatUnaryOperator(uToken, logger) {
	logger.log(uToken.val, uToken);

	// There should always be 1 child for a unary operation but we're just being safe.
	if (uToken.children.length === 1) {
		logger.removeSpacePrefixForNextLog();
		formatToken(uToken.children[0], logger);
	}
};