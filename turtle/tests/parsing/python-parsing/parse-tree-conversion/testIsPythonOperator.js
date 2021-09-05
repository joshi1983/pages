import { isPythonOperator } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/isPythonOperator.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsPythonOperator(logger) {
	const cases = [
	{'in': '++', 'out': false},
	{'in': '--', 'out': false},
	{'in': '<>', 'out': false}, // <> is a WebLogo operator but not an operator in Python.
	{'in': '>', 'out': true},
	{'in': '<', 'out': true},
	{'in': '<=', 'out': true},
	{'in': '>=', 'out': true},
	{'in': '==', 'out': true},
	{'in': '!=', 'out': true},
	{'in': '+', 'out': true},
	{'in': '-', 'out': true},
	{'in': '*', 'out': true},
	{'in': '/', 'out': true},
	{'in': '%', 'out': true},
	{'in': '//', 'out': true},
	{'in': '**', 'out': true},
	{'in': '%', 'out': true},
	{'in': '^', 'out': true},
	{'in': '&', 'out': true},
	{'in': '|', 'out': true},
	{'in': 'and', 'out': true},
	{'in': 'or', 'out': true},
	];
	testInOutPairs(cases, isPythonOperator, logger);
};