import { ArrayUtils } from '../ArrayUtils.js';

function sanitize2Args(commandInfo, checkInfo) {
	checkInfo.arg1Index = ArrayUtils.indexOfMatch(
		commandInfo.args, (argInfo) => argInfo.name === checkInfo.arg1);
	checkInfo.arg2Index = ArrayUtils.indexOfMatch(
		commandInfo.args, (argInfo) => argInfo.name === checkInfo.arg2);
}

export function sanitizeCompositeValidation(commandInfo) {
	if (commandInfo.compositeValidation instanceof Array) {
		commandInfo.compositeValidation.forEach(function(checkInfo) {
			if (checkInfo.type === 'equalLengthList' ||
			checkInfo.type === 'notEqual')
				sanitize2Args(commandInfo, checkInfo);
		});
	}
};