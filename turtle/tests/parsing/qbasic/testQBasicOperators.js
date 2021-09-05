import { QBasicOperators } from
'../../../modules/parsing/qbasic/QBasicOperators.js';

export function testQBasicOperators(logger) {
	const all = QBasicOperators.getAllOperatorsInfo();
	if (!(all instanceof Array))
		logger(`Expected getAllOperatorsInfo() to return an Array but found ${all}`);
	const multiplyInfo = QBasicOperators.getOperatorInfo('*');
	if (typeof multiplyInfo !== 'object')
		logger(`Expected to get information object for * operator but found ${multiplyInfo}`);
	if (!QBasicOperators.isOnlyUnary('not'))
		logger(`not should be isOnlyUnary but found a result of ${QBasicOperators.isOnlyUnary('not')}`);
	if (QBasicOperators.isOnlyUnary('-'))
		logger(`- should not be isOnlyUnary but found a result of ${QBasicOperators.isOnlyUnary('-')}`);
};