Name: Chia Hsuan Wu
SID: 42764118
CSID: y4d8

Statement:

By submitting this file, I hereby declare that I (or our team of two) worked individually on this assignment
and wrote all of this code. I/we have listed all external resoures (web pages, books) used below. I/we have
listed all people with whom I/we have had significant discussions about the project below.
You do not need to list the course web pages, textbooks, the template code from the course web site, or discussions with
the TAs. Do list everything else, as directed at in the collaboration/citation policy for this course at
http://www.ugrad.cs.ubc.ca/~cs314/Vjan2016/cheat.html Including this statement in your README is your official declaration that you have read and understood this policy.


This is the hierarchy I used to setup my mole
// Hierarchy
//           World
//             |
//           Torso
//     |-------|------|-------------|
//    head    tail   frontLegs    backLegs
//     |                |           |
//    nose          clawsLarge    clawsSmall
//     |
//  |---------------|----------|----------------|
// leftTent     RightTent     SamllTentR     LargeTentL

- I  have successfully implemented all functionalities specified on the assignment document. Some thing extra: 

- I made the back legs slightly smaller than the front. 

- I made the tentacles into a coneish shape and combined left/right into their own array. The motivation behind the shape is that 	it makes the mole look more cartoonish like this picture. http://farm2.static.flickr.com/1017/1276429978_def78ce7aa.jpg

- I made a variable called reversible and a action manager to allow reversible action when conflicting keys are pressed.
	For example: 
	Reversible = True: 
		When U is pressed, the torso is rotated up. 
		Then when E is pressed, the torso is rotated back to its starting position, 
		successfully reverse the action perfromed by U.
	Reversible = False:
		When U is pressed, the torso is rotated up. 
		Then when E is pressed, the torso is jumped to the starting position 
		and rotated back to its downward position.

- The reversible toggle can by controlled by the key 'R'.

- I added an image background on the HTML side and make the renderer transparent

- I made a godzilla mode that allows the user to experience a scene from the movie with a mole being the gozilla.
	Simply press A to enter godZillamode. Pressing A again will reload the entire website hence quiting the mode. All the buildings (height, width and position) are randomly generated. All the planes are randomly generated as well.