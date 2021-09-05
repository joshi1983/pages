const typeClasses = [
	['int', ['int', 'long', 'short']],
	['float', ['float', 'double']]
];
const typeToClassMap = new Map();
for (const [className, members] of typeClasses) {
	for (const member of members) {
		typeToClassMap.set(member, className);
	}
}

function getCommonTypeClass(type1, type2) {
	const class1 = typeToClassMap.get(type1);
	const class2 = typeToClassMap.get(type2);
	if (class1 === class2)
		return class1;
	if (class1 === undefined || class2 === undefined)
		return;
	if ([class1, class2].indexOf('int') !== -1 && [class1, class2].indexOf('float') !== -1)
		return 'float'; // float can be thought of as a generalization of int.
}

export function getCommonType() {
	let result = arguments[0];
	if (result === undefined)
		return;
	for (let i = 1; i < arguments.length; i++) {
		const type = arguments[i];
		if (type === undefined)
			return;
		if (type !== result) {
			result = getCommonTypeClass(type, result);
			if (result === undefined)
				return;
		}
	}
	return result;
};