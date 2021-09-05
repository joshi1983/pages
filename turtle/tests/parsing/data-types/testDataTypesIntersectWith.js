import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';

export function testDataTypesIntersectWith(logger) {
	const cases = [
		{'in': ['', 'num'], 'out': ''},
		{'in': ['num', ''], 'out': ''},
		{'in': ['bool', 'bool'], 'out': 'bool'},
		{'in': ['bool', 'int'], 'out': ''},
		{'in': ['bool', 'num'], 'out': ''},
		{'in': ['bool', 'string'], 'out': ''},
		{'in': ['bool', 'list'], 'out': ''},
		{'in': ['bool', 'colorlist'], 'out': ''},
		{'in': ['bool', 'colorstring'], 'out': ''},
		{'in': ['color', 'num'], 'out': 'int'},
		{'in': ['color', 'int'], 'out': 'int'},
		{'in': ['color', 'bool'], 'out': ''},
		{'in': ['color', 'string'], 'out': 'colorstring'},
		{'in': ['color', 'list'], 'out': 'colorlist'},
		{'in': ['color', 'colorlist'], 'out': 'colorlist'},
		{'in': ['color', 'colorstring'], 'out': 'colorstring'},
		{'in': ['color', 'num|string|list'], 'out': 'color'},
		{'in': ['color', 'int|string|list'], 'out': 'color'},
		{'in': ['string', 'string'], 'out': 'string'},
		{'in': ['string', 'num'], 'out': ''},
		{'in': ['string', 'list'], 'out': ''},
		{'in': ['string', 'transparent'], 'out': ''},
		{'in': ['list|num|string', 'color'], 'out': 'color'},
		{'in': ['list|num|string|transparent', 'color|transparent'], 'out': 'color|transparent'},
		{'in': ['bool|list|num|plist|string|transparent', 'color|transparent'], 'out': 'color|transparent'},
	];
	cases.forEach(function(caseInfo) {
		const in1 = DataTypes.parse(caseInfo.in[0]);
		const in2 = DataTypes.parse(caseInfo.in[1]);
		const actualResult = new DataTypes(in1);
		actualResult.intersectWith(in2);
		const actualResultString = actualResult.toString();
		if (actualResultString !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResultString +
				' for inputs ' + DataTypes.stringify(in1) + ' and ' +
				DataTypes.stringify(in2));
	});
};