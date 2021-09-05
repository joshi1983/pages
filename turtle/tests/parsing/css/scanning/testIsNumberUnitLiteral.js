import { isNumberUnitLiteral } from
'../../../../modules/parsing/css/scanning/isNumberUnitLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsNumberUnitLiteral(logger) {
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
	{'in': '20rad', 'out': true}, // radians
	{'in': '20turn', 'out': true}, // turn is an angle unit in CSS.
	{'in': '20deg', 'out': true}, // degrees
	{'in': '34hz', 'out': true},
	{'in': '34Hz', 'out': true},
	{'in': '5s', 'out': true},
	{'in': '5ms', 'out': true},
	];
	testInOutPairs(cases, isNumberUnitLiteral, logger);
};