/*
These tests should not overlap coverage from testCommands.js 
which runs all automated test cases from json/commands.json.

These tests are covering cases that can't be expressed in JSON.
The cases may verify side-effects or other requirements instead of the output values.
*/
import { testArrayCommands } from './testArrayCommands.js';
import { testEasingCommands } from './testEasingCommands.js';
import { testHelpers } from './helpers/testHelpers.js';
import { testListCommands } from './testListCommands.js';
import { testMath } from './testMath.js';
import { testPropertyListCommands } from './testPropertyListCommands.js';
import { testTurtle } from './testTurtle.js';
import { testTurtleLineCommands } from './testTurtleLineCommands.js';
import { testTurtlePenCommands } from './testTurtlePenCommands.js';
import { testTurtlePosCommands } from './testTurtlePosCommands.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testCommandGroups(logger) {
	wrapAndCall([
		testArrayCommands,
		testEasingCommands,
		testHelpers,
		testListCommands,
		testMath,
		testPropertyListCommands,
		testTurtle,
		testTurtleLineCommands,
		testTurtlePenCommands,
		testTurtlePosCommands
	], logger);
};