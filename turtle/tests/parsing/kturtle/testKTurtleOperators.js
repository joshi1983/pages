import { KTurtleOperators } from '../../../modules/parsing/kturtle/KTurtleOperators.js';

export function testKTurtleOperators(logger) {
	const info = KTurtleOperators.getOperatorInfo('*');
	if (typeof info !== 'object')
		logger(`Expected to find operator info object but got ${info}`);
	else if (info.to !== '*')
		logger(`Expected operator * to translate to * but got ${info.to}`);
};