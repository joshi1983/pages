import { PythonFunctions } from
'../../../../modules/parsing/other-languages/python/PythonFunctions.js';

export function testPythonFunctions(logger) {
	const mathPiInfo = PythonFunctions.getFunctionInfo('pi', 'math');
	if (typeof mathPiInfo === 'object') {
		if (mathPiInfo.className !== 'math')
			logger(`Expected math.pi to match information with a className of math but found className ${mathPiInfo.className}`);
	}
	else
		logger(`Unable to find info for name pi and className math`);

	const numpyPiInfo = PythonFunctions.getFunctionInfo('pi', 'numpy');
	if (typeof numpyPiInfo === 'object') {
		if (numpyPiInfo.className !== 'numpy')
			logger(`Expected numpy.pi to match information with a className of numpy but found className ${numpyPiInfo.className}`);
	}
	else
		logger(`Unable to find info for name pi and className numpy`);
};