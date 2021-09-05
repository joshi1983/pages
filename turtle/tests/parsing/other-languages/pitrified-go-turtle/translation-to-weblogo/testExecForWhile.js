import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecForWhile(logger) {
	const cases = [
	{'code': `package main
import (
	"fmt" 
)
func main() {
	x := 0
	for x < 2 {
		fmt.Println(x)
		x++
	}
	}`, 'messages': ['0', '1']}
	];
	processTranslateExecuteCases(cases, logger);
};