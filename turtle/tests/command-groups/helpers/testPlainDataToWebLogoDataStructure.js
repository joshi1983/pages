import { plainDataToWebLogoDataStructure } from '../../../modules/command-groups/helpers/plainDataToWebLogoDataStructure.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testAtomicCases(logger) {
	const cases = [-1, 1, undefined, null, true, false, 'hi', ''];
	cases.forEach(function(caseInfo, index) {
		const result = plainDataToWebLogoDataStructure(caseInfo);
		if (result !== caseInfo)
			logger(`Case ${index}, expected ${caseInfo} but got ${result}`);
	});
	const nanResult = plainDataToWebLogoDataStructure(NaN);
	if (typeof nanResult !== 'number')
		logger(`Expected typeof plainDataToWebLogoDataStructure(NaN) to be number but got ${typeof nanResult}`);
	else if (('' + nanResult) !== 'NaN')
		logger(`Expected NaN but got ${nanResult}`);
}

function testWithArray(logger) {
	const result = plainDataToWebLogoDataStructure([]);
	if (!(result instanceof Array))
		logger(`Expected an Array but got ${result}`);
	else if (result.length !== 0)
		logger(`Expected the Array to be empty but got a length of ${result.length}`);
	const result2 = plainDataToWebLogoDataStructure([4]);
	if (!(result2 instanceof Array))
		logger(`Expected result2 to be an Array but got ${result2}`);
	else if (result2.length !== 1)
		logger(`Expected the Array to have a length of 1 but got a length of ${result2.length}`);
	else if (result2[0] !== 4)
		logger(`Expected result2[0] to be 4 but got ${result2[0]}`);
}

function testWithMap(logger) {
	const result = plainDataToWebLogoDataStructure({});
	if (!(result instanceof Map))
		logger(`Expected a Map but got ${result}`);
	const result2 = plainDataToWebLogoDataStructure({
		'x': 4
	});
	if (!(result2 instanceof Map))
		logger(`Expected a Map for result2 but got ${result2}`);
	else if (result2.get('x') !== 4) {
		logger(`Expected result2.get('x') to return 4 but got ${result2.get('x')}`);
	}
}

export function testPlainDataToWebLogoDataStructure(logger) {
	wrapAndCall([
		testAtomicCases,
		testWithArray,
		testWithMap
	], logger);
};