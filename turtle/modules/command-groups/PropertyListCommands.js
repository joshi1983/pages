export class PropertyListCommands {
	getProperty(plistVal, key) {
		return plistVal.get(key);
	}

	plist(plistVal) {
		const result = [];
		for (const [key, value] of plistVal) {
			result.push(key);
			result.push(value);
		}
		return result;
	}

	plistCreate() {
		return new Map();
	}

	removeProperty(plistVal, key) {
		plistVal.delete(key);
	}

	setProperty(plistVal, key, value) {
		if (!(plistVal instanceof Map))
			throw new Error('plistVal must be a Map.  Not: ' + plistVal);
		plistVal.set(key, value);
	}
};