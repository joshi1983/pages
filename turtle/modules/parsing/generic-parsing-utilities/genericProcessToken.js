export function genericProcessToken(typeProcessorsMap) {
	if (!(typeProcessorsMap instanceof Map))
		throw new Error(`typeProcessorsMap must be a Map but got ${typeProcessorsMap}`);
	let processToken;
	processToken = function(token, buffer, settings) {
		if (typeof token !== 'object')
			throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
		const processor = typeProcessorsMap.get(token.type);
		if (processor !== undefined)
			processor(token, buffer, settings);
		else {
			if (token.val !== null)
				buffer.append(token.val + ' ');
			const children = token.children;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				processToken(child, buffer, settings);
			}
		}
	};
	return processToken;
};