# Mask Blaster

Mask Blaster is a web-based game where you blast masks to save the world.

## File Structure

assets directory contains some images, audio, and meta data.

CSS from the css directory handles showing and hiding various elements based on the current mode.

The modules directory has all the JavaScript written specifically for this game.

The tests directory will have any automated tests. Loading test.html will run all the automated tests and report any detected problems.
No automated tests were written yet so it is more of a placeholder.

## Development Plan
1. Get very minimal game playable.
	DONE: - draw a mask image.
	DONE: - get mask to move toward viewpoint.
	DONE: - draw masks.
	DONE: - gamer can fire at masks.
	DONE: - asyncronously load assets and show progress of that loading in the initial screen.  Prevent the start of playing until they're loaded.
		- loading should always be faster than 5 seconds.
	- detect fired shots hitting the mask or its weak areas.
		- add to score when hitting the unprotected areas.
	- show final score in the game over screen.

2. Start animating the init and game over screens.
	- Game over from a death should include blood dropping animation.
	- Initial screen should animate the start button.  Maybe a gradient passes through the text.

3. Animate the mask when it is hit.
	- Have more than 1 version of each mask to illustrate various states of damage.

4. Animate a landscape moving under the masks.
	- This could be a wireframe appearance.
	

## Sources

Everything in this is either fully original, adapted from sufficiently permissively copyrighten sources, or adapted under fair use.

## Third Party Libraries

A midi player was copied from https://github.com/fraigo/javascript-midi-player?tab=readme-ov-file.  No license is clearly mentioned on the repository 
but the README.md instructs people how to copy and use it. It is also a public github repository.  For those reasons together, it seems 
ok to use it.

### Source images

A Zardoz head mask was adapted from:
- https://www.pinterest.com/pin/zardoz--30540103693691787/
- The Zardoz talking head is from a movie released in 1974.
- I consider this image to be under fair use.

In Game Over screen, the exploding Earth image is from:
https://www.needpix.com/photo/download/774026/earth-globe-explosion-collapse-setting-world-free-pictures-free-photos-free-images

In Game Over screen, winning shows a beach image from:
https://www.publicdomainpictures.net/en/view-image.php?image=21750&picture=tropical-paradise

### Sound effects and music

The game over loss sound came from: 
https://mixkit.co/free-sound-effects/game-over/
- Spaceship system break down

The shooting sound came from'alienshoot1.ogg' at:
https://opengameart.org/content/space-shoot-sounds