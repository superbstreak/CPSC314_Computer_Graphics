/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 80, 20, 80 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 65, 20, 65 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];



//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
var view = views[0];
camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_MotherShip.position.x = view.eye[ 0 ];
camera_MotherShip.position.y = view.eye[ 1 ];
camera_MotherShip.position.z = view.eye[ 2 ];
camera_MotherShip.up.x = view.up[ 0 ];
camera_MotherShip.up.y = view.up[ 1 ];
camera_MotherShip.up.z = view.up[ 2 ];
camera_MotherShip.lookAt( scene.position );
view.camera = camera_MotherShip;
scene.add(view.camera);

var view = views[1];
camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_ScoutShip.position.x = view.eye[ 0 ];
camera_ScoutShip.position.y = view.eye[ 1 ];
camera_ScoutShip.position.z = view.eye[ 2 ];
camera_ScoutShip.up.x = view.up[ 0 ];
camera_ScoutShip.up.y = view.up[ 1 ];
camera_ScoutShip.up.z = view.up[ 2 ];
camera_ScoutShip.lookAt( scene.position );
view.camera = camera_ScoutShip;
scene.add(view.camera);


// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

//========================================================================================
// PRE DEFINED VARIABLE
//========================================================================================

// Create Solar System
var planetR = { sun: 696000,
	mercury: 2440,
	venus: 6052,
	earth: 6371,
	mars: 3389,
	jupiter: 69911,
	staturn: 58232,
	urans: 25362,
	neptune: 24622
};

// var planetDist = {
// 	sun: 0, 
// 	mercury: 5.7,
// 	venus: 10.8,
// 	earth: 15.0,
// 	mars: 22.8,
// 	jupiter: 77.9,
// 	staturn: 143.0,
// 	urans: 288.0,
// 	neptune: 450.0
// };

var planetDist = {
	sun: 0, 
	mercury: 20,
	venus: 30,
	earth: 40,
	mars: 50,
	jupiter: 60,
	staturn: 70,
	urans: 80,
	neptune: 90
};

var sunBaseSize = 500;
// var planetRelativeR = {
// 	sun: 10,
// 	mercury: (planetR.mercury/planetR.sun)*2600,
// 	venus: (planetR.venus/planetR.sun)*sunBaseSize,
// 	earth: (planetR.earth/planetR.sun)*sunBaseSize,
// 	mars: (planetR.mars/planetR.sun)*sunBaseSize,
// 	jupiter: (planetR.jupiter/planetR.sun)*sunBaseSize,
// 	staturn: (planetR.staturn/planetR.sun)*sunBaseSize,
// 	urans: (planetR.urans/planetR.sun)*sunBaseSize,
// 	neptune: (planetR.neptune/planetR.sun)*sunBaseSize
// };

var planetRelativeR = {
	sun: 10,
	mercury: 5,
	venus: 5,
	earth: 5,
	mars: 5,
	jupiter: 10,
	staturn: 5,
	urans: 5,
	neptune: 5
};

var planetRevolveSpeed = {
	mercury: 0.25,
	venus: 0.2,
	earth: 0.15,
	mars: 0.1,
	jupiter: 0.075,
	staturn: 0.05,
	urans: 0.025,
	neptune: 0.01
};


var planetRoatationDelta = {
	sun: 0.05, 
	mercury: 0.05,
	venus: 0.05,
	earth: 0.05,
	mars: 0.05,
	jupiter: 0.05,
	staturn: 0.05,
	urans: 0.05,
	neptune: 0.05
};

//========================================================================================
// CUSTOM FUNCTIONS
//========================================================================================
 
function rotateAboutAxis(object, axis, degree) {
	var rad = (degree*Math.PI)/180;
	var ident = new THREE.Matrix4();
	switch (axis) {
		case "x":
			ident.makeRotationX(rad);
		break;
		case "y":
			ident.makeRotationY(rad);
		break;
		case "z":
			ident.makeRotationZ(rad);
		break;
		default:
		break;
	}
	object.setMatrix(mulMatrix(object.matrix,ident));
}

function mulMatrix(matrix,app) {
  return new THREE.Matrix4().multiplyMatrices(matrix,app);
}

//========================================================================================
// GEOMETRY
//========================================================================================
var geometry = new THREE.SphereGeometry(planetRelativeR.sun, 32, 32);
generateVertexColors( geometry );
var geometryMercury = new THREE.SphereGeometry(planetRelativeR.mercury, 20, 20 );
var geometryVenus = new THREE.SphereGeometry(planetRelativeR.venus, 20, 20 );
var geometryEarth = new THREE.SphereGeometry(planetRelativeR.earth, 20, 20 );
var geometryMars = new THREE.SphereGeometry(planetRelativeR.mars, 20, 20 );
var geometryJupiter = new THREE.SphereGeometry(planetRelativeR.jupiter, 20, 20 );
var geometrySaturn = new THREE.SphereGeometry(planetRelativeR.staturn, 20, 20 );
var geometryUrans = new THREE.SphereGeometry(planetRelativeR.urans, 20, 20 );
var geometryNeptune = new THREE.SphereGeometry(planetRelativeR.neptune, 20, 20 );

//========================================================================================
// MATRERIAL
//========================================================================================
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var material = new THREE.MeshNormalMaterial();
var materialMercury = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var materialVenus = new THREE.MeshBasicMaterial( {color: 0xff9900} );
var materialEarth = new THREE.MeshBasicMaterial( {color: 0x33cc33} );
var materialMars = new THREE.MeshBasicMaterial( {color: 0x0066ff} );
var materialJupiter = new THREE.MeshBasicMaterial( {color: 0x9900cc} );
var materialSaturn = new THREE.MeshBasicMaterial( {color: 0xff33cc} );
var materialUrans = new THREE.MeshBasicMaterial( {color: 0x996633} );
var materialNeptune = new THREE.MeshBasicMaterial( {color: 0x00ffff} );

//========================================================================================
// OBJECTS
//========================================================================================
var sun = new THREE.Mesh( geometry, material );
var mercury = new THREE.Mesh( geometryMercury, materialMercury );
var venus = new THREE.Mesh( geometryVenus, materialVenus );
var earth = new THREE.Mesh( geometryEarth, materialEarth );
var mars = new THREE.Mesh( geometryMars, materialMars );
var jupiter = new THREE.Mesh( geometryJupiter, materialJupiter );
var staturn = new THREE.Mesh( geometrySaturn, materialSaturn );
var urans = new THREE.Mesh( geometryUrans, materialUrans );
var neptune = new THREE.Mesh( geometryNeptune, materialNeptune );

//========================================================================================
// MODIFY INIT POS
//========================================================================================
mercury.position.x = planetDist.mercury;
venus.position.x = planetDist.venus;
earth.position.x = planetDist.earth;
mars.position.x = planetDist.mars;
jupiter.position.x = planetDist.jupiter;
staturn.position.x = planetDist.staturn;
urans.position.x = planetDist.urans;
neptune.position.x = planetDist.neptune;

//========================================================================================
// ADD OBJECT TO SCENE
//========================================================================================
scene.add( sun );
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(jupiter);
scene.add(staturn);
scene.add(urans);
scene.add(neptune);


//========================================================================================
// UPDATE SYSTEM - ANIMATION
//========================================================================================

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
var t = 0;
function updateSystem() 
{
	// ANIMATE YOUR SOLAR SYSTEM HERE.
	// self rotation about its own y axis
	var delta = clock.getDelta()
	sun.rotation.y += planetRoatationDelta.sun*delta;
	mercury.rotation.y += planetRoatationDelta.mercury*delta;
	venus.rotation.y += planetRoatationDelta.venus*delta;
	earth.rotation.y += planetRoatationDelta.earth*delta;
	mars.rotation.y += planetRoatationDelta.mars*delta;
	jupiter.rotation.y += planetRoatationDelta.jupiter*delta;
	staturn.rotation.y += planetRoatationDelta.staturn*delta;
	urans.rotation.y += planetRoatationDelta.urans*delta;
	neptune.rotation.y += planetRoatationDelta.neptune*delta;

	// orbit around the sun at defined distance and speed away
	mercury.position.x = Math.sin(t*planetRevolveSpeed.mercury)*planetDist.mercury;
	mercury.position.z = Math.cos(t*planetRevolveSpeed.mercury)*planetDist.mercury;
	venus.position.x = Math.sin(t*planetRevolveSpeed.venus)*planetDist.venus;
	venus.position.z = Math.cos(t*planetRevolveSpeed.venus)*planetDist.venus;
	earth.position.x = Math.sin(t*planetRevolveSpeed.earth)*planetDist.earth;
	earth.position.z = Math.cos(t*planetRevolveSpeed.earth)*planetDist.earth;
	mars.position.x = Math.sin(t*planetRevolveSpeed.mars)*planetDist.mars;
	mars.position.z = Math.cos(t*planetRevolveSpeed.mars)*planetDist.mars;
	jupiter.position.x = Math.sin(t*planetRevolveSpeed.jupiter)*planetDist.jupiter;
	jupiter.position.z = Math.cos(t*planetRevolveSpeed.jupiter)*planetDist.jupiter;
	staturn.position.x = Math.sin(t*planetRevolveSpeed.staturn)*planetDist.staturn;
	staturn.position.z = Math.cos(t*planetRevolveSpeed.staturn)*planetDist.staturn;
	urans.position.x = Math.sin(t*planetRevolveSpeed.urans)*planetDist.urans;
	urans.position.z = Math.cos(t*planetRevolveSpeed.urans)*planetDist.urans;
	neptune.position.x = Math.sin(t*planetRevolveSpeed.neptune)*planetDist.neptune;
	neptune.position.z = Math.cos(t*planetRevolveSpeed.neptune)*planetDist.neptune;
	t += Math.PI/180*2;


}

//========================================================================================
// KEYBOARD COMMANDS
//========================================================================================

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
		
function onKeyDown(event)
{
	// TO-DO: BIND KEYS TO YOUR CONTROLS	  
  if(keyboard.eventMatches(event,"shift+g"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }   

}
keyboard.domElement.addEventListener('keydown', onKeyDown );
		

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}

update();