CPSC 314 Project 4 Final Readme
Name: Rob Wu
SID: 42764118
CSID: y4d8

# Grace day used: 2

In order to get the leaderboard functionality to work, go to
http://superbstreak.github.io/P4/P4.html

what:
	I have created an extremely (seriously) addictive infinate running game called 'The Hunt for Oscars'. This game uses basic keyboard (and/or mouse) to control the main character. When the game starts, the player will be greeted with a loading screen in order to load the textures and STL object without them lagging the UI. 

	Then once the loading is completed, the player will hear the background music playing and see the game started with a message 'Click to Start'. This text geometry requires user to use their mouse and click on it (picking) to start the game (or hit the space bar for a smoother replay). The main character will be running on its own forever until the user has hit start (animation). 

	When the player starts the game, the background music changes to a more adventurous music. The game will then go through the onboarding phase to teach the user the basic controls of the game. Collision detection is disabled during onboarding. Then the game will start once onboarding is finished. When the game starts, the player will see the text geometry 'Start'.

	During the actual game, the user should avoid hitting any obstacles or falling off on the edge of the floor. If the player collides with any obstacles or falls off the edge, the game is over. The generation of the obstacles are completely random but the algorithm gurentees at least one solution is present. For every 1000 meters reached, there is a 20% probabilty of an Oscars award popping up at a random position. If you are quick enough, you could win the game. However, if the player missed the Oscars award, then the player would have to survive another 1000 meters.
	This design is meant to increase the challenges of the game (and show the pain Leo endured year after year). Once the game is over, the player will be shown a red carpet background with a Oscars award rotating in front of it. You score will be sent to a backend sever (Azure) and your rank will be displayed on the side of the game (if use the website specify up top). The player is given a choice to restart the game by pressing the 'down' key.

	• 3D objects:
		There are multiple 3D objects in the game, such as Leo, the obstacles, the Oscars, the text geometry, the glow on the Oswars award, the bounding box on Leo and the bounding box on the Oscars. The side walls and floors are planes.

	• 3D camera:
		There are a total of 3 3D cameras in the game. The main camera is a perpective camera that is behind and above Leo and looking at his Head. The second camera is an Otherograpic camera that provides a top down perspective and it is always follwing Leo. Finally, the third camera is another perpective camera that is from Leo's perspective (you can press 'p' to switch betwen top down or Leo vision).

	• Interactivity:
		The player can control and interact with the game with variaty of tools. Keyboard is a must, mouse is optional (can be used for picking and jumps). There is a flag in the game called useMotion, if this flag is enabled, devices with accelerometer built in would be able to control Leo by tilting the device.

	• Lighting and shading:
		The Oscars awrad and its outter glowing sphere uses shaders material with each of their own vertex and fragment shaders. The Oscars uses phong while the glow is simplying calculating glow at each vertex. There is an ambinet lihght in the game as well as a point light at 0,0,40 lighing up the front face of the obstacle when Leo pass by. There is an additional spot light that is above and to the side of Leo. The floor and obstacles are set to receive shadows, so Leo's shadow will be cast onto them.

	• Picking:
		The picking is done on the text geometry. The user can click on the text geometry to start the game.

	• Texturing:
		There are many texturing done in the game. The floors (random textures) and the walls uses texture texture to make the game seem more dynamic and colorful.

	• On-screen control panel:
		There are several on screen displays such as the FPS counter, the distance ran by Leo and when the game is over, there is a leaderboard with your relative ranking.

	• Gameplay:
		Described above.

	• Advance Features (Only required one):

		• Collision detection:
			Collision detection is done on a set of obstacles and the oscars award.

		• Animation:
			There are several animations within the game. Before the game starts, Leo would be running by itself forever, the text geometry would be rotating to gian the user's attention. When the Oscars shows up (lucky you), the oscars award will be rotating to show off all angles. When the user hits an obstacle (or fall off), there will be a short retro game animation such as bounce up then fall off the screen. When the user reached the ranking page, the oscar awards will be front and center of the screen rotating (in case you missed it in the game).

		• Particle System:
			When the user hits an obstacle, a blast of (1000) particles would explode from Leo's position outward.

how:
	Even though this is an infintely running game (like our imagination) the computing power is still bound by the hardware itself. Therefore, it doesnt really make send to have infinte many obstacles or floors or planes. I eitehr destroy them or recycle them to lighten the load.

	• Obstacle generation/Placement design:
		This one was a bit tricky. I started off with generating random obstacles at random position. But the difficulty of the game become vary random and sometimes impossible. Then, I changed up the alogrithm to generate random obstacles at random position but with specific floor type in mind. This made the game more playable but some levels are simply not possible to jump over. Finally I realize my floor length is 160 and width is 40. So I came up with the idea that I split the width into 10 per lane and length into 8 segments with 20 (unit) each. The 8 segments can be represented with 8 bits 11111111 for each lane. I then generate the number of solutions per floor and a number from 0 to 255 per lane. I converted the number between 0 - 255 into bits. When I am placing obstacles at each lane, I first randomly decide if this lane should be a solution lane or not. If the lane is a solution lane, I manually add two 0 bits every bit of '1' to ensure the user can jump over them. If the lane is not a solution lane, it will simply map the randomly genreated bits into obstacles (which could be a solution as well). This algorithm makes the game challenging yet playable.

	• Obstacle tracking design:
		The obstacleController first check if the game is game is ended. If not, it will loop through an array of queued obstacles and increment their z position by 2*movementUnit. Tf the z position of the obstacle is bigger than than 100, its z position will be set to 500 (flag as safe to destroy). Then I perform filter and filter out obstacles with z position >= 500 and remove them from the scene.

	• Floor tracking/recycling design:
		There are a total of 4 floor types in this game. On every update, I move the floor's z position by 2*movementUnit. If the floor's z position is bigger than 160, then we know it is behind Leo. In this case, we discretely change the z position of the floor to be at the very end of the furthest floor. The x position of the floor is randomly generated to increase the difficulty of the game and a random texture is assigned to the recycled floor.

	• Wall tracking/recycling desing:
		There are a total of 3 walls per side in this game. On every update, I move the wall's z position by 2*movementUnit. If the wall's z position at -20, then we know the previous wall is behind Leo. In this case, we discretely change the z position of the previous wall to be at the very end of the furthest wall.

	• Collision Detection:
		I consult simiar code from (source below) for this design. I created a full body bounding box that is smaller than Leo to decrease difficulty and set the material to be transparent. Upon every obstacles movement, I perform an collision detection. During the collision detection, I first acquire the a clone of the bounding box for Leo and its position and vertices. Then I loop through the array of vertices of Leo's full body mesh and apply the matrix transformation according to Leo's actual position. Then I creates a new Raycaster object from Leo's position with a direction vector that specifies the direction to the ray. A intersection check from the ray and all the obstacles and Oscars award bounding sphere is done. If Leo collide with the box before it acquired an award, the game will consider the collision first. 

	• Particle System:
		When Leo bumps into some obstacle, an explosion is set off. The generateExplosion function will first check that there are no other explosion in progress in the game. It will a geometry at Leo's x and y position with 1000 vertices and added into the particle system. The speed of explosion is reandomly generated for each vertex to make the explosion seem mroe random. When the update function see that there are particles ready to be animated, it will look thorugh perform the direction udpate 100 times for each particle before it safely removes them from the scene and sets the flag back to no explosion in progress.

	• Animation:
		I think the animation of the beginning of the game and when Leo collides with an obstacle are worth mentioning. In the beginning of the game, Leo is running in an infinte floor, this is essentially all the floor and wall tracking and recycling design working together to provide a seamless running animation. As for the game over animation, I used a flag to determine if Leo is feel off the edge or collided with objects. I then use a clock to determine if Leo should be flying up or falling down. The animation for falling off the edge is simply reducing the y value. The animation for hitting an object will cause Leo to fly up until the max y value is reached then the same fall down animation is performed.




how to:
	To play the game you would need a keyboard, mouse and build in accerlerometer is optional.
	Move Left: Press 'A' or left arrow
	Move Right: Press 'D' or right arrow
	Jump: Mouse Click, Space bar, up arrow or 'W'
	When the game is over, press 'down' to restart the game
	Use the combinations of the commands above to avoid obstacles and win home that Oscar.


sources:
	• Sound:
		• Ting wings theme song: http://www.andreasilliger.com/
		• FSX and other music: http://www.littlerobotsoundfactory.com/index.html

	• Images:
		• https://backdropoutlet.com/collections/step-and-repeat-red-carpet
		• https://pbs.twimg.com/media/CWYlkdWU4AAPtod.jpg
		• http://www.backdropsbeautiful.com/imgs/HW-4020-0950.jpg
		• minecraft-custom-skin.zip
		
	•  Object:
		• Oscars Status STL: http://woi3d.oss-cn-hangzhou.aliyuncs.com/openfiles/54040/oscar_statue.stl

	•  HTML animation:
		• https://ihatetomatoes.net/a-simple-one-page-template-with-a-preloading-screen/

	• Code inspiration:
		• Paticle system: http://stemkoski.github.io/Three.js/Particle-Engine.html
		• Collision Detection: http://stackoverflow.com/questions/11473755/how-to-detect-collision-in-three-js
		• Sound: http://www.w3schools.com/games/game_sound.asp
		• Text dispaly: http://stemkoski.github.io/Three.js/Text3D.html
		• FPS: http://www.html5gamedevs.com/topic/1828-how-to-calculate-fps-in-plain-javascript/
		• Picking: http://stemkoski.github.io/Three.js/Mouse-Click.html
		http://stackoverflow.com/questions/29366109/three-js-three-projector-has-been-moved-to


Images:
	p4_1 to P4_6.png are inculded