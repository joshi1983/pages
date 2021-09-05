import { SonicWebTurtleOperators } from '../../../modules/parsing/sonic-webturtle/SonicWebTurtleOperators.js';

export function testSonicWebTurtleOperators(logger) {
	const info = SonicWebTurtleOperators.getOperatorInfo('*');
	if (typeof info !== 'object')
		logger(`Expected info for * to be an object but got ${info}`);
};