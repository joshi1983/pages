import { asyncProcessExecuterTestCase } from './asyncProcessExecuterTestCase.js';

let urlBase = document.location.href;
if (urlBase.indexOf('test.html') !== -1) {
	const index = urlBase.indexOf('test.html');
	urlBase = urlBase.substring(0, index);
}
if (!urlBase.endsWith('/'))
	urlBase += '/';

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
	}
	];
	cases.forEach(function(caseInfo, index) {
		asyncProcessExecuterTestCase(caseInfo, index, logger);
	});
};