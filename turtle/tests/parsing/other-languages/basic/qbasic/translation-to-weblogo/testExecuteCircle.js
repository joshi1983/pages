import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteCircle(logger) {
	const cases = [
	{
		'code': `screen 7
CIRCLE (320, 100), 200
print "hi"`,
		'messages': ['hi'],
		'shapes': [{'className': 'CircleShape', 'radius': 200}]
	},
	{
		'code': `screen 7
CIRCLE step(10, 20), 100
print "hi"`,
		'messages': ['hi'],
		'shapes': [{'className': 'CircleShape', 'radius': 100}]
	}
	];
	processTranslateExecuteCases(cases, logger);
};