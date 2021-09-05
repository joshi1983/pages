const propertiesMap = new Map([
	['angle', {
		'to': 'angle'
	}],
	['axiom', {
		'to': 'axiom'
	}]
]);

export class FractIntProperties {
	static getPropertyInfo(name) {
		name = name.toLowerCase();
		return propertiesMap.get(name);
	}
};