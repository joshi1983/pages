import { processTranslationTestCase } from './processTranslationTestCase.js';

export function testDiscardedCodeTranslation(logger) {
	const cases = [
		{'in': 'speed(1)', 'out': ''}, // We don't want any calls to speed in WebLogo.
		{'in': '\nimport turtle', 'out': ''},
		{'in': 'from turtle import *', 'out': ''},
		{'in': 'skk = turtle.Turtle()', 'out': ''},
		{'in': 'import turtle\nskk = turtle.Turtle()', 'out': ''},
		{'in': 'import turtle\nskk = turtle.Turtle()\nturtle.done()', 'out': ''},
		{'in': 'import random\nprint ("T .")', 'out': 'print \'T .\''},
		{'in': `import turtle   #Outside_In
import turtle
import time
import random
 
print ("This program")`,
			'out': ';Outside_In\n\nprint \'This program\''
		},
		{'in': `# Python program to user input pattern
# using Turtle Programming
import turtle   #Outside_In
import turtle
import time
import random
 
print ("This program")
num_str = input("Enter the side number of the shape you want to draw: ")
if num_str.isdigit():
    squares = int(num_str)

`,
			'outStartsWith': '; Python program to user input pattern\n; using Turtle Programming\n;Outside_In\n\nprint \'This program\''
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTranslationTestCase(caseInfo, logger);
	});
};