import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramFastPixels(logger) {
	const cases = [
	{'code': `to getColour :x :y
	output [:x * 255 / 100 :y * 255 / 100 0]
end

proceduralImage "getColour 100 100
print "hi`, 'messages': ['hi']}
	];
	processExecuterTestCases(cases, logger);
};