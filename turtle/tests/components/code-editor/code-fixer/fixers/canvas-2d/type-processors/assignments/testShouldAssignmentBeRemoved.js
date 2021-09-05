import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { shouldAssignmentBeRemoved } from
'../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/shouldAssignmentBeRemoved.js';
import { testInOutPairs } from
'../../../../../../../helpers/testInOutPairs.js';

function countShouldAssignmentBeRemoved(code) {
	const parseResult = parse(code);
	return flatten(parseResult.root).filter(shouldAssignmentBeRemoved).length;
}

export function testShouldAssignmentBeRemoved(logger) {
	const cases = [
	{'in': '', 'out': 0},
	{'in': 'x = 4', 'out': 0},
	{'in': 'y = "hi";', 'out': 0},
	{'in': 'const y = document.getElementsByTagName("p");', 'out': 1},
	{'in': 'const y = document.getElementById("hi");', 'out': 1},
	{'in': 'let y = document.getElementById("hi");', 'out': 1},
	{'in': 'var y = document.getElementById("hi");', 'out': 1},
	{'in': 'y = document.getElementById("hi");', 'out': 1},
	{'in': 'const y = document.getElementById("hi"), x = document.getElementById("yo");', 'out': 2},
	{'in': 'const y = canvas.getContext("2d");', 'out': 1},
	{'in': 'let y = canvas.getContext("2d");', 'out': 1},
	{'in': 'var y = canvas.getContext("2d");', 'out': 1},
	];
	testInOutPairs(cases, countShouldAssignmentBeRemoved, logger);
};