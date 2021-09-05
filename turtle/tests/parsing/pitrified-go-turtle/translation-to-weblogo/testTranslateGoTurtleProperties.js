import { translatePitrifiedGoTurtleToWebLogo } from
'../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateGoTurtleProperties(logger) {
	const cases = [
		{'in': `package main
import (
	"fmt" 
	"github.com/Pitrified/go-turtle"
)
func main() {
	t := turtle.New()
	fmt.Println(t.X)
	}`, 'outContains': 'print xCor'
	}
	];
	testInOutPairs(cases, translatePitrifiedGoTurtleToWebLogo, logger);
};