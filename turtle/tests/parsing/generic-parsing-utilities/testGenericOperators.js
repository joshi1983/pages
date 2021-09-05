import { fetchJson } from
'../../../modules/fetchJson.js';
import { GenericOperators } from
'../../../modules/parsing/generic-parsing-utilities/GenericOperators.js';
const data = await fetchJson('json/logo-migrations/processing/operators.json');

export function testGenericOperators(logger) {
	const operators = new GenericOperators(data);

	const opInfo = operators.getOperatorInfo('*');
	if (typeof opInfo !== 'object')
		logger(`Expected getOperatorInfo to return an object but got ${opInfo}`);

	const replacementsMap = operators.createReplacementsMap();
	if (!(replacementsMap instanceof Map))
		logger(`Expected createReplacementsMap() to return a Map but got ${replacementsMap}`);
		
	const allResult = operators.getAll();
	if (!(allResult instanceof Array))
		logger(`Expected all to return an Array but got ${allResult}`);
};