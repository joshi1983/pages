function tokenToVal(token) {
	return token.val.toLowerCase();
}

export function processSpecialCommand(specials, tokenToName) {
	if (tokenToName === undefined)
		tokenToName = tokenToVal;
	else if (typeof tokenToName !== 'function')
		throw new Error(`tokenToName must either be undefined or a function but found ${tokenToName}`);
	let specialsMap;
	if (specials instanceof Array) {
		specialsMap = new Map();
		specials.forEach(function(func) {
			specialsMap.set(func.name.toLowerCase(), func);
		});
	}
	else if (specials instanceof Map)
		specialsMap = specials;
	else
		throw new Error(`specials must either be an Array of functions or a Map from name to function but got ${specials}`);
	return function(token) {
		const name = tokenToName(token);
		if (specialsMap.has(name)) {
			specialsMap.get(name)(...arguments);
			return true;
		}
		return false;
	}
};