// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setClearColor(0x000000, 0.5);
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

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

// ===================================================================================
// custom generic ops 
var matrixStack = [];
var xMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);;

// function pushMatrix(matrix) {
//   if (matrix) {
//     matrixStack.push(matrix.clone());
//     xMatrix = matrix.clone();
//   } else {
//     matrixStack.push(xMatrix.clone());
//   }
// }

// function popMatrix() {
//   if (!matrixStack.length) {
//     throw("Can't pop from an empty matrix stack.");
//   }
//   xMatrix = matrixStack.pop();
//   return xMatrix;
// }

function rotation(axis,deg) {
  var tmpRotation;
  a = Math.cos(deg);
  b = Math.sin(deg);
  if (axis === 1) {  // rotate x
    tmpRotation = new THREE.Matrix4().set(1,0,0,0, 0,a,-b,0, 0,b,a,0, 0,0,0,1);
  } 
  else if (axis == 2) { // rotate y
    tmpRotation = new THREE.Matrix4().set(a,0,b,0, 0,1,0,0, -b,0,a,0, 0,0,0,1);
  }
  else if (axis == 3) { // rorate z
    tmpRotation = new THREE.Matrix4().set(a,-b,0,0, b,a,0,0, 0,0,1,0, 0,0,0,1);
  }
  return tmpRotation;
}

function translation(x,y,z) {
  return new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1);
}

function scale(x,y,z) {
  return new THREE.Matrix4().set(x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1);
}

function mulMatrix(matrix,app) {
  return new THREE.Matrix4().multiplyMatrices(matrix,app);
}

function applyEffect(torsoMatrixApplied) {
      var headMatrixREL = mulMatrix(torsoMatrixApplied, headMatrix);
      var tailMatrixREL = mulMatrix(torsoMatrixApplied, tailMatrix);
      var noseMatrixREL = mulMatrix(torsoMatrixApplied, noseMatrix);
      var frontLegLMatrixREL = mulMatrix(torsoMatrixApplied, frontLegLMatrix);
      var frontLegRMatrixREL = mulMatrix(torsoMatrixApplied, frontLegRMatrix);
      var backLegLMatrixREL = mulMatrix(torsoMatrixApplied, backLegLMatrix);
      var backLegRMatrixREL = mulMatrix(torsoMatrixApplied, backLegRMatrix);

      torso.setMatrix(torsoMatrixApplied); 
      head.setMatrix(headMatrixREL);
      tail.setMatrix(tailMatrixREL);
      nose.setMatrix(noseMatrixREL);
      frontLegL.setMatrix(frontLegLMatrixREL);
      frontLegR.setMatrix(frontLegRMatrixREL);
      backLegL.setMatrix(backLegLMatrixREL);
      backLegR.setMatrix(backLegRMatrixREL);

      setClawMatrix(frontClawsL, clawMatrixesFLArray, frontLegLMatrixREL);
      setClawMatrix(frontClawsR, clawMatrixesFRArray, frontLegRMatrixREL);
      setClawMatrix(backClawsL, clawMatrixesBLArray, backLegLMatrixREL);
      setClawMatrix(backClawsR, clawMatrixesBRArray, backLegRMatrixREL);
}

function populateClawsMatrix(startX, fixedY, fixedZ, spacing) {
  var claws = [];
  claws.push(new THREE.Matrix4().set(1,0,0,startX, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing*2, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing*3, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing*4, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  return claws;
}

function populateClaw(clawGeo) {
  var claws = [];
  for (i=0; i<5; i++) {
    claws.push(new THREE.Mesh(clawGeo,normalMaterial));
  }
  return claws;
}

function setClawMatrix(listofClaws, listofClawMatrix, relativeTo){
  if (listofClaws && listofClawMatrix && relativeTo) {
    for (i = 0; i < 5; i++) {
      listofClaws[i].setMatrix(mulMatrix(relativeTo,listofClawMatrix[i]));
    }
  }
}

function addClawsToScene(listofClaws) {
   if (listofClaws) {
    for (i = 0; i < 5; i++) {
      scene.add(listofClaws[i]);
    }
   }
}
// ===================================================================================


// MATERIALS
// Note: Feel free to be creative with this! 

var normalMaterial = new THREE.MeshNormalMaterial();



// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
  var unitCube = new THREE.BoxGeometry(1,1,1);
  return unitCube;
}

// GEOMETRY
var torsoGeometry = makeCube();
var non_uniform_scale = scale(5,5,8); //new THREE.Matrix4().set(5,0,0,0, 0,5,0,0, 0,0,8,0, 0,0,0,1);
torsoGeometry.applyMatrix(non_uniform_scale)

// TO-DO: SPECIFY THE REST OF YOUR STAR-NOSE MOLE'S GEOMETRY. 
// Note: You will be using transformation matrices to set the shape. 
// Note: You are not allowed to use the tools Three.js provides for 
//       rotation, translation and scaling.
// Note: The torso has been done for you (but feel free to modify it!)  
// Hint: Explicity declare new matrices using Matrix4().set     
var headGeometry = makeCube();
var uniform_scaleHead = scale(3,3,3);
headGeometry.applyMatrix(uniform_scaleHead);

var tailGeometry = makeCube();
var non_uniform_scaleTail = scale(1,1,10); 
tailGeometry.applyMatrix(non_uniform_scaleTail);

var noseGeometry = makeCube();
var uniform_scaleNose = scale(1.5,1.5,1.5);
noseGeometry.applyMatrix(uniform_scaleNose);

var frontLegGeometry = makeCube();
var non_uniform_scaleFL = scale(2.5,1,3);
frontLegGeometry.applyMatrix(non_uniform_scaleFL);

var backLegGeometry = makeCube();
var non_uniform_scaleBL = scale(2,1,2.5);
backLegGeometry.applyMatrix(non_uniform_scaleBL);

var clawGeometryLarge = makeCube();
var non_unifromscaleFinger = scale(0.35,0.35, 1.5);
clawGeometryLarge.applyMatrix(non_unifromscaleFinger);

var clawGeometrySmall = makeCube();
var non_unifromscaleFinger = scale(0.2,0.2, 1);
clawGeometrySmall.applyMatrix(non_unifromscaleFinger);

// MATRICES

// TO-DO: INITIALIZE THE REST OF YOUR MATRICES 
// Note: Use of parent attribute is not allowed.
// Hint: Keep hierarchies in mind!   
// Hint: Play around with the headTorsoMatrix values, what changes in the render? Why?         

//           World
//             |
//           Torso
//     |-------|------|-------------|--------------|
//    head    tail   frontLegs    backLegs        nose

// Main Body Part - MAIN BODY - RELATIVE TO TORSO
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,0, 0,0,0,1);
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5.4, 0,0,0,1);
var tailMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-1, 0,0,1,-5.4, 0,0,0,1);
var noseMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,7.5, 0,0,0,1);
var frontLegLMatrix = new THREE.Matrix4().set(1,0,0,2, 0,1,0,-3, 0,0,1,3.75, 0,0,0,1);
var frontLegRMatrix = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,-3, 0,0,1,3.75, 0,0,0,1);
var backLegLMatrix = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-3, 0,0,1,-2.5, 0,0,0,1);
var backLegRMatrix = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-3, 0,0,1,-2.5, 0,0,0,1);

// extra details
var clawMatrixesFLArray = populateClawsMatrix(-1,0,1.8,0.5);
var clawMatrixesFRArray = populateClawsMatrix(-1,0,1.8,0.5);
var clawMatrixesBLArray = populateClawsMatrix(-0.8,0,1.5,0.4);
var clawMatrixesBRArray = populateClawsMatrix(-0.8,0,1.5,0.4);

// TO-DO: PUT TOGETHER THE REST OF YOUR STAR-NOSED MOLE AND ADD TO THE SCENE!
// Hint: Hint: Add one piece of geometry at a time, then implement the motion for that part. 
//             Then you can make sure your hierarchy still works properly after each step.

// CREATE BODY - MAIN BODY - RELATIVE TO TORSO
var torso = new THREE.Mesh(torsoGeometry,normalMaterial);
torso.setMatrix(torsoMatrix);

var head = new THREE.Mesh(headGeometry,normalMaterial);
var headMatrixMAIN = mulMatrix(torsoMatrix, headMatrix);
head.setMatrix(headMatrixMAIN);

var tail = new THREE.Mesh(tailGeometry,normalMaterial);
var tailMatrixMAIN = mulMatrix(torsoMatrix, tailMatrix);
tail.setMatrix(tailMatrixMAIN);

var nose = new THREE.Mesh(noseGeometry,normalMaterial);
var noseMatrixMAIN = mulMatrix(torsoMatrix, noseMatrix);
nose.setMatrix(noseMatrixMAIN);

var frontLegL = new THREE.Mesh(frontLegGeometry,normalMaterial);
var frontLegLMatrixMAIN = mulMatrix(torsoMatrix, frontLegLMatrix);
frontLegL.setMatrix(frontLegLMatrixMAIN);

var frontLegR = new THREE.Mesh(frontLegGeometry,normalMaterial);
var frontLegRMatrixMAIN = mulMatrix(torsoMatrix, frontLegRMatrix);
frontLegR.setMatrix(frontLegRMatrixMAIN);

var backLegL = new THREE.Mesh(backLegGeometry,normalMaterial);
var backLegLMatrixMAIN = mulMatrix(torsoMatrix,backLegLMatrix);
backLegL.setMatrix(backLegLMatrixMAIN);

var backLegR = new THREE.Mesh(backLegGeometry,normalMaterial);
var backLegRMatrixMAIN = mulMatrix(torsoMatrix,backLegRMatrix);
backLegR.setMatrix(backLegRMatrixMAIN);

// Front Left Limb
var frontClawsL = populateClaw(clawGeometryLarge);
setClawMatrix(frontClawsL, clawMatrixesFLArray, frontLegLMatrixMAIN);
var frontClawsR = populateClaw(clawGeometryLarge);
setClawMatrix(frontClawsR, clawMatrixesFRArray, frontLegRMatrixMAIN);
var backClawsL = populateClaw(clawGeometrySmall);
setClawMatrix(backClawsL, clawMatrixesBLArray, backLegLMatrixMAIN);
var backClawsR = populateClaw(clawGeometrySmall);
setClawMatrix(backClawsR, clawMatrixesBRArray, backLegRMatrixMAIN);

// add to scene
scene.add(torso);
scene.add(head);
scene.add(tail);
scene.add(nose);
scene.add(frontLegL);
scene.add(frontLegR);
scene.add(backLegL);
scene.add(backLegR);
addClawsToScene(frontClawsL);
addClawsToScene(frontClawsR);
addClawsToScene(backClawsL);
addClawsToScene(backClawsR);

// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERNET KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length){
  p0 = p_start;
  p1 = p_end;
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

function updateBody() {
  switch(true)
  {
      case(key == "U" && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        }
        p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
        var rotateZ = rotation(1,-p);
        var torsoMatrixR = mulMatrix(torsoMatrix, rotateZ);
        applyEffect(torsoMatrixR);
      break;

      // TO-DO: IMPLEMENT JUMPCUT/ANIMATION FOR EACH KEY!
      // Note: Remember spacebar sets jumpcut/animate!
      case (key == "D" && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        }
        p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
        var rotateZ = rotation(1,p);
        var torsoMatrixR = mulMatrix(torsoMatrix, rotateZ);
        applyEffect(torsoMatrixR);
      break;


    default:
      break;
  }
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event,"U")){ 
    (key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}  

  // TO-DO: BIND KEYS TO YOUR JUMP CUTS AND ANIMATIONS
  // Note: Remember spacebar sets jumpcut/animate! 
  // Hint: Look up "threex.keyboardstate by Jerome Tienne" for more info.
  else if(keyboard.eventMatches(event,"D")){ 
    (key == "D")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "D")} 


    });

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();