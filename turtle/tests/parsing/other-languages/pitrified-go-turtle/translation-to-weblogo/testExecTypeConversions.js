import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecTypeConversions(logger) {
	const cases = [
		{'code': `import "fmt"
x:=2.3
fmt.Println(int(x))`, 'messages': ['2']},
	];
	processTranslateExecuteCases(cases, logger);
};