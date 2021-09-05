import { PythonFunctions } from
'../../../../modules/parsing/other-languages/python/PythonFunctions.js';

export function testPythonFunctions(logger) {
	for (const className of ['math', 'numpy']) {
		const piInfo = PythonFunctions.getFunctionInfo('pi', className);
		if (typeof piInfo !== 'object') {
			logger(`Expected ${className}.pi to match information object but found ${piInfo}`);
		}
	}
};