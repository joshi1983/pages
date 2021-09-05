export class DataTypeTokenType {
	static getNameFor(typeInt) {
		return names[typeInt];
	}
};

const names = [
'ASSIGNMENT', // for example, minlen=3
'ATTRIBUTES_EXPRESSION', // for example, (minlen=3)
'NAME', // for example, list
'TEMPLATE_EXPRESSION', // for example, the <num|string> part of list<num|string>
'TREE_ROOT',
'WILDCARD' // for example, *
];

names.forEach(function(key, index) {
	DataTypeTokenType[key] = index;
});