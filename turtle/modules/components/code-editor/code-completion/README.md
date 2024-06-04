The code-completion directory contains some implementations to help with
code suggestions in the code editor.

The Language Server Protocol is used by some editors for features like this.
https://microsoft.github.io/language-server-protocol/

Ultimately, the code-completion will become a feature in the code editor that pops up 
menu-like alternatives for completing code.

to do:
- listen for layout changes.
	DONE: - When the code editor closes, hide the Suggestion container.
	DONE: - When the code editor resizes, update suggestion container position.
- listen for events that change the current token.
	- if the current token has no suggestions, hide the container.
- adjust the update time interval to be much shorter when the container is visible.
	- when the container is visible 100ms seems about right.
	- when the container is invisible, 500ms seems about right.
	- These time intervals may need to be longer when the editor contains so much code
that frequent updates to code completion would either be impossible or 
make the overall experience even more sluggish.
- make the click replace the token value in code.  As I type this, it only does a console.log.
- fix or work around problem where it looks like top is miscalculated when the 
font size is reduced in the editor.
The problem might have to do with font-size and line-height being different in the textarea in the smaller form.
	- to reproduce the bug:
		1. open the editor.
		2. Shrink the viewport width narrow enough that the smaller font is used in the editor.
		3. Do something to make the pop up appear.
		4. Notice that the pop up is lower than it should be.  It was about 15 pixels down when I tested.
		I'm not sure if the textarea-caret-position library is at fault or not.
