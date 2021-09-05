const names = ['normal', 'max_time', 'exception'];
export class HaltType {

	static getNameFor(type) {
		return names[type];
	}
};

names.forEach(function(name, index) {
	HaltType[name.toUpperCase()] = index;
});