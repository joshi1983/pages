import { specialValues } from
'../../../../modules/parsing/basic/qbasic/stringToTokenType.js';

const badExamples = specialValues.slice();
badExamples.push(
'declare declare',
'defint sub',
'defint function',
'do while',
'do until',
'do loop',
`do
220 T = TIME - T
290 loop while not FALSE`,
'DO 180 count = 1',
'end def',
'end function',
'end if',
'end sub',
'function defint',
'function function',
'function sub',
'gosub function',
'gosub sub',
'goto',
'goto\n4',
'if false',
'if true',
`ifelse :y = "Y [
	goto
	1
] [
]`,
`100 PRINT "hi" 
IF x THEN 
	goto 100
ELSEif
 goto 200
end if`,
'loop while',
'loop until',
'function f',
'f)',
'palette 1', 
'screen 9\nline -(40,40)\npalette 1\nline -(100,100)', 
'screen 9\nline -(40,40)\npalette 1, 8, 12, 3, 4\nline -(100,100)', 
// wrong number of parameters to palette.

`select case x
case`,
`select case x
case 1
end select`,
`select case x
case 1 to
end select`,
`select case x
case 1 to print "hi"
end select`,
'sub sub',
`SUB sub()
    SELECT CASE curLevel`,
);

export { badExamples };
