import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecFunc(logger) {
	const cases = [
	{'code': `package main
import (
	"fmt" 
)
func doubleNum(num int) int {
	return num * 2
}

func main() {
	fmt.Println(doubleNum(3))
	}`, 'messages': ['6']},
	{'code': `import "fmt"

func sum(x int,y int) {
	// We want to test that this "sum" function doesn't translate to a problematic WebLogo procedure.
	// WebLogo has a "sum" command so this can't be translated to a "sum" procedure without getting confused with the command.
	return x + y
}

func main() {
	fmt.Println(sum(4,5))
}`, 'messages': ['9']}
	];
	processTranslateExecuteCases(cases, logger);
};