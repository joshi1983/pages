import { populateTemplateUsingObject } from '../modules/populateTemplateUsingObject.js';

export function testPopulateTemplateUsingObject(logger) {
	const cases = [
		{
			'template': 'Hello $$_s_$$',
			'obj': {
				's': 'world'
			},
			'result': 'Hello world'
		},
		{
			'template': '$$_X_$$ $$_Y_$$',
			'obj': {
				'X': 'hello',
				'Y': 'world'
			},
			'result': 'hello world'
		},
		{
			'template': '$$_X_$$ $$_Y_$$ $$_z_$$',
			'obj': {
				'X': 'hello',
				'Y': 'world'
			},
			'result': 'hello world $$_z_$$'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const result = populateTemplateUsingObject(caseInfo.template, caseInfo.obj);
		if (result !== caseInfo.result)
			logger(`Test case index ${index} Failed. Expected "${caseInfo.result}" but got "${result}"`);
	});
};