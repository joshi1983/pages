import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
await DataTypes.asyncInit();

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
		{'in': ['colorlist', 'list<colorstring>'], 'out': ''},
		{'in': ['list', 'list<colorstring>'], 'out': 'list<colorstring>'},
		{'in': ['bool|list|num|plist|string|transparent', 'color|transparent'], 'out': 'color|transparent'},
		{'in': ['alphacolorlist', 'list'], 'out': 'alphacolorlist'},
		{'in': ['alphacolorlist', 'list<num>'], 'out': 'alphacolorlist'},
		{'in': ['alphacolor', 'list<colorstring>'], 'out': ''},
		{'in': ['alphacolorlist|list<list<num>>', 'list'], 'out': 'alphacolorlist|list<list<num>>'},
		{'in': ['color', 'list<colorstring>'], 'out': ''},
		{'in': ['alphacolorlist', 'list<colorstring>'], 'out': ''},
		{'in': ['alphacolor|transparent', 'list<colorstring>'], 'out': ''},
		{'in': ['list<num>', 'list<int>'], 'out': 'list<int>'},
		{'in': ['list<num|list>', 'list<int>'], 'out': 'list<int>'},
		{'in': ['list<num>(minlen=3)', 'list<int>(minlen=2)'], 'out': 'list<int>(minlen=3)'},
		{'in': ['list<color>', 'list<num>'], 'out': 'list<int>'},
		{'in': ['list<num>', 'list<alphacolor>'], 'out': 'list<int>'},
	];
	// the intersection should be the same regardless of input order.
	// Add cases with reverses order to test.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		cases.push({
			'in': [caseInfo.in[1], caseInfo.in[0]],
			'out': caseInfo.out
		});
	}
	cases.forEach(function(caseInfo, index) {
		const in1 = DataTypes.parse(caseInfo.in[0]);
		const in2 = DataTypes.parse(caseInfo.in[1]);
		const actualResult = new DataTypes(in1);
		actualResult.intersectWith(in2);
		const actualResultString = actualResult.toString();
		if (actualResultString !== caseInfo.out)
			logger(escapeHTML(`Case ${index}, Expected ${caseInfo.out} but got ${actualResultString} `+
				' for inputs ' + DataTypes.stringify(in1) + ' and ' +
				DataTypes.stringify(in2)));
	});
};