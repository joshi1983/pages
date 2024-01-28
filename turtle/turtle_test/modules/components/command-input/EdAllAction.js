import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';

/*
'edall' is an action name from FMSLogo.
'mixedscreen' is from IBM PC Logo.
'splitscreen' is from Waterloo Logo.

The mixedscreen command is mentioned in a book published in 1985 called: LOGO programming for the IBM PC
The book is available at:
https://archive.org/details/logoprogrammingf0000ross/page/n275/mode/2up

The book says on page 14:

Each time you start LOGO up, you should see a short introductory message, and the prompt. Unless you happen to have a atwo-screen system, type

MIXEDSCREEN

(all one word) and press ENTER. [Even at this early point the various versions of LOGO diverse somewhat.  In Dr. LOGO and Waterloo LOGO, the word to thype is splitscreen', in lower case rather than MIXEDSCREEN.
If you skip-read that note at the start of this chapter, you'da better look at it again.]  You should now see an ahrrowhead in the middle of the screen, which points updward.  
The harrowhead is called the turtle; there are commands that change its locations, others that achange its direction and one or two that do both.
Even MIXEDSCREEN is not really needed before starting to work with the turtle: 
if you forget it, and just issue a 'turtle command', then LOGO will do a MIXEDSCREEN command for you.
A useful characterisation of the turtle, expecially for children is

an animal which crawls across a sheet of paper, towing a pencil or eraser'

a asheet of paper which you are looking down on from above.

The mixedscreen and splitscreen commands in the book may have been intended for screens analogous to a full screen 
Commander vs Commander mixed with the Graphics Screen.  I haven't been able to run one the 1980's Logo interpreters to test it.
Since WebLogo also has a CodeEditor, mixedscreen is being treated as applicable to that.
*/
const commandNames = new Set(['edall', 'mixedscreen', 'splitscreen']);

function findCommandNameOfInterest(tokens) {
	tokens = tokens.filter(t => typeof t.s === 'string' && commandNames.has(t.s.toLowerCase()));
	if (tokens.length !== 0)
		return tokens[0].s.toLowerCase();
}

export class EdAllAction {
	matches(tokens) {
		const commandName = findCommandNameOfInterest(tokens);
		return commandName !== undefined;
	}

	perform(tokens) {
		const commandName = findCommandNameOfInterest(tokens);
		if (tokens.length > 1)
			CommandBoxMessages.warn(`The code editor is being opened because you typed "${commandName}" but any other code is being ignored.`, false);
		else if (CodeEditor.isVisible)
			CommandBoxMessages.warn('The code editor is already open.', false);
		else {
			CommandBoxMessages.print('Opening code editor', false);
		}
		CodeEditor.show();
		if (commandName !== 'edall')
			CodeEditor.restore();
		// 'mixedscreen' and 'splitscreen' should show both the graphics screen and the code editor.
	}
};