import { isNumberLengthUnitLiteral } from
'../../../../modules/parsing/css/scanning/isNumberLengthUnitLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsNumberLengthUnitLiteral(logger) {
	const cases = [
	{'in': 'd', 'out': false},
	{'in': 'px', 'out': false},
	{'in': '%', 'out': false},
	{'in': 'dpx', 'out': false},
	{'in': '4', 'out': false},
	{'in': '-3', 'out': false},
	{'in': '-123', 'out': false},
	{'in': '3px', 'out': true},
	{'in': '123px', 'out': true},
	{'in': '-3px', 'out': true},
	{'in': '3%', 'out': true},
	{'in': '123%', 'out': true},
	{'in': '4em', 'out': true},
	{'in': '3rem', 'out': true},
	{'in': '123rem', 'out': true},
	{'in': '4vw', 'out': true},
	{'in': '4vh', 'out': true},
	{'in': '20rad', 'out': false}, // radians
	{'in': '20turn', 'out': false}, // turn is an angle unit in CSS.
	{'in': '20deg', 'out': false}, // degrees
	{'in': '34hz', 'out': false},
	{'in': '34Hz', 'out': false},
	{'in': '5s', 'out': false},
	{'in': '5ms', 'out': false},
	];
	testInOutPairs(cases, isNumberLengthUnitLiteral, logger);
};