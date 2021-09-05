export function processNumberLiteral(token, result) {
	if (result.endsWithAndNotAcomment('  '))
		result.removeFromTail(1);
	result.append(token.val + ' ');
};