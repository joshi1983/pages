const propertiesMap = new Map([
	['angle', {
		'to': 'angle'
	}],
	['axiom', {
		'to': 'axiom'
	}],
	['order', {
		'to': 'order'
	}],
	['rotate', {
		'to': 'rotate'
	}]
]);

export class CGJenningsProperties {
	static getPropertyInfo(name) {
		name = name.toLowerCase();
		return propertiesMap.get(name);
	}
};