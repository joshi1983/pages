import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Transparent } from
'../../../../../modules/Transparent.js';
import { valueToJavaScript } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/valueToJavaScript.js';

export function testValueToJavaScript(logger) {
	const cases = [
	{'in': undefined, 'out': 'undefined'},
	{'in': null, 'out': 'null'},
	{'in': true, 'out': 'true'},
	{'in': false, 'out': 'false'},
	{'in': 1, 'out': '1'},
	{'in': -1, 'out': '-1'},
	{'in': 3.14, 'out': '3.14'},
	{'in': [], 'out': '[]'},
	{'in': [1, 2, 3], 'out': '[1,2,3]'},
	{'in': new Map(), 'out': 'new Map()'},
	{'in': new Map([
		["x", 1], ["y", 2]
	]), 'out': 'new Map([["x",1],["y",2]])'},
	{'in': Transparent, 'out': 'this.Transparent'}
	];
	testInOutPairs(cases, valueToJavaScript, logger);
};