import { isNumber } from
'../../../../modules/isNumber.js';

export function processGeneralPRGenerator(generator, logger) {
	const result = generator.randomRatio();
	if (!isNumber(result))
		logger(`Expected result from randomRatio() to be a number but got ${result}`);
	else if (result < 0 || result > 1)
		logger(`Expected result from randomRatio() to be between 0 and 1 but got ${result}`);
};