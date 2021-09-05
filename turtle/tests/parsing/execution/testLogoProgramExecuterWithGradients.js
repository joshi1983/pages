import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterWithGradients(logger) {
	const cases = [
		{'code': `make "colorStops createPList
	setProperty "colorStops 0 "red
	setProperty "colorStops 1 "blue
	setFillGradient createRadialGradient pos 100 :colorStops
print 1`, 'messages': ['1']},
		{'code': `make "colorStops createPList
	setProperty "colorStops 0 "red
	setProperty "colorStops 1 transparent
	setFillGradient createRadialGradient pos 100 :colorStops
print 1`, 'messages': ['1']},
		{'code': `make "fromPos pos
make "colorStops createPList
setProperty "colorStops 0 "red
setProperty "colorStops 1 ["black easeEase]
forward 100
setFillGradient createLinearGradient :fromPos pos :colorStops "pad
circle 100\nprint 1`, 'messages': ['1']}
	];
	processExecuterTestCases(cases, logger);
};