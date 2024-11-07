package.json:
gulp-zip 5.1.0 is used instead of 6 or later to avoid problems around EcmaScript 6 module imports in the node module.
Upon trying to use version 6, I was getting errors about require not being supported in ES6 modules and messages suggesting to rename index.js to index.cjs.
I didn't see a better way to fix the problem than to simply downgrade to the latest version of gun-zip made with CommonJS/require calls.


DONE: - add a way to compile repeat commands into those assembly-like commands.
DONE: - add a function to get all global variable names from all tokens in the result from parsing.
DONE: - add a function to get all local variable names from instructions directly in a procedure.
DONE: - add a way to convert the parsed Logo program into an assembly-like sequence of commands.
DONE: - execute inputs from the command box when they are entered.
DONE: - make it so the command box scrolls when the cursor moves to lines not visible.
DONE: - polish the cursor moving feature in the command boxes.
DONE: - find icons for maximizing, closing, and medium-sizing the Dialog.
DONE: - make it possible to call procedures using the assembly-like commands.
DONE: - make it so "Set Pen Color" from the menu followed by "fd 100" causes the new colour to be used.
DONE: - adjust things so the main environment draws to a drawing instead of a Canvas2DContextDrawer directly.
DONE: - add test that calling 'make' command within a procedure that uses the same variable name as a parameter does not get that make variable recognized as global.
DONE: - adjust turtle.js to use a ShapeStyle to maintain pen width, pen color...
DONE: - make it so "Set Screen Color" from the menu immediately shows the new background colour in the graphics screen.
DONE: - change drawing class from DrawingEvents to shapes like line segments and circles.  Eventually, this would include 3D shapes like spheres, cyllinders...
DONE: - make it so "Zoom -> Zoom In", "Zoom -> Zoom Out" resizes the drawing in the graphic screen immediately.
DONE: - make it possible to drag the graphics screen around
DONE: - add a button for returning to origin when not at origin
DONE: - make it possible to call setfillcolor with null or value representing transparent.  Do not allow the same transparent value for setpencolor.
DONE: - make it so jpg and png download feature works instead of just showing the background canvas.
DONE: - add a pause button to the commander and make it work
DONE: - add support for a rotated ellipse.
DONE: - make it so continuous execution to draw stuff draws new shapes on the canvas while respecting the scale and position of the camera.  
	Right now, a complete redraw works fine but adding individual shapes draws in the wrong place and scale.
DONE: - make the ellipses.lgo output look the same in WebLogo as it does in MSW Logo.
DONE: - round the heading value in the Status component.
DONE: - show the turtle and hide it when it is supposed to be hidden.
DONE: - when exception is thrown during Logo program execution, show message as an error in the CommandMessages component.
DONE: - insert the "to procedureName" in the ToProcedureAction.js and move cursor to an appropriate place in the textarea.
DONE: - move cursor to an appropriate place in the textarea in EditProcedureAction.js
DONE: - add a procedure writing feature like shown in this tutorial video: https://youtu.be/g6kmVHfMQvY?t=195
	- using the "to" command in the commandInput should initiate the feature.
DONE: - add a debugger window.(not just the status)
DONE: - make the sections of the debugger collapsable.
DONE: - make instructions scrollable when there are more than can fit in the Intermediate Code Explorer.
DONE: - add button to Debugger for showing compiled procedures and low-level instructions.
DONE: - add support for not equal opertor: https://fmslogo.sourceforge.io/manual/command-notequalp.html
DONE: - add test case for compiling parse tree that roughly represents "make "x 1 print -:x".  Until the parsing step works with unary - operator, this will require creating the ParseTreeToken's from scratch.
DONE: - add a test case for parsing code with a unary - operator such as "make "x 1 print -:x".
DONE: - add support for - as a unary operator.
DONE: - add button to Debugger for showing parse tree for the currently executing logo program.
DONE: - maintain the latest program compiled by Code.js even if something newer was run by the commander input.
DONE: - add title to all the window state buttons in the dialogs and windows.
DONE: - shrink command detail title font a bit or make help a bit wider to prevent it forom wrapping.
DONE: - simple sun "art" didn't show in Load Example.
DONE: - shrink content in status is less likely to scroll or wrap.
DONE: - add help buttons to Status, Parse Tree Explorer, Intermediate Code Explorer... to show the content from content\help\features.
DONE: - clear and test button to Editor.
DONE: - verify that commands "pensize" and others in the status feature exist.
DONE: - add hintAliases for each command in case a command isn't recognized.
	- alias "left" with "turnleft".  "alias "right" with "turnright".
	- the aliases would be distinct from abbreviations in that hints should not fight with procedure names.
	- hint alias "backward" with "downward".
DONE: - add a "Super Duper Slow" option that is a few times slower than "Ultra Slow".
DONE: - detect number pad arrow keys in the Commander.
DONE: - when there is a procedure but no call to it and as a result nothing is drawn, warn about that when running "Test" or "Reset&Test".
DONE: - fix arcs in SVG to look like they do in the canvas.
DONE: - add support for arc2 command: https://fmslogo.sourceforge.io/manual/command-arc2.html
DONE: - add examples from content/help/commands directory to help documentation.
DONE: - add an image preview to the image exporter that shows when clicking Bitmap -> Download.
	DONE: - preview both SVG and raster graphics based on the currently selected format.
	DONE: - let user resize dimensions.
	DONE: - let user zoom in and out.
	DONE: - let user drag image around.
DONE: - define a BoundingBox class.  This would be a min vector and a max vector.
DONE: - add getBoundingBox methods to all shapes and drawings.
DONE: - show thumbnails of each example in File -> Load Example.
DONE: - start tutorial.
DONE: - update the setxy, setxyz, setpos commands to draw lines to the new positions like happens in MSWLogo.
DONE: - add examples for localmake and make.
DONE: - add support for command names containing "?" and test it.
DONE: - add support for an "until" loop structure since UCBLogo supports it.
DONE: - support the queue command.
DONE: - support defaulting step to 1 in for-loops such as:
	for ["i 1 5] [print :i]
DONE: - Add edge test cases for 3 settings, equal start and stop values, step of 0... to the for.html examples.
DONE: - Add test cases for validating do.while loops that are infinite.  These loops should lead to warnings like they do for other loops.
DONE: - add a test that downloads all example html files for all commands.
	- verify that each contains a "code" element.
	- parse the textContent from each code element.
	- log a message for any command without an example file.
DONE: - add a "add to code" button for all code examples in Command Details so people can quickly make use of the example in their code.  This should:
	- open the code editor, if it isn't already visible.
	- add the textContent of the code element to the Code Editor.
	- move cursor in the code editor to the beginning of the new code.
	- close help dialog.
DONE: - optimize debugger for large call stacks.  It locks up the browser while executing the "Heart" example at Maximum Speed on some slower computers.
DONE: - make use of command info isStaticEvaluationSafe in evaluateToken.
	- evaluate PARAMETERIZED_GROUP tokens corresponding with commands that have that flag set.
	- if any data type or range is violated before calling the command, just return undefined.
DONE: - show axis and grid when hovering mouse over graphics area or up to 1 second since last mouse down, touch in the graphics screen.
DONE: - add a format button to the code editor in the Edit menu.
DONE: - when some commands or procedures are unrecognized, look for good suggestions.
	- try removing spaces between subsequent tokens to see if any of those match a procedure or command.
		- For example, "set pen size" should lead to a suggestion of "setpensize".
	- Look for a single character replacement for things like "forword" which can match a recognized command or procedure.
DONE: - add the same icons from the command box messages to toast messages for errors, warnings...
DONE: - try to compile all code.pastable textContent from general help topics.
	- this helped with command examples already.
DONE: - allow people to define while-loop conditions using square brackets since it is common in MSWLogo.
	- this may involve sanitizing their implementations so the condition input is treated as boolean.
	- the same feature should work for for-loops where the variable name has no quote.
	- if, ifelse statements where conditions use square brackets
	- This was done with the new code fix feature available in the editor's menu Edit -> Auto-fix Code.
DONE: - if there are any errors with single line commands and the code-fixed version is different, suggest the code-fixed version.
DONE: - study how FMS Logo and MSW Logo do property lists.  Can their commands be replicated?
	- https://fmslogo.sourceforge.io/manual/property-lists.html
DONE: - add an editor feature for adding an animation settings procedure named something like animation.setup.
DONE: - add a command for getting the seconds into the animation.
DONE: - let the user change the time in Set -> Animation Time.
DONE: - fix bug this bug:
	1. Open WebLogo without editor open.
	2. Set -> Animation Time
	3. An empty space appears big enough for a restored editor.
DONE: - add automated tests for substituteLocalConstants.js.
DONE: - optimize for-loops that specify only 2 numbers instead of 3.
	- these inefficient cases often lead to needless calls to push-from-stack and the - binary operator.
DONE: - show the time in the Status feature.
DONE: - if the current code is not using animation.time and animation.setup does not exist, hide the animation properties from status.
DONE: - refresh Settings.animationTime after loading from localStorage to fix this bug:
	- Have an animation with a 20 second duration.
	- Reload page.
	- Before doing anything else, click Set -> Animation Time.
	- Notice that the maximum time is 10 instead of 20 indicating that the duration is not loaded properly.
	
	- run refreshAnimationSetupFromTree(tree) as soon as the page loads.

DONE: - update LiveRedrawer draw off screen for all of its interval to reduce flicker.
DONE: - update LiveRedrawer to listen for halting of the program.  Programs that halt very quickly like 100ms or 50ms should lead to a faster refresh.
DONE: - add support for rotated text.
DONE: - add a function for asyncronously getting a SnapshotStyle instance from the current program.
DONE: - in animations, add a few standard aspect ratio rectangles to the hover-visible grid to show where the exported frames would come from and what zoom will be used.
DONE: - maybe add a procedure for getting the camera settings.  animation.snapshotstyle.
DONE: - add an exporter for animations.
DONE: - fix drawing elliptical arcs as SVG so they look the same as they do in the canvas.
WIP: - instead of immediately closing the dialog upon download being clicked, keep it open until the animation download completes.
	DONE: - show frame number being processed and a progress bar.
	DONE: - disable the download button while frames are being processed.
	DONE: - add a cancel button so people can stop the processing.
DONE: - Fix bug.  Make sure line numbers in the code editor are extended properly when pasting multiple lines of code into it.
	- this is broken for now.
DONE: - create a module for blurring canvases together.
DONE: - support motion blur in the animation downloader.
DONE: - add support for startpoly command as described at:https://fmslogo.sourceforge.io/manual/command-polystart.html
DONE: - add support for endpoly command.
DONE: - add an example to draw something like: https://benice-equation.blogspot.com/2012/12/fractal-star.html
DONE: - add a circular arc in testPolyLineShapeWithCurves and test various things such as the canvas 2D drawer works with it.
DONE: - add a PathShape.  This would correspond with SVG's path elements and canvas 2D's path which is began and optionally closed.
	- a shape_optimization that combines consecutive arcs and line segments can fix a minor problem where the points where they meet aren't smooth.
DONE: - uncomment the arc swap direction calls in the shape optimization folder and fix the bugs that introduces the canvas and SVG drawer.
DONE: - when Drawing -> Download is clicked and the current program is not set up for animation, the 2D animation export is not a useful option.
	- When there is only 1 useful export option, automatically go to that option.
DONE: - improve horizontal scrolling in code editor so you don't need to vertically scroll to the bottom to find the horizontal scrollbar.
DONE: - update the insertion of tab characters to insert it to multiple lines when multiple lines are selected in the code editor. 
	- that is in LogoTextarea.js near a mention of &#009.
DONE: - every time the cursor moves in the code editor, if it moves immediately after a bracket, highlight it and the corresponding bracket.
	- do this for square brackets [].
	- do this for curved brackets ().
DONE: - add an example to draw something like: https://imgur.com/a/IZIPGkg
DONE: - fix bug.  When using the 'image' command, the image doesn't draw immediately because it doesn't load immediately.
	- redraw after the image loads.
DONE: - when downloading a drawing to a raster format like PNG, JPG, or WebP and the canvas gets tainted by an HTTP URL, let the user download without those images.
DONE: - optimize data type checking for variables with caching.
DONE: - finish the colorStops equals comparison in LinearGradient.js.
DONE: - get gradients to work in rotated ellipses in SVG exports.  For now, the translation and rotation for each ellipse transforms the gradient in undesired ways.
DONE: - fix bug.  Intermediate Code Explorer procedure list is not scrollable.  It should be scrollable.
	- this bug can be reproduced with the "Mandala" example since it has enough procedures to require scrolling.
DONE: - make new git branch for string art dialog work.
DONE: - finish string art exporter similar to GreaMake
DONE: - add support for breakpoints in the code editor.
DONE: - make double-touch/pinch zoom work in the graphics screen.
DONE: - add a code fixer for usage of "filled" as found on Turtle Academy.  For example,
	filled "red [
		repeat 4 [
			fd 100
			right 90
		]
	]
	
	That should be corrected to:
	setfillcolor "red
	polystart
	repeat 4[
		fd 100
		right 90
	]
	polyend
DONE: - fix all bugs preventing the download of frames as described in logo-scripts/test/memory-leak.lgo.
DONE: - create an example from: https://www.pinterest.ca/pin/67976275614718436/
DONE: - fix bug.  Tighten bounding box around art/sunrise.lgo drawing.
DONE: - reproduce steps:
	1. Click File -> Load Example.
	2. Type "sunrise".
	3. Notice the sunrise drawing is much smaller than available space.
DONE: - add an example similar to: https://www.youtube.com/watch?v=WEUloPdIfRk
DONE: - add test for AlphaColour isDark.
- mix command:
	DONE: - add test cases to commands.json for mixing with transparent.
	DONE: - add mix with transparent to mix.html.
	DONE: - add test for mix command data types with transparent.
DONE: - add documentation for PostScript that it will not work for drawings using alphacolor.
DONE: - add tests for alphacolor and color in updateHexColourDisplay.
DONE: - add an option to the string-art exporter to show the strings as faint lines.
DONE: - help for the invoke command needs more detail.
	DONE: - list commands that can not be used for invoke.
	DONE: - use the isSupportedByHighOrderInvoke module.
WILL NOT DO: - make the Drawing -> Load... menu item load a raster image for a background.
	- the image command can be used instead.
WILL NOT DO: - use https://github.com/yWorks/svg2pdf.js/
	- jsPDF is being used directly instead.
DONE: - make a prototype with jsPDF that downloads a PDF file.
DONE: - trigger a color selection feature when right-clicking on a color literal in the code editor.
DONE: - fix bug: when Edge browser's zoom is not 100%, the Code Editor sizes its textarea badly.  The height does not match the line numbers.
DONE: - add feature to search examples by command usage.  For example, "cmd:arcRight".
	- make this available in File -> Load Example.
	- it'll need to be asyncronous because the code for every example might not be loaded.
	- promises alone might not be sufficient because it may take over a second for all the files to download.  We might want to use a callback for multiple updates before the final result comes.
	- use the feature in command help to link to larger examples.
DONE: - update aspect ratio drawing while setting the animation time and redraw the aspect ratio lines.
	- this is important when the animation.snapshotstyle adjusts zoom.scale.
Python tasks:
DONE: - check that binary operators for comparison <, >, ==... are evaluated with types 'bool' instead of 'num'.
DONE: - check that getNextChildlessToken is called and used with a safety check for parents that may be FUNCTION_CALL or PRINT types.
DONE: - can an import statement contain a function call?  If no, this could be another useful check to add before moving the result of getNextChildlessToken.
DONE: - move all comments to separate property in tree.  This might be useful in the python-parsing/parse.js module.
DONE: - when evaluating tokens, add a separate advanced evaluate function.  Don't recursively do anything in a "basic" step.
DONE: - try processing PRINT tokens as FUNCTION_CALL in processToken.  See if that fails any tests.

Python fixer:
DONE: Write a code fixer that helps people convert their Python turtle code to WebLogo.
DONE: - add tests for processing invalid python.  We want to ensure no JavaScript errors are thrown even when the processed python is broken.

The following parsing libraries might help:
- https://openerp-web-v7.readthedocs.io/en/stable/
- https://www.npmjs.com/package/dt-python-parser
- python-bridge will not be suitable since it depends on a python installation on the machine to bridge with.
python-bridge delegates python code processing to the python interpreter and does not run it in JavaScript.
- DT Python Parser was ultimately selected.

DONE: - Create a prototype with one or two of the above libraries.
DONE: - Start writing a code fixer in modules/components/code-editor/code-fixer/fixers/pythonFixer.js.
GIF to do:
DONE: - add a notification for after the last frame and encoding the gif.
	- A message like this seems clear: "All frames collected.  Encoding GIF..."
	- If encoding takes several seconds, the extra message should encourage them to stay patient.
DONE: - check for unually high numbers of frames or resolutions.
	- for example, over 500 frames.
	- over 4 million pixels in resolution
	- or pixel count * frame count > 200 million
		- if any of the above conditions are met, give a general statement like:
			"Your GIF file size will be unusually large.  Consider the following:"
				- "Reduce frame rate to 12fps" if fps is greater than 12.
				- "Reduce resolution to 640 by 480" if resolution is larger than that.
				- "Adjust your animation.setup procedure to indicate a shorter duration".
				- "Switch to <strong>File</strong> -&gt; <strong>Frame Sequence</strong>. Then, you can create an MP4 or other modern video file on your computer using other applications like ffmpeg."
DONE: - implement a downscaling feature for any low resolution image downloads to improve their quality with high detail drawings.
DONE: When a repeat has a maximum number of repeats of 1, variable-data-types code should:
	- associate 1 with any call to repcount.
	- associate 0 with any call to repRatio.

DONE: - Test that 1E12 is treated as a valid anumber.
DONE: - Test that it is equal to 1 trillion.
DONE: - FIX: print 1E-1 
DONE: .. should print 0.1.
	actually causes error.
DONE: - 1E1 should be 10.
DONE: mixedscreen or splitscreen in Commander input to open editor.
- see if FMSLogo supports it.
- See if it is documented more online.

DONE: - fix bug - string art exporter with drawing that is not centered on origin will not center properly when downloaded.
DONE: When a code editor line has a warning and a breakpoint, it can be difficult to remove the breakpoint.
Fix this by opening a dialog with multiple options.

DONE: Add a code-fixer that will replace 'if' with 'ifelse'. if '[' follows the closing ']'.
- this is because IBM's Logo interpreter allows more than one instruction list so that 'if' can work like 'ifelse'.

DONE: - When part of the margin is hidden due to the horizontal scroll of the code editor, breakpoints are hidden.
This can cause confusion when clicking in the margin and expecting a breakpoint mark to appear.
- Always scroll maximum left when the margin is clicked.  This should make this case less confusing because it'll immediately show the breakpoints.

DONE: - optimize SVG exporting if a rectular path is found.
	- use a rect tag name.
DONE: - optimize SVG exporting if a rounded rectangle path is found.  That is a rect with circular arcs on all 4 corners of equal radii.
	- SVG rect has rx and ry attributes that can be used for this.
DONE: - '#' is used to start comments in several languages.  If an error message is for a LEAF token starting with '#', mention that ';' is how to do one line comments in WebLogo.
DONE: - There are many isLikely...(ie. isLikelyKTurtle, isLikelyPython...) functions which have the risk of returning true for the same code.
If more than 1 isLikely... function returns true for the same input, use none of them.
	- make a function to return a single function for translating to WebLogo.
	- refactor all testIsLikely... cases to get equivalent coverage by testing that 1 module.
	- adjust autofix menu item module to use this new module.
	- add isLikelyCanvas2D and its translate function into this.

DONE: Add commands like getArcLeftAngleToCircle :arcRadius :circleCenter :circleRadius
 and getArcRightAngleToCircle.
DONE:	- Apply these new commands to examples such as crop-circles/cleyhill-2017-crop-circles.lgo fillIntersectedArc procedure.
DONE:	- See if north-42-degrees-vineyard-logo.lgo could use it.  Some arcs intersect circles there.
DONE:	- Search for other examples that could use it.  
DONE: - make a prototype for drawing arbitrary gif animation frames to canvas using https://github.com/buzzfeed/libgif-js
	- this could ultimately lead to a command named something like drawFrame and/or drawFrameAlpha which would be similar to image and imageAlpha except it would 
		also take an input for the animation frame index.

DONE: - Add support for escape characters like \ in string literals.
For example, 'local://President\'s_Choice_Logo_2014.svg' should be scanned and parsed as 1 token.
	It should also have the value: President's_Choice_Logo_2014.svg

To do:
- add an Assets feature.
	DONE: - It should support a way to browse assets in local storage.
	DONE: - Let user add new assets.
	DONE: - Let user delete an asset.
	DONE: - let user rename an asset.
	DONE: - make it possible to show images from the asset manager using the "image" command.
	- use syntax-highlighter on .lgo assets.
	- let user load .lgo assets into the code editor.

Add a command to parse MIDI file data and return the results.
- check to see if this could help: https://github.com/dingram/jsmidgen
	At a quick glance, it looks like that library is for writing/generating MIDI data and not for reading it.
	It might not be helpful if it is only for writing and can't write binary data.


- test that bounding box goes around curved and square caps in line segments.

- fix minor bug. canvas draws path corners badly sometimes.  This can be reproduced by:
	- loading logo-scripts/tests/corners-not-joining-properly.lgo and zooming in and out.
	- A downloaded SVG looks perfect in a web browser and it uses a single path element so it doesn't look like a problem with drawing optimization.
	- It looks like trouble with flags passed to ctx.arc in CanvasVector2DDrawer.js.
- fix focus support for radial gradients with spreadMethod "reflect" in canvas to match how the focus is looks in SVG.
- fix focus support for radial gradients with spreadMethod "repeat" in canvas to match how the focus is looks in SVG.
- add support for conic or angular gradients.
	- these aren't in standard support for SVG so they may be difficult to export to SVG but HTML5 canvas supports them.
		https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createConicGradient

- try to accommodate some feedback from David Kra at:
	- https://www.quora.com/What-is-the-best-free-reliable-patent-drawing-software/answer/David-Kra?__nsrc__=4&__snid3__=56854310461&comment_id=351738120&comment_type=2
	- one feature could be exporting animations showing the drawing process.
		- a way to choose turtle visibility between always hiding, always showing, or show turtle based on the hide/show turtle state from the running program might be helpful.

- make it possible to embed a WebLogo script into a web page and show the corresponding image.
DONE: - add mouse wheel for zoom in/out to work in embed.
DONE: - add mouse drag to work for moving drawing around in embed.
DONE: - add touch pinch/stretch to zoom on a touch screen.
- add an HTML and JavaScript exporter.

- refactor drawing-download/previewerDownload.js getRasterDataURL function and animation-download/getRasterSnapshot.js to reduce code duplication.

- research getting animation download to run program in web worker even if the jpg/png... encoding must be done in main thread.
- when pasting code in the editor, check if the insertion adds errors that can be fixed with the code fixer.
	- If going from code fixer having nothing to fix to fixer having something to fix, show a dialog asking if the user wants it autofixed.

- add a fast wireframe renderer to activate when there are at least 1 3D shapes or shapes with z-coordinates other than 0.
- add a 3D model export feature.

- add a data visualization tool.
	- start it with a 2D graphing feature for graphing the value of any given Logo expression with another Logo expression.
	- Start it with the assumption that both Logo expressions evaluate to a number.
	- This will be useful for troubleshooting problems with animations.
- add 3D shape commands from: https://logomor.com/assets/Documentation.pdf

- Fix bug: Tiled Circles appears flat in Wire Frame Export
	- I expected the circles to be in a 3D shape but the wire frame exporter shows them all on the same plane.

- create a simple prototype simulating the main index.html to troubleshoot the layout on Android's Chrome browser in Bluestacks.
- using Chrome remote debugging, find out why the page content height appears to scroll vertically instead of just taking up 100% viewport height.
- test on phones.
	- At the time of writing this, the turtle isn't drawing on https://joshi1983.github.io/pages/turtle/

- fix bug.  Debugger Call Stack indexes get messed up when running the "Colourful Beed Design" example.
	- Expected the indexes to not repeat.  For example, 1, 2, 3, 4, 5, 6, 7, 8, 9... but instead see:
		1, 2, 3, 1, 2, 3, 1, 2, 3,...
	- it is hard to reproduce but this indexing problem showed before.

- add an example similar to: https://www.pinterest.ca/pin/533113674650215963/
- add an example similar to: https://www.pinterest.ca/pin/200269514655938217
- add an example similar to: https://www.pinterest.ca/pin/61150507416328281/
- add an example to draw something like: https://vaitdesign.com.br/wp-content/uploads/tapete-mandala-MM-laranja-azul-e-verde.jpg
- add an example similar to the mandala at: https://www.pinterest.ca/pin/291467407178360174/
- add an example similar to: https://www.pinterest.ca/pin/966866613735399301/
- after 3D modeling is working well, 
	- add a 3D example similar to the model in this video: https://www.youtube.com/watch?v=zrmVxVRjLMw
	- another nice 3D model would be of: https://www.pinterest.ca/pin/4644405855315347/
	- another nice 3D model would be: https://www.flickr.com/photos/fdecomite/15183981511/
	- animation like: https://www.pinterest.ca/pin/25543922876347566/
	- animation like: https://www.pinterest.ca/pin/598204763017572633/
	- create an example like: https://www.pinterest.ca/pin/14636767523371482/
	- create an example like: https://www.pinterest.ca/pin/162481499041490267/
	- example similar to: https://www.facebook.com/watch?v=163135913202910
	- example similar to one of these: https://www.pinterest.ca/pin/322218548355658828/
	- example similar to: https://www.youtube.com/watch?v=YVgbppLiBfo
	- example similar to: https://www.facebook.com/photo?fbid=2378805932496215&set=gm.10161064680197197&idorvanity=180046672196
	- example similar to: https://www.facebook.com/photo/?fbid=6572425172779541&set=a.208963502459105
		- a 3D flower that looks almost as natural as that would be very impressive
	- example similar to: - https://www.facebook.com/photo/?fbid=3836828136577541&set=gm.3536620906647842&idorvanity=1389776944665593
	- add some animations similar to these POV-ray examples: https://www.youtube.com/watch?v=TaX6rF4BvjY&list=PLqbT6hDqwvEc9WhPfEnY_OB3WeeT4Uxil&index=7
	- add an example similar to:
	https://scontent-yyz1-1.xx.fbcdn.net/v/t39.30808-6/486861767_1350951486017325_6635711522396286033_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=N07JKt52ZPEQ7kNvgH4im9z&_nc_zt=23&_nc_ht=scontent-yyz1-1.xx&_nc_gid=K0fHjx5wAS_PC9IFUkrkIw&oh=00_AYGdViFe3jSjX4q2DZPTF83GQ5ybkQ_hWorc5XjrEanHQg&oe=67E9FC40
- add animated gif exports using a library like https://github.com/antimatter15/jsgif
	- create an animation like: https://www.pinterest.ca/pin/290341507240137097/
- in drawings that take a while to redraw, dragging and zooming becomes choppy.
	- redraw the latest full drawing but scaled and translated appropriately until the drag or zoom stopped for a little while.



- add a validation step to log error and warning messages related to a parse tree.  This can run after parsing but before compiling.
	DONE: - look for procedure names that match command names, command abbreviations, or keywords.
	DONE: - look for make and localmake calls that don't have a STRING_LITERAL as first argument.
	DONE: - look for more than one procedure with the same case-insensitive matched name.  Mark these with errors.
	DONE: - look for calls to repcount outside of a repeat.  Any found should lead to an error.
	DONE: - look for reading a variable that isn't defined
	DONE: - look for unused procedure parameters.  Mark these with warnings.
	DONE: - look for simple data type to parameter data type mismatches.
	DONE: - look for local variables set outside of a procedure.  'localmake' command should not be used outside of a procedure.
	DONE: - look for for-loop variable names matching nested for-loop variable names.  This should be marked by an error.
	DONE: - look for variable names from for-loops matching procedure parameter names or matching localmake calls.
	DONE: - look for tokens that should be commands or procedures.  Find any that are not recognized.
	DONE: - look for procedures that call both stop and output.  Warn on stop that they're mixing output with stop and that their outputs will be easier to use if the procedure always outputs a similar type of value.
	DONE: - look for local variables that are given a value but never read from.
	DONE: - make sure "null" is not passed into a procedure parameter.
	DONE:	- Give a message about possibly giving the procedure the wrong number of parameters.
	DONE: - look for consecutive calls to commands that are inefficient.
		- for example, fd 100 fd 50 can be written as fd 150.
		- for example, right 90 left 45 cana be written as right 45.
		- this inefficiency was found in some student-made examples found online.
		- these should result in warnings.  Not errors.
	DONE: - check that the instructions between polystart and polyend might create a valid path.
		- if no procedure is called in that interval, it should be simple enough to check if at least 2 calls are made to a path-affiliated command such as:
			- arc2, arcLeft, forward, back...
	DONE: - check that referenced variables at least might be declared.
		- this should not apply to commands that define new variables such as make and localmake.
		- setProperty, queue, dequeue should make these checks.
	DONE: - validate plist values used used in gradients(commands like setfillLinearGradient and setFillRadialGradient).
		- check that all keys are numbers.
		- check that the keys are all between 0 and 1.
		- check that the values are all colors.
		- check that there are at least 2 keys.
	DONE: - validate argument count for the quotient command.  It is unique because it supports 1 or 2 arguments.
		- quotient has a min and max argument count instead of being either completely static(args.length being constant) or being completely dynamic like sum which uses any number of arguments.
		- this will likely involve supporting a argCount object in the commands.json file so it can say what the min and max counts are.  Completely dynamic commands like sum can still use argCount: "?".
	DONE: - get "Command or procedure expected" message moved from the compile stage to the validation stage.
		- we want all errors found as the user types code in the editor instead of waiting for them to click "Test" or "Rest & Test".
	DONE: - validate calls to createLinearGradient where the 2 points are definitely equal.  The equal cases should include:
		- both are calls to "pos" command.
		- both are references to the same variable.
	DONE: - look for unconditional assigning of a value to a parameter before it is read.  This should lead to a warning about how the value passed for the parameter is ignored.
	NOT DOING: - look for unused procedures.  Mark these with warnings.
		- Not doing this because this would highlight nearly every procedure in a library.
		- it is common to have a list of procedures and call them from the command box which won't be in the same parse tree.
	- look for local variables that match global variable names.  This might just be a warning instead of error.

- Look into downloading with the ICO image format used in favicons.
The following links could help:
	- https://stackoverflow.com/questions/63558462/how-to-parse-image-to-ico-format-in-javascript-client-side
	- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
	- if trying to export with a .ico file extension, check the binary in the file to ensure it actually is ICO data and not PNG with only a .ico file extension
	- if exporting to ICO format is easy enough, consider adding it as an option to the image download feature.
		- "Website Favicon" could be a good distinct option that locks the resolution to 16 by 16 pixels and uses the ICO format.

DONE: - look up Edinborough Logo.
	- Logo Programming for the IBM PC says on page 6 that it is easier to learn than the MIT version of Logo.
	- one version was made by Research Machines of Oxford.

- add left and top properties to Rect in the fast-pixels branch.
- 
- Similar to the GIF animation mode, add support for APNG.
	- use https://github.com/akalverboer/canvas2apng

- add a feature for quickly converting an absolute url with the HTTP or HTTPS protocol into an asset.  A usage scenario could look like:
	1. User right-clicks the image url from image 100 100 'https://somedomain.com/someimage.svg'.
	2. Pop up appears asking if user wants to:
		- navigate to the link in another tab.
		- convert to asset
	3. User selects 'convert to asset'.
	4. Content gets downloaded asyncronously.  Upon completion, asset is saved with similar name.  The new asset's URL replaces the 'https://somedomain.com/someimage.svg' in the Code Editor.

- FIX feedback is sometimes confusing for localmake and make if the user wants to increment the variable.  
It is easy to mistakenly type something like localmake "x + 1 instead of localmake "x :x + 1.
	- add a validator for things like:
	if 3 = 4 [
		localmake "x + 5
	]
	- add a corresponding denoiser to clean up confusing error messages for nearby tokens that are less specific.

- consider adding an exporter for the embroidery DST file format
when the current drawing can export well to it.  This would be part of the Drawing -> Download feature.
	- https://edutechwiki.unige.ch/en/Embroidery_format_DST
	- TurtleStitch allows exports of DST files and WebLogo might benefit from a similar feature.
	- Similar to downloading a PDF, PostScript, point cloud, string art template..., provide a preview of roughly how the exported DST might look in other software or in physical embroidery.
	- Exported DST files could be tested by loading with http://joshvarga.com/

- consider adding a command for:
	- https://en.wikipedia.org/wiki/Squircle
	
Implement some features from:
https://www.youtube.com/watch?v=PUv66718DII
- consider a number input range type control for editing number literals that is available while in Autorun mode.

- adjust the Code Editor's Test and Reset & Test features to automatically decrease current time when it is greater than duration as defined by animation.setup.
	- send a toast message when changing time similar to the one used when using Set -> Animation Time.

- add a test report dialog feature.
	- For animations, show things like results from running animations at various times within the specified time interval.
		- do any runs end with an error?  how many fail with error?
		- what animation.time values lead to errors? 
		- what are the error messages?  What line do the errors happen at?
		- show a graph of animation.time vs runtimes.
		- report procedure call counts with emphasis on any that are never called.
	- show results from running randomized code with various different random seeds.
		- do any runs end with an error?... if yes, give seed values and make it easy to reproduce the error in the code editor.
	- if program is not an animation and is not randomized, run once and
		- report run time.
		- list uncalled procedures.  They could be worth considering removal.
		- list counts of times each procedure is called.
		- list counts of times each command is called?
	- are there any procedure parameter values that could cause errors or unusual results?
		- if yes, simulate calls with those parameter values and report WebLogo code expressing the procedure calls and the results.
			- even if they don't happen while running the code as a whole, they might help the developer identify potential bugs and make the procedures more robust.
			- one useful cases to try finding are things like causing the denominator in a division to be 0.
- Change Reset & Test to "Run".  Turn the Test button into a menu called "Testing" which contains "Run Only" and "Testing Report".

- make it possible to control all random generation in a running WebLogo programming using a seed.
	- This should be used in every nondeterministic/randomized command such as random, randomColor, randomRatio, pick, shuffle...
	- for sake of efficiency, use the controlled approach only when it is specified as a compile option or setting in the turtle.

- adjust Set -> Animation Time to allow a small interval less than 0 and after the duration for simulating cases that could happen
 while making an animation with motion blur.

- test canvas 2d translater for assigning fonts.
	- fix any problems that might appear.
	- assigning font family should translate to setFontFamily.
	- assigning font size should translate to setFontSize.
	- how is font colour assigned in canvas context 2d?  is it anything distinct from strokeStyle and fillStyle?

Python tasks:
- adjust the testTokenToWebLogoCode to test with both Python2Parser and Python3Parser to find more problems.

- add test that all WebLogo examples have no trailing whitespaces on each line.

Debugger features:
	DONE: - add a way to maximize the Debugger.
	DONE: - make it possible to collapse the global variables section.
	- make it possible to copy a variable's value as JSON if it has no cycles.

After adding a JavaScript parser,
	- Add to AutoFix feature a translation of some examples from:
	https://github.com/ycatch/p5.turtle.js


fix another bug involving commander:
To reproduce the bug:
	1. Write a program in the code editor.
	2. Add a breakpoint.
	3. Run the program to the breakpoint.  Notice the "Unpause" button caption shows.
	4. Run a command from Commander.
	5. Notice the "Unpause" caption disappears.  
	How do we continue execution after the breakpoint?  We can't.  That's the main problem.

fix minor bug with commander input and breakpoints:
To reproduce the bug:
	1. Have a procedure defined in the code editor.  Add a breakpoint to a line within that procedure.
	2. Call the procedure from Commander.
	3. The execution should stop at the breakpointed line and highlight that line in green.
	It doesn't highlight in green, though.  The "Pause"/"Unpause" button switches to the caption "Unpause" which is good but the line is not highlighted in green.
- The problem could be that the code responsible for listening for code execution and
highlighting the executing line numbers is not activated properly when Commander is used to restart code execution.

Add a glossary index or list to the help feature.
	- We already have a feature to show an individual glossary item but people may want to see all and nothing but the glossary items.

For a glossary term with definitionHTML is specified, make the contained command references link to the corresponding features.
	- look for automated tests for the glossary feature.
	We don't want to lose any automated test coverage while making the change.
	Processing the links would involve dependencies that are very difficult to include in automated tests.
	If there's an issue, we should isolate dependencies and potentially add modules 

internal-procs:
	DONE: - create code for a map procedure.
	- turn the earlier made map procedure implementation into a new map command in WebLogo.
		DONE: - add content/help/commands/map.html examples.
		DONE: - add execution test cases.
		DONE: - add a test that compiles code using 'map' command and verifies that the map procedure is defined within it.
		DONE: - get new internalProc command group recognized by the compile function.
		DONE: - get internalProc command group passing commands.json tests.
		DONE: - get execution tests to pass.
	DONE: - add referenced internal procedures when calling the compile function.
	DONE: - test the debugger features.  Indicate the internal procedures with different styles in the call stack.
	DONE: - test calls to internal procedures with breakpoints.
	DONE: - show the internal code in details for the command in the help feature.
	- test that a breakpoint on a line in the code editor doesn't cause execution to stop
		at the corresponding line number in the internal procedures.
	- add validator to check that procedures passed to the map command always return something.  
		- They should always use the output command and never use stop or return without running output.
	- add other procedures such as sort, binarySearch.
	- add a feature to show the internal procedure implementations in the Code Editor.

Fast pixels to do:
DONE: - Create a new Image type of shape that is linked to a procedure name.
DONE: - implement unit tests on the new image shape to set pixels.
DONE: - Do we need a new execution mode or LogoInstruction to support these images?
	- Yes, a JavaScriptFunctionCallInstruction.
- Add a module for filling a Rect that extends EventDispatcher.
	- Have an event for completion which can then be listened to for redrawing GraphicsScreen.
	- Have a method for aborting a redraw.  This would be important when user changes GraphicsScreen resolution faster than it can finish processing a Rect.
- If more than 2 or 3 Rect instances are on a specific ProceduralImage or ProceduralRasterRectangleShape, select and remove the Rect that is least helpful for the current GraphicsScreen state.
- Define a cache for a few different resolutions or sampled rectangles within the image.
- Create a drawing using this new type of image that draws a mandelbrot fractal.
- test the new fractal drawing by dragging the view around, zoom in, zoom out...

Possible names:
A project named WebLogo is at: http://weblogo.berkeley.edu/ but it looks dead and is not related to the Logo programming language.

WebLogo
Resolution Infinite
Infinite Art Studio
Infinite Design Studio

For promotion, 
- share on Reddit.
- pinterest
- short tiktok videos of animations
- share exported images on flickr
- share string art templates in https://www.facebook.com/groups/692762301397674
- share math and fractal like drawings at https://www.facebook.com/groups/391950357895182
- youtube video tutorials can double as end-user documentation and product promotion
- 


slogan ideas:
*code something beautiful*
code beauty
create something beautiful
where art meets code
where visual art meets code
where code becomes beautiful
where code becomes beauty
program something beautiful
Make something beautiful with code
program beautifully
draw with code
paint with code