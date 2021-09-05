const zeroCode = '0'.charCodeAt(0);

export function getValuesFromString(s, maxValue) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);

	let tokens;
	if (maxValue < 10) {
		tokens = [];
		for (let i = 0; i < s.length; i++) {
			const ch = s[i];
			if (ch >= '0' && ch <= '9')
				tokens.push(ch.charCodeAt(0) - zeroCode);
		}
		return tokens;
	}
	else
		tokens = s.split(/\s+/).filter(token => token !== '');
	return tokens.map(token => parseInt(token.trim()));
};