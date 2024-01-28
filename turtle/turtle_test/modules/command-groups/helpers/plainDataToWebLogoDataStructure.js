const atomicTypes = new Set(['boolean', 'number', 'string', 'undefined']);

function processArray(obj) {
	return obj.map(plainDataToWebLogoDataStructure);
}

export function plainDataToWebLogoDataStructure(obj) {
	if (atomicTypes.has(typeof obj))
		return obj;
	if (obj === null)
		return obj;
	if (obj instanceof Array)
		return processArray(obj);
	if (typeof obj === 'object') {
		const result = new Map();
		for (const key in obj) {
			result.set(key, plainDataToWebLogoDataStructure(obj[key]));
		}
		return result;
	}
	throw new Error(`Unable to process object ${obj}`);
};