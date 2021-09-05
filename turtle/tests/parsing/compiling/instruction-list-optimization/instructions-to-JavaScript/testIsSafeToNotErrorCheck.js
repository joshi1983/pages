import { isSafeToNotErrorCheck } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/isSafeToNotErrorCheck.js';

function mockErrorCheckFunction(val) {
	return val; // never throws an exception indicating an error
}

export function testIsSafeToNotErrorCheck(logger) {
	const cases = [
	{'code': 'context.readVariable("x")', 'out': false}, // variable references are unsafe.
	{'code': 'context.globalVariables.get("x")', 'out': false}, // variable references are unsafe.
	{'code': '4', 'out': true},
	{'code': '-4', 'out': true},
	{'code': '3.14', 'out': true},
	{'code': '"hi"', 'out': true},
	{'code': '[]', 'out': true},
	{'code': '[4]', 'out': true},
	{'code': '["hi"]', 'out': true},
	{'code': '[1, 3, "hi"]', 'out': true},
	{'code': '[1, 2, 3, []]', 'out': true},
	{'code': '[context.readVariable("x")]', 'out': false},
	{'code': '[1, 2, 3, [context.globalVariables.get("x")]]', 'out': false},
	];
	cases.forEach(function(caseInfo, index) {
		const result = isSafeToNotErrorCheck(caseInfo.code, mockErrorCheckFunction);
		if (result !== caseInfo.out)
			logger(`Case ${index}, code=${caseInfo.code}.  Expected ${caseInfo.out} but got ${result}`);
	});
};