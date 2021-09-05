import { testGetIncrementAmountFromForToken } from './testGetIncrementAmountFromForToken.js';
import { testGetInitialValue } from './testGetInitialValue.js';
import { testGetLimitFromForToken } from './testGetLimitFromForToken.js';
import { testGetVariableNameFromForToken } from
'./testGetVariableNameFromForToken.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testForLoops(logger) {
	wrapAndCall([
		testGetIncrementAmountFromForToken,
		testGetInitialValue,
		testGetLimitFromForToken,
		testGetVariableNameFromForToken,
	], logger);
};