export class DataTypeTokenType {
	static getNameFor(typeInt) {
		return names[typeInt];
	}
};

const names = [
'EMPTY_PLACEHOLDER',
'NAME',
'TREE_ROOT',
'WILDCARD'
];

names.forEach(function(key, index) {
	DataTypeTokenType[key] = index;
});