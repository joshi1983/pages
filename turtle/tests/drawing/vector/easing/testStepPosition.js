import { StepPosition } from '../../../../modules/drawing/vector/easing/StepPosition.js';

export function testStepPosition(logger) {
	const result = StepPosition.parse('jumpStart');
	if (result !== 0)
		logger(`Expected 0 but got ${result}`);
	const options = StepPosition.getNames();
	if (!(options instanceof Array))
		logger(`getNames() expected to return an Array but got ${options}`);
	else {
		options.forEach(function(name, index) {
			if (typeof name !== 'string')
				logger(`Expected a string but got ${name} at index ${index}`);
		});
	}
	const name = StepPosition.getNameFor(StepPosition.JumpStart);
	if (name !== 'JumpStart')
		logger(`Expected JumpStart but got ${name}`);
};