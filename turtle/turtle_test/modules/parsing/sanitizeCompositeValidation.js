import { ArrayUtils } from '../ArrayUtils.js';

function sanitizeEqualLengthList(commandInfo, equalLengthListInfo) {
	equalLengthListInfo.arg1Index = ArrayUtils.indexOfMatch(
		commandInfo.args, (argInfo) => argInfo.name === equalLengthListInfo.arg1);
	equalLengthListInfo.arg2Index = ArrayUtils.indexOfMatch(
		commandInfo.args, (argInfo) => argInfo.name === equalLengthListInfo.arg2);
}

export function sanitizeCompositeValidation(commandInfo) {
	if (commandInfo.compositeValidation instanceof Array) {
		commandInfo.compositeValidation.forEach(function(checkInfo) {
			if (checkInfo.type === 'equalLengthList')
				sanitizeEqualLengthList(commandInfo, checkInfo);
		});
	}
};