import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { QBasicInternalFunctions } from
'../../../../modules/parsing/basic/qbasic/QBasicInternalFunctions.js';
import { QBasicOperators } from
'../../../../modules/parsing/basic/qbasic/QBasicOperators.js';

export function validateFunctionsData(functions, logger) {
	functions.forEach(function(functionInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, name=${functionInfo.name}`, logger);
		if (functionInfo.to !== undefined) {
			if (typeof functionInfo.to !== 'string')
				plogger(`to must either be undefined or a string but found ${functionInfo.to}`);
			else if (QBasicInternalFunctions.getFunctionInfo(functionInfo.to) === undefined)
				plogger(`to should match a QBasic function but unable to find information for ${functionInfo.to}`);
		}
		if (functionInfo.migrateToOperator !== undefined) {
			if (typeof functionInfo.migrateToOperator !== 'string')
				plogger(`migrateToOperator must either be undefined or a string but found ${functionInfo.migrateToOperator}`);
			else if (QBasicOperators.getOperatorInfo(functionInfo.migrateToOperator) === undefined) {
				plogger(`migrateToOperator should match a QBasic operator but unable to find information for ${functionInfo.migrateToOperator}`);
			}
		}
		if (functionInfo.removeInMigration !== undefined) {
			if (typeof functionInfo.removeInMigration !== 'boolean')
				plogger(`removeInMigration must either be boolean or undefined but found ${functionInfo.removeInMigration}`);
			else if (functionInfo.removeInMigration === true) {
				if (functionInfo.args === undefined &&
				functionInfo.argCount === undefined)
					plogger(`When removeInMigration is true, argCount or args must be specified.  It is important to know how many parameters to remove with the function call token.`);
			}
		}
		const prev = functions[index - 1];
		if (prev !== undefined && prev.name >= functionInfo.name)
			plogger(`functions should be sorted by name but a pair out of order. ${prev.name} and ${functionInfo.name}`);
	});
};