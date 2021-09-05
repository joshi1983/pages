import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecFor(logger) {
	const cases = [
	{'code': `package main
import (
	"fmt" 
)
func main() {
    for j := 0; j < 3; j++ {
        fmt.Println("hi")
    }
}`, 'messages': ['hi', 'hi', 'hi']},
	{'code': `package main
import (
	"fmt" 
)
func main() {
    for j := 2; j < 9; j*=2 {
        fmt.Println(j)
    }
}`, 'messages': ['2', '4', '8']},
	{'code': `package main
import (
	"fmt" 
)
func main() {
    for j := 1; j < 3; j++ {
        fmt.Println(j)
    }
}`, 'messages': ['1', '2']},
	{'code': `package main
import (
	"fmt" 
)
func main() {
    for j := 1; j < 3; ++j {
        fmt.Println(j)
    }
}`, 'messages': ['1', '2']},
	{'code': `package main
import (
	"fmt" 
)
func main() {
    for j := 0; j < 3; j++ {
        fmt.Println(j)
    }
}`, 'messages': ['0', '1', '2']},
	{'code': `package main

import "fmt"

func main() {
	x := 0
	for {
		fmt.Println(x)
		break
	}
	}`, 'messages': ['0']
	},
	{'code': `package main
import "fmt"
func main() {
	x := 0
	for {
		fmt.Println(x)
		x++;
		if x > 1 {
			break
		}
	}
}`, 'messages': ['0', '1']
	}
	];
	processTranslateExecuteCases(cases, logger);
};