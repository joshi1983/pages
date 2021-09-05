import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
await DataTypes.asyncInit();

export function testDataTypesMayBeCompatibleWithValue(logger) {
	const cases = [
	{'types': 'int', 'val': 4, 'out': true},
	{'types': 'int', 'val': 4.3, 'out': false},
	{'types': 'num', 'val': 4, 'out': true},
	{'types': 'num', 'val': 4.4, 'out': true},
	{'types': 'bool', 'val': 4, 'out': false},
	{'types': 'string', 'val': 4, 'out': false},
	{'types': 'string', 'val': [], 'out': false},
	{'types': 'string', 'val': "hi", 'out': true},
	{'types': 'list', 'val': [], 'out': true},
	{'types': 'cproc', 'val': 'p', 'out': true}, // yes, if there is a procedure named p.
	{'types': 'cproc', 'val': 'red', 'out': true}, // yes, if there is a procedure named red.
	{'types': 'cproc', 'val': '#fff', 'out': false},
	{'types': 'colorstring', 'val': ['red'], 'out': false},
	{'types': 'colorstring', 'val': 'red', 'out': true},
	{'types': 'colorlist', 'val': ['red'], 'out': false},
	{'types': 'colorlist', 'val': [0, 100, 200], 'out': true},
	{'types': 'list<num>', 'val': ['red'], 'out': false},
	{'types': 'list<list<num>>', 'val': [], 'out': true},
	{'types': 'list<list<num>(minlen=2)>', 'val': [], 'out': true},
	{'types': 'list<list<list<num>(minlen=2)>(minlen=2)>', 'val': [], 'out': true},
	{'types': 'list<num>(minlen=2)', 'val': [0, 100], 'out': true},
	{'types': 'list<list<num>(minlen=2)>(minlen=2)', 'val': [], 'out': false},
	{'types': 'list<list<num>(minlen=2)>(minlen=2)', 'val': [[0, 100]], 'out': false},
	{'types': 'list<list<num>(minlen=2)>(minlen=2)', 'val': [[0, 100], [100, 100]], 'out': true},
	{'types': 'list<list<list<num>(minlen=2)>(minlen=2)>', 'val': [[[0, 100], [100, 100]]], 'out': true},
	{'types': 'list<list<list<num>>>', 'val': [], 'out': true},
	{'types': 'colorlist', 'val': [0, 0, 0], 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const types = new DataTypes(caseInfo.types);
		const result = types.mayBeCompatibleWithValue(caseInfo.val);
		if (result !== caseInfo.out) {
			logger(`Case ${index}, expected ${caseInfo.out} but got ${result}`);
		}
	});
};