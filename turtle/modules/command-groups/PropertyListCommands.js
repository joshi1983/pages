export class PropertyListCommands {
	plist(plistVal) {
		const result = [];
		for (const [key, value] of plistVal) {
			result.push(key);
			result.push(value);
		}
		return result;
	}

	createPList() {
		return new Map();
	}

	createPList2(initVal) {
		return new Map(initVal);
	}

	removeProperty(plistVal, key) {
		plistVal.delete(key);
	}
};

function setProperty(plistVal, key, value) {
	if (!(plistVal instanceof Map))
		throw new Error('plistVal must be a Map.  Not: ' + plistVal);
	plistVal.set(key, value);
}

function getProperty(plistVal, key) {
	return plistVal.get(key);
}

PropertyListCommands.prototype.getProperty = getProperty;
PropertyListCommands.prototype.getProperty2 = getProperty;

PropertyListCommands.prototype.setProperty = setProperty;
PropertyListCommands.prototype.setProperty2 = setProperty;