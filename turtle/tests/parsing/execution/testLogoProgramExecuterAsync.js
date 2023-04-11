import { asyncProcessExecuterTestCase } from './asyncProcessExecuterTestCase.js';

export function testLogoProgramExecuterAsync(logger) {
	const cases = [
	{
		'code': `print 4`,
		'messages': ['4']
	},
	{
		'code': `make "data
readJson 'json/commands.json'
make "firstCommand item 1 :data
print getProperty :firstCommand "primaryName`,
		'messages': ['abs']
	}
	];
	cases.forEach(function(caseInfo, index) {
		asyncProcessExecuterTestCase(caseInfo, index, logger);
	});
};