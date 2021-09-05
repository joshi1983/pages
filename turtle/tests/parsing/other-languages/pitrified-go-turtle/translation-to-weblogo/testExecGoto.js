import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecGoto(logger) {
	/*
	Support for goto is very limited in the translator so these cases are covering only some of the easiest
	cases to get working.
	*/
	const cases = [{
	'code': `package main

import "fmt"

func main() {
	if true {
		goto endLabel
	}
	fmt.Println("Hi")
endLabel:
}`, 'messages': []},
{
	'code': `package main

import "fmt"

func main() {
	if false {
		goto endLabel
	}
	fmt.Println("Hi")
endLabel:
}`, 'messages': ["Hi"]},
{'code': `package main

import "fmt"

func main() {
	x := 0
someLabel:
	fmt.Println("Hi")
	x++
	if x < 2 {
		goto someLabel
	}
}`, 'messages': ["Hi", "Hi"]}
	];
	processTranslateExecuteCases(cases, logger);
};