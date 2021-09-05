import { DataTypes } from
'../../../modules/parsing/data-types/DataTypes.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedHasIntersectionWith(types1, types2) {
	return new DataTypes(types1).hasIntersectionWith(new DataTypes(types2));
}

export function testDataTypesHasIntersectionWith(logger) {
	const cases = [
		{
			'inArgs': ['bool', 'num'], 'out': false
		},
		{
			'inArgs': ['int', 'num'], 'out': true
		},
		{
			'inArgs': ['color', 'num'], 'out': true
		},
		{
			'inArgs': ['alphacolor', 'num'], 'out': true
		},
		{
			'inArgs': ['alphacolor', 'list'], 'out': true
		},
		{
			'inArgs': ['list', 'num'], 'out': false
		},
		{
			'inArgs': ['string', 'num'], 'out': false
		},
		{
			'inArgs': ['cproc', 'cproc:0'], 'out': true
		},
		{
			'inArgs': ['cproc:1', 'cproc:0'], 'out': false
		},
		{
			'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=int)'], 'out': true
		},
		{
			'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=bool)'], 'out': false
		},
		{
			'inArgs': ['cproc:0(returntypes=num)', 'cproc:0(returntypes=bool)'], 'out': false
		},
		{
			'inArgs': ['cproc:2(returntypes=int)', 'cproc:2(returntypes=bool)'], 'out': false
		}
	];
	// add cases to test in the opposite direction because
	// we expect the same return value either direction.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		cases.push({
			'inArgs': caseInfo.inArgs.slice().reverse(),
			'out': caseInfo.out
		});
	}
	testInOutPairs(cases, wrappedHasIntersectionWith, logger);
};