import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecIota(logger) {
	const cases = [
	{'code': `package main

import "fmt"

func main() {
	const (
		x = iota
		y = iota
	)
	fmt.Println(x, y)
}`, 'messages': ['0 1']}
	];
	processTranslateExecuteCases(cases, logger);
};