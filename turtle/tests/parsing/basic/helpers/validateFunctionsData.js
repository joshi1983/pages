import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { QBasicInternalFunctions } from
'../../../../modules/parsing/basic/qbasic/QBasicInternalFunctions.js';
import { QBasicOperators } from
'../../../../modules/parsing/basic/qbasic/QBasicOperators.js';

function validateNames(functionInfo, logger) {
	if (functionInfo.names !== undefined) {
		if (!(functionInfo.names instanceof Array)) {
			logger(`names must either be undefined or an Array but found ${functionInfo.names}`);
			for (const name of functionInfo.names) {
				if (typeof name !== 'string') {
					logger(`Every element in names must be a string but found ${name}`);
				}
			}
		}
	}
}

function validateTo(functionInfo, logger) {
	if (functionInfo.to !== undefined) {
		if (typeof functionInfo.to !== 'string')
			logger(`to must either be undefined or a string but found ${functionInfo.to}`);
		else if (QBasicInternalFunctions.getFunctionInfo(functionInfo.to) === undefined)
			logger(`to should match a QBasic function but unable to find information for ${functionInfo.to}`);
	}
}

export function validateFunctionsData(functions, logger) {
	functions.forEach(function(functionInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, name=${functionInfo.name}`, logger);
		if (typeof functionInfo.name !== 'string')
			plogger(`name must be a string but found ${functionName.name}`);
		validateNames(functionInfo, plogger);
		validateTo(functionInfo, plogger);
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
		if (functionInfo.wrapAllParametersWithCurvedBrackets !== undefined) {
			const val = functionInfo.wrapAllParametersWithCurvedBrackets;
			if (typeof val !== 'boolean')
				plogger(`wrapAllParametersWithCurvedBrackets must either be undefined or a boolean but found ${val}`);
		}
		const prev = functions[index - 1];
		if (prev !== undefined && prev.name >= functionInfo.name)
			plogger(`functions should be sorted by name but a pair out of order. ${prev.name} and ${functionInfo.name}`);
	});
};