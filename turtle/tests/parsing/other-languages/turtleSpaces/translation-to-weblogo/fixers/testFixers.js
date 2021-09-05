import { testForeachFixer } from
'./testForeachFixer.js';
import { testRepAboveFixer } from
'./testRepAboveFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFixers(logger) {
	wrapAndCall([
		testForeachFixer,
		testRepAboveFixer
	], logger);
};