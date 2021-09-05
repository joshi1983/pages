import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';

export function testDataTypesUnion(logger) {
	const cases = [
		{'in': ['', 'int'], 'out': 'int'},
		{'in': ['', 'num(finite)'], 'out': 'num(finite)'},
		{'in': ['cproc', 'cproc:2'], 'out': 'cproc'},
		{'in': ['cproc', 'cproc(returntypes=num)'], 'out': 'cproc'},
		{'in': ['cproc(returntypes=string)', 'cproc(returntypes=num)'], 'out': 'cproc(returntypes=num|string)'},
		{'in': ['int', 'transparent'], 'out': 'int|transparent'},
		{'in': ['int', 'int'], 'out': 'int'},
		{'in': ['bool|int', ''], 'out': 'bool|int'},
		{'in': ['int', 'num'], 'out': 'num'},
		{'in': ['int', 'string'], 'out': 'int|string'},
		{'in': ['int|num', ''], 'out': 'num'},
		{'in': ['int|num(finite)', ''], 'out': 'num(finite)'},
		{'in': ['int', 'num(finite)'], 'out': 'num(finite)'},
		{'in': ['num(finite)|num', ''], 'out': 'num'},
		{'in': ['num(finite)', 'num'], 'out': 'num'},
		{'in': ['list<num>(minlen=3)', 'list<num>(minlen=4)'], 'out': 'list<num>(minlen=3)'},
		{'in': ['list<num>(minlen=3)', 'list<string>(minlen=3)'], 'out': 'list<num|string>(minlen=3)'},
		{'in': ['list(minlen=3)', 'list(minlen=4)'], 'out': 'list(minlen=3)'},
		{'in': ['list(minlen=13)', 'list(minlen=4)'], 'out': 'list(minlen=4)'},
		{'in': ['string(minlen=3)', 'string(minlen=13)'], 'out': 'string(minlen=3)'},
		{'in': ['color', 'int'], 'out': 'color'}, // color includes all integers for now
	];
	cases.forEach(function(caseInfo, index) {
		// order of the union should give the same result so try both orders.
		for (let i = 0; i < 2; i++) {
			const in1 = caseInfo.in[i];
			const in2 = caseInfo.in[1 - i];
			const set1 = DataTypes.parse(in1);
			const set2 = DataTypes.parse(in2);
			const result = DataTypes.stringify(DataTypes.union(set1, set2));
			if (result !== caseInfo.out)
				logger(`Case ${index}, Expected ${caseInfo.out} but got ${result} for inputs ${in1} and ${in2}`);
		}
	});
};