import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecGoTurtle(logger) {
	const cases = [
	{'code': `package main
import (
	"fmt" 
	"github.com/Pitrified/go-turtle"
)
func main() {
	t := turtle.New()
	fmt.Println(t.X)
	}`, 'messages': ['0']
	},	{'code': `package main
import (
	"fmt" 
	"github.com/Pitrified/go-turtle"
)
func main() {
	t := turtle.New()
	fmt.Println(t.Y)
	fmt.Println(t.Deg)
	}`, 'messages': ['0', '0']
	},	{'code': `package main
import (
	"fmt" 
	"github.com/Pitrified/go-turtle"
)
func main() {
	t := turtle.New()
	t.Forward(100)
	fmt.Println(t.X)
	fmt.Println(t.Y)
	}`, 'messages': ['0', '100']
	}];
	processTranslateExecuteCases(cases, logger);
};