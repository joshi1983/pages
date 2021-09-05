export function getStringIndexAfterToken(token, code) {
	if (typeof token !== 'object')
		throw new Error(`token must be an object but found ${token}`);
	if (typeof code !== 'string')
		throw new Error(`code must be a string but found ${code}`);
	let result = 0;
	for (let i = 0; true; i++) {
		if (i === token.lineIndex)
			return result + token.colIndex + 1;
		const index = code.indexOf('\n', result);
		if (index === -1)
			return -1;
		result = index + 1;
	}
};