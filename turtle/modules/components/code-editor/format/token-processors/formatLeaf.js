export function formatLeaf(token, logger) {
	let s;
	if (token.val === token.val.toUpperCase())
		s = token.val.toLowerCase();
	else
		s = token.val;
	logger.log(s, token);
};