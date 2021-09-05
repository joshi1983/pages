/*
This is very similar to modules/parsing/ParseTreeToken.js's flatten method.
After verifying that this is working very well, we may want to remove 
ParseTreeToken.flatten in favour of this.
*/
export function flatten(rootToken) {
	if (typeof rootToken !== 'object' || rootToken === null ||
	rootToken instanceof Array)
		throw new Error(`rootToken must be a ParseTreeToken object but got ${rootToken}`);

	// Make sure this is the top/root token.
	while (rootToken.parentNode !== null)
		rootToken = rootToken.parentNode;

	const result = new Set([rootToken]);
	const queue = [rootToken];
	while (queue.length > 0) {
		const e = queue.shift();
		if (e.parentNode !== null && !result.has(e.parentNode)) {
			result.add(e.parentNode);
			queue.push(e.parentNode);
		}
		e.children.forEach(function(ec) {
			if (!result.has(ec)) {
				result.add(ec);
				queue.push(ec);
			}
		});
	}
	return Array.from(result);
};