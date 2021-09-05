import { getSwitchValueName } from './getSwitchValueName.js';
import { processSwitchValue } from './processSwitchValue.js';
import { shouldSwitchValueBeStoredInVariable } from './shouldSwitchValueBeStoredInVariable.js';
import { shouldUseLocalmake } from '../operators/shouldUseLocalmake.js';
import { valueToLiteralCode } from '../../../../../valueToLiteralCode.js';

export function assignVariableIfNeeded(switchToken, result, settings) {
	if (shouldSwitchValueBeStoredInVariable(switchToken)) {
		const name = getSwitchValueName(switchToken).substring(1);
		let makeCommand = 'make';
		if (shouldUseLocalmake(switchToken))
			makeCommand = 'localmake';
		result.append(makeCommand + ' ' + valueToLiteralCode(name) + ' ');
		processSwitchValue(switchToken, result, settings);
		return name;
	}
};