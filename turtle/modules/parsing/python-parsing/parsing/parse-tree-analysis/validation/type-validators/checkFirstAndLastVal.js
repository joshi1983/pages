export function checkFirstAndLastVal(token, firstChildVal, lastChildVal, parseLogger) {
	const children = token.children;
	if (children.length === 0)
		parseLogger.error(`Expected at least 1 child for a token`, token);
	else {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.val !== firstChildVal)
			parseLogger.error(`Expected first child to have a val of ${firstChildVal} but found ${first.val}`, token);
		if (last.val !== lastChildVal)
			parseLogger.error(`Expected first child to have a val of ${lastChildVal} but found ${last.val}`, token);
	}
};