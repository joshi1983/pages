import { asyncProcessExecuterTestCase } from './asyncProcessExecuterTestCase.js';
import { getUrlBase } from '../../../modules/getUrlBase.js';

let urlBase = getUrlBase();

export function testLogoProgramExecuterAsync(logger) {
	const cases = [
	{
		'code': `print 4`,
		'messages': ['4']
	},
	{
		'code': `make "data
readJson '${urlBase}json/commands.json'
make "firstCommand item 1 :data
print getProperty "firstCommand "primaryName`,
		'messages': ['abs']
	},
	{'code': `animation.image 100 100 '${urlBase}tests/data/format-classification/test2.gif' 0.5\nprint "hi`,
		'messages': ['hi']
	}
	];
	cases.forEach(function(caseInfo, index) {
		asyncProcessExecuterTestCase(caseInfo, index, logger);
	});
};