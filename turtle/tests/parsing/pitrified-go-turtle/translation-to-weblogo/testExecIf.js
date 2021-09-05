import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecIf(logger) {
	const cases = [
	{'code': `package main

import "fmt"

func main() {
	if true {
		fmt.Println("hi")
	}
}`, 'messages': ['hi']},
	{'code': `package main

import "fmt"

func main() {
	if false {
		fmt.Println("hi")
	}
}`, 'messages': []}
	];
	processTranslateExecuteCases(cases, logger);
};