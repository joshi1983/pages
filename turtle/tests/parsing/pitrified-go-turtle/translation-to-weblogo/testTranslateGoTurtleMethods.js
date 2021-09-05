import { translatePitrifiedGoTurtleToWebLogo } from
'../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateGoTurtleMethods(logger) {
	const cases = [
		{'in': `package main
import "github.com/Pitrified/go-turtle"
func main() {
	t := turtle.New()
	t.Forward(5)
	}`, 'outContains': 'forward 5'
	},
	{'in': `package main
import "github.com/Pitrified/go-turtle"
func main() {
	t := turtle.New()
	t.SetPos(1,2)
	}`, 'outContains': 'jumpTo [ 1 2 ]'
	},
	{'in': `package main
import "github.com/Pitrified/go-turtle"
func main() {
	t := turtle.New()
	t.Left(45)
	}`, 'outContains': 'left 45'
	},
	{'in': `package main
import "fmt"
func main() {
	fmt.Println(intAbs(-3))
	}`, 'outContains': 'abs -3'
	} // intAbs might be implemented in Go Turtle.
	];
	testInOutPairs(cases, translatePitrifiedGoTurtleToWebLogo, logger);
};