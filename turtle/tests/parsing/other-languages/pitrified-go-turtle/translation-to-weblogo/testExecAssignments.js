import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecAssignments(logger) {
	const cases = [
		{'code': `import "fmt"
x:=2
fmt.Println(x)`, 'messages': ['2']},
		{'code': `import "fmt"
func main() {
var x int = 20
fmt.Println(x)
}`, 'messages': ['20']},
		{'code': `import "fmt"
func main() {
const x int = 20
fmt.Println(x)
}`, 'messages': ['20']}
	];
	processTranslateExecuteCases(cases, logger);
};