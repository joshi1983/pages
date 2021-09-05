The Shader Viewer is a prototype to
experiment with a potential download/export for 
Logo programs that have procedural images.

TO DO:
DONE: - Write a function to compute a colour from
a specified x and y coordinate.
	- a julia set or mandelbrot fractal function sounds good.
DONE: - Test the function by drawing on the canvas.
DONE: - Create a worker for computing colours and returning them.
- Add a zoom feature.
	DONE: - trigger zoom in and out using the keyboard.
	DONE: - trigger zoom by listening to the mouse wheel.
DONE: - Add a feature for exploring around.
DONE: - fix Zoom menu so using the mouse wheel doesn't hide it.
DONE: - fix the Zoom menu so items show properly when hovering over "Zoom".
DONE: - test that clicking the Zoom menu items have the desired effect.
DONE: - add a touch-layout class that gets added when the browser is likely in a phone, tablet, or a touch event is heard.
	- with touch-layout class, enlarge the zoom menu so its items are easier to touch.

DONE: - add a subpixel sampling feature to smooth out details smaller than 1 pixel.
	- this should be attempted if nothing is drawn for a small time interval.
		a second after the worker stopped processing
		might be long enough to be confident the user isn't 
		in the middle of dragging the display around.
DONE: - can a shader viewer be made to work without needing a web server?
	Can it be implemented in a way that runs directly off a computer's file system?
	- see prototypes/serverless-worker/ for the completed prototype of a web page that executes a worker without an HTTP server.

DONE: - create a downloadable a zip using in browser JavaScript.  This would be an important part of a shader exporter.
	- See prototypes/zip-downloader to see the completed prototype.

- make it so the worker's source code can be embedded in the HTML to demonstrate 
	that being possible and that we know how to do it.

- start writing a compiler from WebLogo containing a RasterRectangle to JavaScript 
that will make a function that can work in the worker.
- Create an exporter in WebLogo that:
	- is available when the program uses RasterRectangle.
	- lets people select which of potentially several shader functions to export.
	- lets the user download a zip containing a fully working shader viewer containing the shader function.
	- lets the user download a single HTML file with its CSS and JavaScript embedded in it
