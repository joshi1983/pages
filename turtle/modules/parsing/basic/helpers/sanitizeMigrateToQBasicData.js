import { QBasicInternalFunctions } from
'../qbasic/QBasicInternalFunctions.js';

export function sanitizeMigrateToQBasicData(migrationData) {
	if (migrationData.functions !== undefined) {
		for (const funcData of migrationData.functions) {
			if (funcData.to !== undefined && funcData.args === undefined &&
			funcData.argCount === undefined) {
				const qbasicFuncInfo = QBasicInternalFunctions.getFunctionInfo(funcData.to);
				if (qbasicFuncInfo !== undefined) {
					if (qbasicFuncInfo.argCount !== undefined)
						funcData.argCount = qbasicFuncInfo.argCount;
					else if (qbasicFuncInfo.args !== undefined)
						funcData.args = qbasicFuncInfo.args;
					if (typeof qbasicFuncInfo.isStatement === 'boolean' &&
					funcData.isStatement === undefined)
						funcData.isStatement = qbasicFuncInfo.isStatement;
				}
			}
		}
	}
}