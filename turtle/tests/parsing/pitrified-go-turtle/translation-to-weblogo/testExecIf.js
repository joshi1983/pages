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
}`, 'messages': []},
	{'code': `package main

import "fmt"

func main() {
	if false {
		fmt.Println("hi")
	} else {
		fmt.Println("yo")
	}
}`, 'messages': ['yo']},
	{'code': `package main

import "fmt"

func main() {
	if true {
		fmt.Println("hi")
	} else {
		fmt.Println("yo")
	}
}`, 'messages': ['hi']}
	];
	processTranslateExecuteCases(cases, logger);
};