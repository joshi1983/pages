import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

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
		{'in': ['alphacolor', 'int'], 'out': true},
		{'in': ['alphacolor', 'color'], 'out': true},
		{'in': ['alphacolor', 'colorlist'], 'out': true},
		{'in': ['alphacolor', 'colorstring'], 'out': true},
		{'in': ['alphacolor', 'alphacolorlist'], 'out': true},
		{'in': ['alphacolor', 'alphacolorstring'], 'out': true},
		{'in': ['alphacolor', 'string'], 'out': false},
		{'in': ['alphacolor', 'list'], 'out': false},
		{'in': ['color', 'colorstring'], 'out': true},
		{'in': ['color', 'colorlist'], 'out': true},
		{'in': ['color', 'colorlist|colorstring'], 'out': true},
		{'in': ['color', 'colorlist|int|string'], 'out': false},
		{'in': ['color', 'colorlist|num|colorstring'], 'out': false},
		{'in': ['colorstring', 'cproc'], 'out': false},
		{'in': ['colorstring', 'cproc:0'], 'out': false},
		{'in': ['int', 'num'], 'out': false},
		{'in': ['num', 'int'], 'out': true},
		{'in': ['bool|cproc', 'cproc:2'], 'out': true},
		{'in': ['cproc', 'cproc:2'], 'out': true},
		{'in': ['cproc', 'cproc(returntypes=num)'], 'out': true},
		{'in': ['cproc', 'cproc(returntypes=string)'], 'out': true},
		{'in': ['cproc:1', 'cproc:1(returntypes=string)'], 'out': true},
		{'in': ['cproc:1(returntypes=num)', 'cproc:1(returntypes=string)'], 'out': false},
		{'in': ['cproc:2', 'cproc'], 'out': false},
		{'in': ['cproc:2', 'cproc:3'], 'out': false},
		{'in': ['cproc:3', 'cproc:2'], 'out': false},
		{'in': ['string', 'cproc'], 'out': true},
		{'in': ['string', 'cproc:2'], 'out': true},
		{'in': ['cproc', 'color'], 'out': false},
		{'in': ['cproc', 'colorstring'], 'out': false},
		{'in': ['bool|int', 'int'], 'out': true},
		{'in': ['bool|string', 'int'], 'out': false},
		{'in': ['bool|int', 'bool|num'], 'out': false},
		{'in': ['bool|num', 'int'], 'out': true},
		{'in': ['bool|int|num', 'int'], 'out': true},
		{'in': ['bool|list', 'num'], 'out': false},
		{'in': ['colorlist|colorstring|int', 'color'], 'out': true, 'isEqual': true},
		{'in': ['alphacolorlist|alphacolorstring|int', 'alphacolor'], 'out': false},
		{'in': ['alphacolorlist|alphacolorstring|colorstring|int', 'alphacolor'], 'out': false},
		{'in': ['alphacolorlist|alphacolorstring|colorlist|colorstring|int', 'alphacolor'], 'out': true, 'isEqual': true},
		{'in': ['list|num|string', 'color'], 'out': true},
		{'in': ['colorlist', 'list<colorlist>'], 'out': false},
		{'in': ['list<colorlist>', 'colorlist'], 'out': false},
		{'in': ['list', 'list(minlen=3)'], 'out': true},
		{'in': ['list(minlen=2)', 'list(minlen=3)'], 'out': true},
		{'in': ['list(minlen=5)', 'alphacolorlist'], 'out': false},
		{'in': ['list(minlen=4)', 'alphacolorlist'], 'out': true},
		{'in': ['list(minlen=4)', 'colorlist'], 'out': false},
		{'in': ['list(minlen=3)', 'colorlist'], 'out': true},
		{'in': ['list(minlen=2)', 'colorlist'], 'out': true},
		{'in': ['list(minlen=1)', 'colorlist'], 'out': true},
		{'in': ['string', 'string(minlen=3)'], 'out': true},
		{'in': ['string(minlen=2)', 'string(minlen=3)'], 'out': true},
		{'in': ['string(minlen=3)', 'string(minlen=2)'], 'out': false},
		{'in': ['list<list<int>(minlen=1)>(minlen=2)', 'list<list<int>(minlen=2)>(minlen=2)'], 'out': true},
		{'in': ['list<list<int>(minlen=2)>(minlen=2)', 'list<list<int>>(minlen=2)'], 'out': false},
	];
	cases.forEach(function(caseInfo, index) {
		const in1 = caseInfo.in[0];
		const in2 = caseInfo.in[1];
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const actualResult = DataTypes.contains(DataTypes.parse(in1), DataTypes.parse(in2));
		if (actualResult !== caseInfo.out)
			plogger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for inputs ' + in1 + ' and ' + in2);
		else if (caseInfo.out) {
			const actualResult2 = DataTypes.contains(DataTypes.parse(in2), DataTypes.parse(in1));
			let expected = !caseInfo.out;
			if (caseInfo.isEqual)
				expected = true;
			if (actualResult2 !== expected)
				plogger(`Expected ${expected} for the reverse(${in2} contains ${in1}) but got ${actualResult2}`);
		}
	});
};