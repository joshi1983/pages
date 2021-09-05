import { PythonOperators } from '../../../modules/parsing/python-parsing/PythonOperators.js';

export function testPythonOperators(logger) {
	const info = PythonOperators.getOperatorInfo('*');
	if (typeof info !== 'object') {
		logger(`Expected info to be an object but found ${info}`);
	}
};