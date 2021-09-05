import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';

export function testDataTypesContains(logger) {
	const cases = [
		{'in': ['', 'num'], 'out': false},
		{'in': ['int', 'num'], 'out': false},
		{'in': ['bool', 'int'], 'out': false},
		{'in': ['list', 'int'], 'out': false},
		{'in': ['string', 'int'], 'out': false},
		{'in': ['string', 'num'], 'out': false},
		{'in': ['string', 'bool'], 'out': false},
		{'in': ['transparent', 'bool'], 'out': false},
		{'in': ['transparent', 'color'], 'out': false},
		{'in': ['color', 'transparent'], 'out': false},
		{'in': ['color', 'int'], 'out': true},
		{'in': ['int', 'num'], 'out': false},
		{'in': ['num', 'int'], 'out': true},
		{'in': ['bool|int', 'int'], 'out': true},
		{'in': ['bool|string', 'int'], 'out': false},
		{'in': ['bool|int', 'bool|num'], 'out': false},
		{'in': ['bool|num', 'int'], 'out': true},
		{'in': ['bool|int|num', 'int'], 'out': true},
		{'in': ['bool|list', 'num'], 'out': false},
		{'in': ['colorlist|colorstring|int', 'color'], 'out': true},
		{'in': ['list|num|string', 'color'], 'out': true},
		{'in': ['color', 'colorlist|int|string'], 'out': false},
		{'in': ['color', 'colorlist|num|colorstring'], 'out': false}
	];
	cases.forEach(function(caseInfo) {
		const in1 = caseInfo.in[0];
		const in2 = caseInfo.in[1];
		const actualResult = DataTypes.contains(DataTypes.parse(in1), DataTypes.parse(in2));
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for inputs ' + in1 + ' and ' + in2);
	});
};