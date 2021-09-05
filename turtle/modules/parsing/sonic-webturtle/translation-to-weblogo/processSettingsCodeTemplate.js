import { StringUtils } from '../../../StringUtils.js';

export function processSettingsCodeTemplate(code, settings) {
	const replacementPairs = [
	];
	if (settings.rememberStackVariableName !== undefined) {
		replacementPairs.push(['$$$REMEMBER_STACK_NAME$$$', settings.rememberStackVariableName]);
	}
	return StringUtils.replacePairs(code, replacementPairs);
};