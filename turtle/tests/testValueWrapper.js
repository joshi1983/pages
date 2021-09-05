import { ValueWrapper } from '../modules/ValueWrapper.js';

export function testValueWrapper(logger) {
	let val = null;
	const valWrapper = new ValueWrapper(function() {
		return val;
	}, function(newVal) {
		val = newVal;
	});
	if (valWrapper.read() !== null)
		logger('valWrapper.read() expected to return null but got ' + valWrapper.read());
	valWrapper.write(4);
	if (valWrapper.read() !== 4)
		logger('valWrapper.read() expected to return 4 but got ' + valWrapper.read());	
	if (val !== 4)
		logger('val expected to return 4 but got ' + val);
	val = 3;
	if (valWrapper.read() !== 3)
		logger('valWrapper.read() expected to return 3 but got ' + valWrapper.read());	
};