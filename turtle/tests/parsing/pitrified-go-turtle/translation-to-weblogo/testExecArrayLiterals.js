import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecArrayLiterals(logger) {
	const cases = [
	{'code': `package main

import "fmt"

func main() {
	fmt.Println(make([]int,4))
}`, 'messages': ['[0 0 0 0]']
	},{
		'code': `package main

import "fmt"

func main() {
	var a [2]int

	fmt.Println(a[1])
}`, 'messages': ['0']
	},{
		'code': `package main

import "fmt"

func main() {
	var a = []int{10, 20}
	
	fmt.Println(a[0])
	fmt.Println(a[1])
}`, 'messages': ['10', '20']
	},{'code': `package main

import "fmt"

func main() {
	var a = []int{10}
	a[0] = 123
	fmt.Println(a[0])
}`, 'messages': ['123']
	},{'code': `package main

import "fmt"

func main() {
	var a = []int{10, 20, 30, 40}
	fmt.Println(len(a))
}`, 'messages': ['4']
	},{'code': `package main

import "fmt"

func main() {
	var a = [...]int{10, 20, 30, 40}
	fmt.Println(len(a))
}`, 'messages': ['4']
	},{'code': `package main

import "fmt"

func main() {
	var a = []int{10}
	a[0]++
	fmt.Println(a[0])
}`, 'messages': ['11']}];
	processTranslateExecuteCases(cases, logger);
};