import { testCommandJSONForConsistencyAndValidity } from './testCommandJSONForConsistencyAndValidity.js';
import { testCommandJSONForDuplicates } from './testCommandJSONForDuplicates.js';
import { testCommandsJSONCallNoArgumentCommands } from './testCommandsJSONCallNoArgumentCommands.js';
import { testCommandsJSONCompositeValidation } from './testCommandsJSONCompositeValidation.js';
import { testCommandsJSONDataTypes } from './testCommandsJSONDataTypes.js';
import { testCommandsJSONDescription } from './testCommandsJSONDescription.js';
import { testCommandsJSONExtraArgsInfo } from './testCommandsJSONExtraArgsInfo.js';
import { testCommandsJSONHyperlinks } from './testCommandsJSONHyperlinks.js';
import { testCommandsJSONLengthRangeInfo } from './testCommandsJSONLengthRangeInfo.js';
import { testCommandsJSONOrderByPrimaryName } from './testCommandsJSONOrderByPrimaryName.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testCommandsJSON(logger) {
	wrapAndCall([
		testCommandJSONForConsistencyAndValidity,
		testCommandJSONForDuplicates,
		testCommandsJSONCallNoArgumentCommands,
		testCommandsJSONCompositeValidation,
		testCommandsJSONDataTypes,
		testCommandsJSONDescription,
		testCommandsJSONExtraArgsInfo,
		testCommandsJSONHyperlinks,
		testCommandsJSONLengthRangeInfo,
		testCommandsJSONOrderByPrimaryName
	], logger);
};