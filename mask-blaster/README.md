CSS from the css directory handles showing and hiding various elements based on the current mode.

The modules directory has all the JavaScript for this game.

The tests directory will have any automated tests. Loading test.html will run all the automated tests and report any detected problems.

Plan:
1. Get very minimal game playable.
	DONE: - draw a mask image.
	DONE: - get mask to move toward viewpoint.
	DONE: - draw masks.
	- gamer can fire at masks.
	- detect fired shots hitting the mask or its weak areas.
		- add to score when hitting the unprotected areas.
	- asyncronously load assets and show progress of that loading in the initial screen.  Prevent the start of playing until they're loaded.
		- loading should always be faster than 5 seconds.

2. Start animating the init and game over screens.
	- Game over from a death should include blood dropping animation.
	- Initial screen should animate the start button.  Maybe a gradient passes through the text.

3. Animate the mask when it is hit.
	- Have more than 1 version of each mask to illustrate various states of damage.

4. Animate a landscape moving under the masks.
	- This could be a wireframe appearance.
	

Sound effects and music:

https://mixkit.co/free-sound-effects/game-over/
Some game over sounds might include:
- Spaceship system break down  
- Sad game over trombone


The exploding Earth image is from:
https://www.needpix.com/photo/download/774026/earth-globe-explosion-collapse-setting-world-free-pictures-free-photos-free-images
