import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/pitrified-go-turtle/scanning/scan.js';

export function testScan(logger) {
	const cases = [{
		'code': 'package x',
		'tokens': [
			{'s': 'package',
			'colIndex': 6, 'lineIndex': 0},
			{'s': 'x', 'colIndex': 8, 'lineIndex': 0}
		]
	},{
		'code': 'td.SetColor(turtle.Green)',
		'tokens': ['td', '.', 'SetColor', '(', 'turtle', '.', 'Green', ')']
	},{
		'code': 'func dots(td *turtle.TurtleDraw) {',
		'tokens': ['func', 'dots', '(', 'td', '*', 'turtle', '.', 'TurtleDraw', ')', '{']
	},{
		'code': `t := turtle.New()
	fmt.Println("T:", t)`,
		'tokens': [
		't', ':=', 'turtle', '.', 'New', '(', ')',
		'fmt', '.', 'Println', '(', '"T:"', ',', 't', ')'
		]
	},{
		'code': `import (
	"fmt"
	"github.com/Pitrified/go-turtle"
)`,
		'tokens': ['import', '(', '"fmt"',
			'"github.com/Pitrified/go-turtle"', ')']
	},{
		'code': 'w := &World{',
		'tokens': ['w', ':=', '&', 'World', '{']
	},{
		'code': 'w:=&World{',
		'tokens': ['w', ':=', '&', 'World', '{']
	},{
		'code': 'err != nil',
		'tokens': ['err', '!=', 'nil']
	},{
		'code': 'err!=nil',
		'tokens': ['err', '!=', 'nil']
	},{
		'code': 'case <-w.closeCh:',
		'tokens': ['case', '<-', 'w', '.', 'closeCh', ':']
	},{
		'code': 'if y0 == y1 {',
		'tokens': ['if', 'y0', '==', 'y1', '{']
	},
	{
		'code': '//',
		'tokens': ['//']
	},
	{
		'code': '// single line comment',
		'tokens': ['// single line comment']
	},
	{
		'code': 'x=4//',
		'tokens': ['x', '=', '4', '//']
	},
	{
		'code': '/* and stop with the first subsequent character sequence */',
		'tokens': ['/* and stop with the first subsequent character sequence */']
	},
	{
		'code': 'dot(td, float64(10*i+120), 30, i)',
		'tokens': ['dot', '(', 'td', ',', 'float64', '(', '10', '*', 'i', '+', '120', ')', ',', '30', ',', 'i',')']
	},
	{
		'code': 'x &= 3',
		'tokens': ['x', '&=', '3']
	},
	{
		'code': 'x&=3',
		'tokens': ['x', '&=', '3']
	},
	{
		'code': 'x += 3',
		'tokens': ['x', '+=', '3']
	},
	{
		'code': 'x+=3',
		'tokens': ['x', '+=', '3']
	},
	{
		'code': 'x-=2',
		'tokens': ['x', '-=', '2']
	},
	{
		'code': 'x *= 3',
		'tokens': ['x', '*=', '3']
	},
	{
		'code': 'x*=3',
		'tokens': ['x', '*=', '3']
	},
	{
		'code': 'x /= 3',
		'tokens': ['x', '/=', '3']
	},
	{
		'code': 'x/=3',
		'tokens': ['x', '/=', '3']
	},
	{
		'code': 'if p.Size%2 == 0 {',
		'tokens': ['if', 'p', '.', 'Size', '%', '2', '==', '0', '{']
	},
	{
		'code': 'for i := -before; i <= half; i++ {',
		'tokens': ['for', 'i', ':=', '-', 'before', ';', 'i', '<=', 'half', ';', 'i', '++', '{']
	},
	{
		'code': '"Hello, 世界"',
		'tokens': ['"Hello, 世界"']
	},
	{
		'code': `const templateStr = \`
<html>\``,
		'tokens': ['const', 'templateStr', '=', `\`
<html>\``]
	},
	{
		'code': 'turtle.East',
		'tokens': ['turtle', '.', 'East']
	},
	{
		'code': 'map[byte]string',
		'tokens': ['map', '[', 'byte', ']', 'string']
	},
	{
		'code': "case '|':",
		'tokens': ['case', "'|'", ':']
	},
	{
		'code': '-1^3',
		'tokens': ['-1', '^', '3']
	},
	{
		'code': '...',
		'tokens': ['...']
	},
	{
		'code': '...i',
		'tokens': ['...', 'i']
	},
	{
		'code': '~int',
		'tokens': ['~', 'int']
	}
	];
	processScanTestCases(cases, scan, logger);
};