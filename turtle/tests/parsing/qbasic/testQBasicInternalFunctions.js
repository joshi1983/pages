import { QBasicInternalFunctions } from
'../../../modules/parsing/qbasic/QBasicInternalFunctions.js';

export function testQBasicInternalFunctions(logger) {
	const printInfo = QBasicInternalFunctions.getFunctionInfo('print');
	if (typeof printInfo !== 'object')
		logger(`Expected to get an object for information about the internal print subroutine in QBasic but found ${printInfo}`);
	else {
		if (printInfo.returnTypes === undefined)
			logger(`returnTypes should not be undefined.  It should be null.  ` +
			`This is expected to get set by sanitizeMigrationInfo because ` +
			`QBasic's print subroutine translates to WebLogo's print command which has returnTypes set to null.`);
	}
};