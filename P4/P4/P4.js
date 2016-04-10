// =================================================================================
//	CPSC 314 P4 -Leo's Hunt for Oscars
//  Chia - Hsuan Wu
// 	42764118
// 	y4d8
// =================================================================================

// =================================================================================
//  LOADING PAGE: Modified version of a tutorial by @ihatetomatoes
// =================================================================================
var loadingCounter = 0;
var loadingProgress = 0;

// on page loading
function loadProgress(imgLoad, image){
    loadingCounter +=  10;
    loadingProgress = (loadingCounter/100);
    TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});
}

var progressTl = new TimelineMax({
    paused: true,
    onUpdate: progressUpdate,
    onComplete: loadComplete
});
 
progressTl.to($('.progress span'), 1, {width:100, ease:Linear.easeNone});
 
 // upate the loading bar
function progressUpdate() {
    loadingProgress = Math.round(progressTl.progress() * 100);
    $(".txt-perc").text(loadingProgress + '%');
}

// finished loading update start animation
function loadComplete() {
  $("body").css("overflow", "hidden");
    var preloaderOutTl = new TimelineMax();
    preloaderOutTl
        .to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
        .to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
        .to($('.greetings'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
        .set($('body'), {className: '-=is-loading'})
        .to($('#preloader'), 0.7, {yPercent: 100, ease:Power4.easeInOut})
        .set($('#preloader'), {className: '+=is-hidden'})
    isPaused = false;
    return preloaderOutTl;
}

// update hud
function updateGameStat(dist, numNom) {
  if (!isGameEnded) {
    if (dist < 0) {
      dist = 0;
    }
    document.getElementById("distance").innerHTML = "Distance: "+dist+" m";
  }
}


// =================================================================================
//  AZURE - LEADERBOARD
// =================================================================================
var client;

// connect to backend
$(document).ready(function(){
    client = new WindowsAzure.MobileServiceClient(
    "https://oscarshunt-superbstreak.azure-mobile.net/",
    "ZDHrJPJQWRgJuOpKrKIHBRxdolqSid82"
    );   
});

// acquire leaderboard table and perform sorting
function getLeaderBoard(winner){
  if (client) {
    $('.results').empty(); // empty this
    var personalRanking = '> 20';
    var relativeRank = -1;
    client.getTable('leaderboard').orderBy("is_win").orderByDescending("distance_run").take(20).read().done(function(results){
      var len = results.length;
      var won = [];
      var lost = [];
      for(var i=0;i<len;i++){
        var data = results[i];
        if (data.is_win == 'true') {
          won.push(data);
        } else {
          lost.push(data);
        }
      }
      won = won.reverse();
      var rank = 0;
      for(var i=0;i<won.length;i++){
        var data = won[i];
        rank = i+1;
        $("<tr><th>"+rank+"</th><th>"+data.is_win+"</th><th>"+data.distance_run+"</th><th>"+data.date+"</th></tr>").appendTo('.leaderboard-tab');
        if (winner && distance < parseInt(data.distance_run)) {
          relativeRank = rank;
        }
      }
      for(var i=0;i<lost.length;i++){
        var data = lost[i];
        rank += 1;
        $("<tr><th>"+rank+"</th><th>"+data.is_win+"</th><th>"+data.distance_run+"</th><th>"+data.date+"</th></tr>").appendTo('.leaderboard-tab');
        if (!winner && distance >= parseInt(data.distance_run) && relativeRank == -1) {
          relativeRank = rank;
        }
      }
      if (relativeRank > -1) {
        personalRanking = relativeRank+"";
      }
      document.getElementById('personal-ranking').innerHTML = "You Ranked: "+personalRanking;
    });
    
    document.getElementById("distance").innerHTML = "Distance: "+distance+" m";
    document.getElementById('center-screen').className = '-=hidden';
  }     
}

// auto submit user high score
function submitHighScore(dist, win) {
  try {
    if (isGameEnded && dist > 0 ) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
          dd='0'+dd
      } 
      if(mm<10) {
          mm='0'+mm
      } 
      today = mm+'/'+dd+'/'+yyyy
      var obj={'date':today, 'distance_run':dist, 'is_win':win};
      client.getTable("leaderboard").insert(obj).done(function(result){
        getLeaderBoard(win);
      });
    }
  } catch(err) {
    console.log(err);
  }
}


// =================================================================================
//	Define
// =================================================================================

// game stat
var isStarted = false;
var isPaused = true;
var isProduction = true;
var useMotion = false;
var isGameEnded = false;
var isGameAnimation = false;
var isFallOff = false;
var isWon = false;
var distance = -560;
var numNomination = 0;
var showAward = false;

// game control  
var boundry = {left: -15, right: 15};
var gameSpeed = 1;
var movementUnit = 1;
var runningFlipFlop = true;
var leoVision = true;
var hasParticle = false;

// global
var clock = new THREE.Clock(true);
var timeRecord = clock.getElapsedTime();
var jumpRecord = {jumpEnable: false, startTime: timeRecord, isJumping: true};
var obstacles = [];
var nominations  = [];
var obstacles = [];
var awardsBound;
var oscarsAwared = {x: 0, y: 0, z: 0};
var secondWallSet = true;
var lastDeviceMotion = 0;
var LeoLevel = 1;
var floors = [];
var floorsX = [];
var overwriteGameOverAnimation = false;
var projector =  new THREE.Projector();
var particleFly = 0;
var explosionGeo;
var directions;
var particles;

// sounds
var backgroundMusic = new sound("./music/tiny_wings_theme.mp3", true);
var jumpFSX = new sound("./music/jump.wav", false);  // http://www.littlerobotsoundfactory.com/
var slideFSX = new sound("./music/slide.mp3", false);
var collisionFSX = new sound("./music/collision.mp3", false);
var winFSX = new sound("./music/win.wav", false);
var loseFSX = new sound("./music/lose.wav", false);
var credit = new sound("./music/credit.mp3", true);
var drifting = new sound("./music/drifting.mp3", true);

credit.play();


// =================================================================================
//	API
// =================================================================================

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

// var stats = new Stats();
// document.body.appendChild(stats.domElement);



// =================================================================================
//  SETUP CAMERA
// =================================================================================

// SETUP CAMERAS
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
var cameraTopDown = new THREE.OrthographicCamera(-1*window.innerWidth/4,window.innerWidth/4,window.innerHeight/4,-1*window.innerHeight/4,-50,200);
var cameraLeo = new THREE.PerspectiveCamera(35, aspect, 0.1, 10000);
var ambientLight = new THREE.AmbientLight( 0xffffff );



// =================================================================================
//	SETUP RENDERER & SCENE
// =================================================================================

//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
canvas.appendChild(renderer.domElement);
if (isProduction) {
  scene.fog = new THREE.FogExp2( 0x000000, 0.004 );
  renderer.setClearColor( scene.fog.color, 1 );
} else {
  numNomination = 999;
  renderer.setClearColor(  0x000000 );
  var controls = new THREE.OrbitControls(camera);
}



// =================================================================================
//	SETUP WINDOW PROPERTIES
// =================================================================================

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}


// =================================================================================
//	TEXTURES
// =================================================================================

// FLOOR WITH CHECKERBOARD 
var floorTexture1 = new THREE.TextureLoader().load('images/floor/f1.png');
var floorTexture2 = new THREE.TextureLoader().load('images/floor/f2.png');
var floorTexture3 = new THREE.TextureLoader().load('images/floor/f3.png');
var floorTexture4 = new THREE.TextureLoader().load('images/floor/f4.png');
var floorTexture5 = new THREE.TextureLoader().load('images/floor/f5.png');
var floorTexture6 = new THREE.TextureLoader().load('images/floor/f6.jpg');
var floorTexture7 = new THREE.TextureLoader().load('images/floor/f7.png');
var floorTexture8 = new THREE.TextureLoader().load('images/floor/f8.png');
var floorTexture9 = new THREE.TextureLoader().load('images/floor/f9.png');
var floorTexture10 = new THREE.TextureLoader().load('images/floor/f10.png');
var floorTexture11 = new THREE.TextureLoader().load('images/floor/f11.png');
var floorTexture12 = new THREE.TextureLoader().load('images/floor/f12.png');
var floorTexture13 = new THREE.TextureLoader().load('images/floor/f13.png');
var floorTexture14 = new THREE.TextureLoader().load('images/floor/f14.png');
var floorTexture15 = new THREE.TextureLoader().load('images/floor/f15.png');
var floorTexture16 = new THREE.TextureLoader().load('images/floor/f16.png');
var floorTexture17 = new THREE.TextureLoader().load('images/floor/f17.png');
var floorTexture18 = new THREE.TextureLoader().load('images/floor/f18.png');
var floorTexture19 = new THREE.TextureLoader().load('images/floor/f19.png');
var floorTexture20 = new THREE.TextureLoader().load('images/floor/f20.png');
var floorTexture21 = new THREE.TextureLoader().load('images/floor/f21.png');
var floorTexture22 = new THREE.TextureLoader().load('images/floor/f22.png');
var floorTexture23 = new THREE.TextureLoader().load('images/floor/f23.png');
var floorTexture24 = new THREE.TextureLoader().load('images/floor/f24.png');

var nominationTexture = new THREE.TextureLoader().load('images/nomination.png');
var redGradient = new THREE.TextureLoader().load('images/red-grad.jpg');
var blueGradient = new THREE.TextureLoader().load('images/blue-grad.png');

var wallTexture1 = new THREE.TextureLoader().load('images/PZ/p1.jpg');
var wallTexture2 = new THREE.TextureLoader().load('images/PZ/p2.jpg');
var wallTexture3 = new THREE.TextureLoader().load('images/PZ/p3.jpg');
var wallTexture4 = new THREE.TextureLoader().load('images/PZ/p4.jpg');
var wallTexture5 = new THREE.TextureLoader().load('images/PZ/p5.jpg');
var wallTexture6 = new THREE.TextureLoader().load('images/PZ/p6.jpg');
var wallTexturewin = new THREE.TextureLoader().load('images/PZ-win.jpg');

nominationTexture.wrapS = nominationTexture.wrapT = THREE.RepeatWrapping;
floorTexture1.wrapS = floorTexture1.wrapT = THREE.RepeatWrapping;
floorTexture2.wrapS = floorTexture2.wrapT = THREE.RepeatWrapping;
floorTexture3.wrapS = floorTexture3.wrapT = THREE.RepeatWrapping;
floorTexture4.wrapS = floorTexture4.wrapT = THREE.RepeatWrapping;
floorTexture5.wrapS = floorTexture5.wrapT = THREE.RepeatWrapping;
floorTexture6.wrapS = floorTexture6.wrapT = THREE.RepeatWrapping;
floorTexture7.wrapS = floorTexture7.wrapT = THREE.RepeatWrapping;
floorTexture8.wrapS = floorTexture8.wrapT = THREE.RepeatWrapping;
floorTexture9.wrapS = floorTexture9.wrapT = THREE.RepeatWrapping;
floorTexture10.wrapS = floorTexture10.wrapT = THREE.RepeatWrapping;
floorTexture11.wrapS = floorTexture11.wrapT = THREE.RepeatWrapping;
floorTexture12.wrapS = floorTexture12.wrapT = THREE.RepeatWrapping;
floorTexture13.wrapS = floorTexture13.wrapT = THREE.RepeatWrapping;
floorTexture14.wrapS = floorTexture14.wrapT = THREE.RepeatWrapping;
floorTexture15.wrapS = floorTexture15.wrapT = THREE.RepeatWrapping;
floorTexture16.wrapS = floorTexture16.wrapT = THREE.RepeatWrapping;
floorTexture17.wrapS = floorTexture17.wrapT = THREE.RepeatWrapping;
floorTexture18.wrapS = floorTexture18.wrapT = THREE.RepeatWrapping;
floorTexture19.wrapS = floorTexture19.wrapT = THREE.RepeatWrapping;
floorTexture20.wrapS = floorTexture20.wrapT = THREE.RepeatWrapping;
floorTexture21.wrapS = floorTexture21.wrapT = THREE.RepeatWrapping;
floorTexture22.wrapS = floorTexture22.wrapT = THREE.RepeatWrapping;
floorTexture23.wrapS = floorTexture23.wrapT = THREE.RepeatWrapping;
floorTexture24.wrapS = floorTexture24.wrapT = THREE.RepeatWrapping;

wallTexture1.wrapS = wallTexture1.wrapT = THREE.RepeatWrapping;
wallTexture2.wrapS = wallTexture2.wrapT = THREE.RepeatWrapping;
wallTexture3.wrapS = wallTexture3.wrapT = THREE.RepeatWrapping;
wallTexture4.wrapS = wallTexture4.wrapT = THREE.RepeatWrapping;
wallTexture5.wrapS = wallTexture5.wrapT = THREE.RepeatWrapping;
wallTexture6.wrapS = wallTexture6.wrapT = THREE.RepeatWrapping;
wallTexturewin.wrapS = wallTexturewin.wrapT = THREE.RepeatWrapping;

nominationTexture.repeat.set(1,1);
floorTexture1.repeat.set(4, 4);
floorTexture2.repeat.set(4, 4);
floorTexture3.repeat.set(4, 4);
floorTexture4.repeat.set(4, 4);
floorTexture5.repeat.set(4, 4);
floorTexture6.repeat.set(4, 4);
floorTexture7.repeat.set(4, 4);
floorTexture8.repeat.set(4, 4);
floorTexture9.repeat.set(4, 4);
floorTexture10.repeat.set(4, 4);
floorTexture11.repeat.set(4, 4);
floorTexture12.repeat.set(4, 4);
floorTexture13.repeat.set(4, 4);
floorTexture14.repeat.set(4, 4);
floorTexture15.repeat.set(4, 4);
floorTexture16.repeat.set(4, 4);
floorTexture17.repeat.set(4, 4);
floorTexture18.repeat.set(4, 4);
floorTexture19.repeat.set(4, 4);
floorTexture20.repeat.set(4, 4);
floorTexture21.repeat.set(4, 4);
floorTexture22.repeat.set(4, 4);
floorTexture23.repeat.set(4, 4);
floorTexture24.repeat.set(4, 4);




// =================================================================================
//	GEOMETRY
// =================================================================================

// Leo Geometry
var GeometryLeoFullBodyFrame = new THREE.BoxGeometry(9.5,16,2);
var GeometryLeoTorso = new THREE.BoxGeometry(6,7,6.5);
var GeometryLeoHead = new THREE.BoxGeometry(4,4,4);
var GeometryLeoLeftArm = new THREE.BoxGeometry(2,8,2);
var GeometryLeoRightArm = new THREE.BoxGeometry(2,8,2);
var GeometryLeoLeftLeg = new THREE.BoxGeometry(2,12,2);
var GeometryLeoRightLeg = new THREE.BoxGeometry(2,12,2);

// floor
var floorGeometryA = new THREE.PlaneBufferGeometry(40, 160);
var floorGeometryB = new THREE.PlaneBufferGeometry(30, 160);
var floorGeometryC = new THREE.PlaneBufferGeometry(20, 160);
var floorGeometryD = new THREE.PlaneBufferGeometry(10, 160);

// obstacle
var GeometryObstacleA = new THREE.BoxGeometry(8,16,8);
var GeometryObstacleB = new THREE.BoxGeometry(8,4,4);
var GeometryObstacleC = new THREE.BoxGeometry(8,8,16);
var GeometryObstacleD = new THREE.BoxGeometry(16,4,4);

// nomination
var GeometryNomination = new THREE.BoxGeometry(3,3,1.5);

// wall planes
var GeomoetryWall = new THREE.PlaneGeometry( 240, 100, 4, 4);

// award
var sphereGeometry = new THREE.SphereGeometry(10, 32, 16);
var sphereGeometryCore = new THREE.SphereGeometry(6, 32, 16);




// =================================================================================
//	MATERIAL
// =================================================================================

// Leo Material
var material = new THREE.MeshNormalMaterial();
var leoMaterial = new THREE.MeshBasicMaterial();
var blackMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
var blueMaterial = new THREE.MeshLambertMaterial({map: blueGradient , side: THREE.DoubleSide});
var brownMaterial = new THREE.MeshLambertMaterial({color: 0x614126});
var redMaterial = new THREE.MeshLambertMaterial({map: redGradient , side: THREE.DoubleSide});
var transparentMaterial = new THREE.MeshBasicMaterial( { color: 0x555555, transparent: true, opacity: 0 } );

// floor
var floorMaterial1 = new THREE.MeshLambertMaterial({ map: floorTexture1, side: THREE.DoubleSide });
var floorMaterial2 = new THREE.MeshLambertMaterial({ map: floorTexture2, side: THREE.DoubleSide });
var floorMaterial3 = new THREE.MeshLambertMaterial({ map: floorTexture3, side: THREE.DoubleSide });
var floorMaterial4 = new THREE.MeshLambertMaterial({ map: floorTexture4, side: THREE.DoubleSide });
var floorMaterial5 = new THREE.MeshLambertMaterial({ map: floorTexture5, side: THREE.DoubleSide });
var floorMaterial6 = new THREE.MeshLambertMaterial({ map: floorTexture6, side: THREE.DoubleSide });
var floorMaterial7 = new THREE.MeshLambertMaterial({ map: floorTexture7, side: THREE.DoubleSide });
var floorMaterial8 = new THREE.MeshLambertMaterial({ map: floorTexture8, side: THREE.DoubleSide });
var floorMaterial9 = new THREE.MeshLambertMaterial({ map: floorTexture9, side: THREE.DoubleSide });
var floorMaterial10 = new THREE.MeshLambertMaterial({ map: floorTexture10, side: THREE.DoubleSide });
var floorMaterial11 = new THREE.MeshLambertMaterial({ map: floorTexture11, side: THREE.DoubleSide });
var floorMaterial12 = new THREE.MeshLambertMaterial({ map: floorTexture12, side: THREE.DoubleSide });
var floorMaterial13 = new THREE.MeshLambertMaterial({ map: floorTexture13, side: THREE.DoubleSide });
var floorMaterial14 = new THREE.MeshLambertMaterial({ map: floorTexture14, side: THREE.DoubleSide });
var floorMaterial15 = new THREE.MeshLambertMaterial({ map: floorTexture15, side: THREE.DoubleSide });
var floorMaterial16 = new THREE.MeshLambertMaterial({ map: floorTexture16, side: THREE.DoubleSide });
var floorMaterial17 = new THREE.MeshLambertMaterial({ map: floorTexture17, side: THREE.DoubleSide });
var floorMaterial18 = new THREE.MeshLambertMaterial({ map: floorTexture18, side: THREE.DoubleSide });
var floorMaterial19 = new THREE.MeshLambertMaterial({ map: floorTexture19, side: THREE.DoubleSide });
var floorMaterial20 = new THREE.MeshLambertMaterial({ map: floorTexture20, side: THREE.DoubleSide });
var floorMaterial21 = new THREE.MeshLambertMaterial({ map: floorTexture21, side: THREE.DoubleSide });
var floorMaterial22 = new THREE.MeshLambertMaterial({ map: floorTexture22, side: THREE.DoubleSide });
var floorMaterial23 = new THREE.MeshLambertMaterial({ map: floorTexture23, side: THREE.DoubleSide });
var floorMaterial24 = new THREE.MeshLambertMaterial({ map: floorTexture24, side: THREE.DoubleSide });

// obstacle

// nomination
var nominationMaterial = new THREE.MeshBasicMaterial({map: nominationTexture, side: THREE.DoubleSide});

// awards
var explosionMaterial = new THREE.ParticleBasicMaterial({ 
    size: 10,  
    color: 0xffffff });

// wall
var wallMaterial1 = new THREE.MeshBasicMaterial( {map: wallTexture1} );
var wallMaterial2 = new THREE.MeshBasicMaterial( {map: wallTexture2} );
var wallMaterial3 = new THREE.MeshBasicMaterial( {map: wallTexture3} );
var wallMaterial4 = new THREE.MeshBasicMaterial( {map: wallTexture4} );
var wallMaterial5 = new THREE.MeshBasicMaterial( {map: wallTexture5} );
var wallMaterial6 = new THREE.MeshBasicMaterial( {map: wallTexture6} );
var wallMaterialWin = new THREE.MeshBasicMaterial({map: wallTexturewin});


// =================================================================================
// OBJ
// =================================================================================
// function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
//   var onProgress = function(query) {
//     if ( query.lengthComputable ) {
//       var percentComplete = query.loaded / query.total * 100;
//       console.log( Math.round(percentComplete, 2) + '% downloaded' );
//     }
//   };

//   var onError = function() {
//     console.log('Failed to load ' + file);
//   };

//   var loader = new THREE.OBJLoader()
//   loader.load(file, function(object) {
//     object.traverse(function(child) {
//       if (child instanceof THREE.Mesh) {
//         child.material = material;
//       }
//     });

//     object.position.set(xOff,yOff,zOff);
//     object.rotation.x= xRot;
//     object.rotation.y = yRot;
//     object.rotation.z = zRot;
//     object.scale.set(scale,scale,scale);
//     object.parent = floor;
//     scene.add(object);

//   }, onProgress, onError);
// }


// =================================================================================
// GLSL
// =================================================================================

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(0.8,0.8,0.8);
var ambientColor = new THREE.Color(1,0.84,0);
var lightPosition = new THREE.Vector3(90,100,20);
var glowColorR = new THREE.Color(0xFF9900);
var kAmbient = 0.6;
var kDiffuse = 0.5;
var kSpecular = 0.5;
var shininess = 2.0;

var phongMateral = new THREE.ShaderMaterial({
  uniforms :{
    lightColorK: {type: 'c', value: lightColor},
    ambientColor: {type: 'c', value: ambientColor},
    lightPosition: {type: 'v3', value: lightPosition},
    kAmbient: {type: 'f', value: kAmbient},
    kDiffuse: {type: 'f', value: kDiffuse},
    kSpecular: {type: 'f', value: kSpecular},
    shininess: {type: 'f', value: shininess},
  },
});

var glowMaterial = new THREE.ShaderMaterial({
   uniforms :{ 
      glowColor: { type: 'c', value: glowColorR},
    },
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

var shaderFiles = [
  './glsl/phong.vs.glsl',
  './glsl/phong.fs.glsl',
  './glsl/glow.vs.glsl',
  './glsl/glow.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  phongMateral.vertexShader = shaders['./glsl/phong.vs.glsl'];
  phongMateral.fragmentShader = shaders['./glsl/phong.fs.glsl'];
  phongMateral.needsUpdate = true;

  glowMaterial.vertexShader = shaders['./glsl/glow.vs.glsl'];
  glowMaterial.fragmentShader = shaders['./glsl/glow.fs.glsl'];
  glowMaterial.needsUpdate = true;
});


// =================================================================================
//	MESH
// =================================================================================

// Leo Mesh
var MeshLepoFullBody = new THREE.Mesh(GeometryLeoFullBodyFrame, transparentMaterial);
var MeshLeoTorso = new THREE.Mesh( GeometryLeoTorso, blueMaterial );
var MeshLeoHead = new THREE.Mesh( GeometryLeoHead, brownMaterial );
var MeshLeoLArm = new THREE.Mesh( GeometryLeoLeftArm, blueMaterial );
var MeshLeoRArm = new THREE.Mesh( GeometryLeoRightArm, blueMaterial );
var MeshLeoLLeg = new THREE.Mesh( GeometryLeoLeftLeg, redMaterial );
var MeshLeoRLeg = new THREE.Mesh( GeometryLeoRightLeg, redMaterial );

// floor
var floorA = new THREE.Mesh(floorGeometryA, randomFloorMaterial());
var floorB = new THREE.Mesh(floorGeometryB, randomFloorMaterial());
var floorC = new THREE.Mesh(floorGeometryC, randomFloorMaterial());
var floorD = new THREE.Mesh(floorGeometryD, randomFloorMaterial());

// obstacle

// nomination
var MeshNomination = new THREE.Mesh(GeometryNomination, nominationMaterial);

// awards
var MeshAwards;
var sphereGlow = new THREE.Mesh(sphereGeometry, glowMaterial);
var awardsBound = new THREE.Mesh(sphereGeometryCore, transparentMaterial);


// wall
var MeshWallLfront = new THREE.Mesh( GeomoetryWall, wallMaterial1 );
var MeshWallLmid = new THREE.Mesh( GeomoetryWall, wallMaterial2 );
var MeshWallLback = new THREE.Mesh( GeomoetryWall, wallMaterial3 );

var MeshWallRfront = new THREE.Mesh( GeomoetryWall, wallMaterial1 );
var MeshWallRmid = new THREE.Mesh( GeomoetryWall, wallMaterial2 );
var MeshWallRback = new THREE.Mesh( GeomoetryWall, wallMaterial3 );

// Text
var MeshText;
var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
var materialArray = [ materialFront, materialSide ];
var textMaterial = new THREE.MeshFaceMaterial(materialArray);
var loader = new THREE.FontLoader();


// =================================================================================
// STL
// =================================================================================
new THREE.STLLoader().load( './obj/oscar_statue.stl', function ( geometry ) {
    MeshAwards = new THREE.Mesh( geometry, phongMateral );
    MeshAwards.rotation.x = - Math.PI/2;
    MeshAwards.rotation.z = Math.PI/2;
    MeshAwards.position.y = - 10;
    MeshAwards.scale.x = 0.06;
    MeshAwards.scale.y = 0.06;
    MeshAwards.scale.z = 0.06;
    scene.add(MeshAwards);
    sphereGlow.position.set(MeshAwards.position);
    scene.add(sphereGlow);
}); 


// =================================================================================
//	MESH CONFIG
// =================================================================================

// Leo
MeshLepoFullBody.position.y = 9;
MeshLepoFullBody.position.z = 50;
MeshLeoTorso.position.y = 9;
MeshLeoTorso.position.z = 50;
MeshLeoHead.position.y = 5.5;
MeshLeoLArm.position.x = -4;
MeshLeoLArm.position.y = -1;
MeshLeoRArm.position.x = 4;
MeshLeoRArm.position.y = -1;
MeshLeoLLeg.position.x = -1.5;
MeshLeoLLeg.position.y = -3.5;
MeshLeoRLeg.position.x = 1.5;
MeshLeoRLeg.position.y = -3.5;

// camera
camera.position.set(0,60,135);
camera.lookAt(MeshLeoHead.position); 
cameraLeo.position.set(MeshLeoHead.position.x, MeshLeoHead.position.y, MeshLeoHead.position.z);
cameraLeo.lookAt(0,20,-50);
cameraTopDown.position.set(0,150,0);
cameraTopDown.lookAt(MeshLeoHead.position);

// floor
floorA.position.y = -0.1;
floorA.rotation.x = Math.PI / 2;

floorB.position.y = 20.9;
floorB.position.z = -160;
floorB.rotation.x = Math.PI / 2;

floorC.position.y = 40.9;
floorC.position.z = -320;
floorC.rotation.x = Math.PI / 2;

floorD.position.y = 60.9;
floorD.position.z = -480;
floorD.rotation.x = Math.PI / 2;

// wall
MeshWallLfront.rotation.y = Math.PI/2;
MeshWallLfront.position.set(-20,30,-50);
MeshWallLmid.rotation.y = Math.PI/2;
MeshWallLmid.position.set(-20,30,-290);
MeshWallLback.rotation.y = Math.PI/2;
MeshWallLback.position.set(-20,30,-530);

MeshWallRfront.rotation.y = -Math.PI/2;
MeshWallRfront.position.set(20,30,-50);
MeshWallRmid.rotation.y = -Math.PI/2;
MeshWallRmid.position.set(20,30,-290);
MeshWallRback.rotation.y = -Math.PI/2;
MeshWallRback.position.set(20,30,-530);

// award
awardsBound.position.y = -10;




// =================================================================================
//  ADD OBJECT TO PARENT
// =================================================================================

// Leo Object
MeshLeoHead.castShadow = true;
MeshLeoRArm.castShadow = true;
MeshLeoLArm.castShadow = true;
MeshLeoLLeg.castShadow = true;
MeshLeoRLeg.castShadow = true;
MeshLeoTorso.castShadow = true;
MeshLeoTorso.add(MeshLeoHead);
MeshLeoTorso.add(MeshLeoLArm);
MeshLeoTorso.add(MeshLeoRArm);
MeshLeoTorso.add(MeshLeoLLeg);
MeshLeoTorso.add(MeshLeoRLeg);

// scene
scene.add(camera);
scene.add(ambientLight);
scene.add(MeshLeoTorso);
scene.add(MeshLepoFullBody);
scene.add(awardsBound);

initializeLevels();

scene.add(MeshWallLfront);
scene.add(MeshWallLmid);
scene.add(MeshWallLback);
scene.add(MeshWallRfront);
scene.add(MeshWallRmid);
scene.add(MeshWallRback);


var headOnLight = new THREE.PointLight( 0xffffff, 2, 0 );
headOnLight.castShadow = true;
headOnLight.position.set(0,0,40);
scene.add(headOnLight);

var topDownLight = new THREE.SpotLight(0x555555);
topDownLight.position.set(50,300,0);
topDownLight.castShadow = true;
topDownLight.shadowDarkness = 1;
topDownLight.intensity = 1;
scene.add(topDownLight);


// =================================================================================
//	Functions
// =================================================================================

// initlize floors
function initializeLevels () {
  if (!isGameEnded) {
      var fA = floorA.clone();
      var fB = floorB.clone();
      var fC = floorC.clone();
      var fD = floorD.clone();
      fA.receiveShadow = true;
      fB.receiveShadow = true;
      fC.receiveShadow = true;
      fD.receiveShadow = true;
      fA.position.y = -0.1;
      fB.position.y = -0.1;
      fC.position.y = -0.1;
      fD.position.y = -0.1;
      floors.push(fA);
      floors.push(fB);
      floors.push(fC);
      floors.push(fD);
      scene.add(fA);
      scene.add(fB);
      scene.add(fC);
      scene.add(fD);
      generateOnBoardingObstacles();
      displayText("CLICK TO START", 10, 3, -Math.PI /6);
  }
}

// make the award appear with probability or disappear
function toggleAward (toggle) {
  if (MeshAwards && !isGameEnded) {
    MeshAwards.position.y = - 10;
    sphereGlow.position.y = - 10;
    awardsBound.position.y = - 10;
    var random = randomIntGen(1,5);
    if (toggle && random == 5) {
      MeshAwards.position.z = -30;
      MeshAwards.position.x = randomIntGen(-20, 20);
      MeshAwards.position.y = randomIntGen(10, 30);
      sphereGlow.position.z = -30;
      sphereGlow.position.x = MeshAwards.position.x;
      sphereGlow.position.y = MeshAwards.position.y;
      awardsBound.position.z = -30;
      awardsBound.position.x = MeshAwards.position.x;
      awardsBound.position.y = MeshAwards.position.y;
    }
  }
}

// When picking is done, when user click on the text and start the game
function readySetGo(){
  if(!isStarted) {
    for (var i = 0; i < 4; i++) {
      floors[i].position.z = i*(-160);
    }
    MeshText.rotation.x = 0;
    isStarted = true;
    credit.stop();
    backgroundMusic.play();
  }
}

// =================================
//  OBJECT GENERATION
// =================================

// geneate 8 bits for each lane, and determine if it is a solution lane or not
function generateNextStage(laneType, newX) {
  if (!isGameEnded) {
    var laneWidth = 0;
    var laneSegment = 0;
    var laneLoop = 0;
    switch (laneType) {
      case 1:
        laneWidth = -15;
        laneSegment = 10;
        laneLoop = 4;
      break;
      case 2:
        laneWidth = -10;
        laneSegment = 10;
        laneLoop = 3;
      break;
      case 3:
        laneWidth = -5;
        laneSegment = 10;
        laneLoop = 2;
      break;
      case 4:
        laneWidth = 0;
        laneSegment = 0;
        laneLoop = 1;
      break;
    }
    var totalLanes = laneLoop + 1;
    var numSolution = randomIntGen(1, Math.max(totalLanes, 2)); // geneate the number of slutions
    for (var i = 0; i < laneLoop; i++) {
      var numLanes = totalLanes - i;
      var laneX = laneWidth + i*laneSegment;
      var solutionInt = randomIntGen(0,256);
      var solutionBit = solutionInt.toString(2);
      solutionBit = '00'+solutionBit;
      if (numSolution > 0) {  // more than 0 solution available
        var solutionChoice = randomIntGen(0,2);
        if (numSolution >= i+1) { // absolutely have to do solution here
          mapBitToPosition(laneX, solutionNullify(solutionBit), newX);
          numSolution -= 1;
        } else if (solutionChoice == 1) { // do solution
          mapBitToPosition(laneX, solutionNullify(solutionBit), newX);
          numSolution -= 1;
        } else {  // dont do solution
          mapBitToPosition(laneX, solutionBit, newX);
        }
      } else { // no more solution to do
        mapBitToPosition(laneX, solutionBit, newX);
      } 
    }
  }
}

// make the lane a solution lane
function solutionNullify(bits) {
  if (bits) {
    var alterResult = '';
    var bitsLen = bits.length;
    for (var i = 0; i < bitsLen; i++) {
      var c = bits.charAt(i);
      if (c) {
        if (c === '1') {
          alterResult += c+'00';
        } else {
          alterResult += c;
        }
      }
    }
    return alterResult;
  }
}

// convert randomly generated number to actual obstacle placement
function mapBitToPosition(xPos, bits, newX) {
  if (!isGameEnded && bits) {
    for (var i = 0; i < 8; i++) {
      var c = bits.charAt(i);
      var pos = i*20;
      if (c && c === '1') {  // map object
        var x = xPos + newX;
        var y = randomIntGen(1, 5);
        var z =  -420 - pos; 
        var obstacleTypeBound = randomIntGen(1,5);
        var MeshOBstcles = randomizeObstacles(obstacleTypeBound);
        MeshOBstcles.receiveShadow = true;
        MeshObstacle.position.set(x,y,z);
        obstacles.push(MeshObstacle);
        scene.add(MeshObstacle);
      }
    }
  }
}

// generate the next level of obstacle specific to the floor type 
function generateFutureLevelObstacles (dist, futureLevel, newX) {
  if (!isGameEnded && dist > 0) { 
    generateNextStage(futureLevel+1, newX);
  }
}

// add onboarding specific blocks
function generateOnBoardingObstacles() {
  if (!isGameEnded) {

    var MeshOBstclesA = new THREE.Mesh(GeometryObstacleA, randomObstacleMaterial());
    MeshOBstclesA.receiveShadow = true;
    MeshOBstclesA.position.set(-6,0,-850);
    obstacles.push(MeshOBstclesA);
    scene.add(MeshOBstclesA);

    var MeshOBstclesB = new THREE.Mesh(GeometryObstacleA, randomObstacleMaterial());
    MeshOBstclesB.receiveShadow = true;
    MeshOBstclesB.position.set(4,0,-700);
    obstacles.push(MeshOBstclesB);
    scene.add(MeshOBstclesB);

    var MeshOBstclesC = new THREE.Mesh(GeometryObstacleA, randomObstacleMaterial());
    MeshOBstclesC.receiveShadow = true;
    MeshOBstclesC.position.set(0,0,-400);
    obstacles.push(MeshOBstclesC);
    scene.add(MeshOBstclesC);
  }
}

// =================================
//  USER ACTION INPUT
// =================================

// keyboard triggered movment
function moveLeo(movement) {
  if (!isGameEnded && isStarted) {
    switch(movement) {
      case "JUMP":
        if (MeshLeoTorso.position.y > 12) {
          return;
        }
        jumpFSX.play();
        jumpRecord.jumpEnable = true;
        jumpRecord.startTime = clock.getElapsedTime();
        jumpRecord.isJumping = true;
      break;
      case "LEFT":
        MeshLeoTorso.position.x -= 3;//Math.min(gameSpeed, 5);
        MeshLepoFullBody.position.x -= 3;//Math.min(gameSpeed, 5);
      break;
      case "RIGHT":
        MeshLeoTorso.position.x += 3;//Math.min(gameSpeed, 5);
        MeshLepoFullBody.position.x += 3;//Math.min(gameSpeed, 5);
      break;
    }
  }
}

// =================================
//  ANIMATION
// =================================

// animate the award by rotating and coming close
function animateAward() {
  if (!isGameEnded && MeshAwards || overwriteGameOverAnimation) {
    if (!overwriteGameOverAnimation) {
      MeshAwards.position.z += 2;
      sphereGlow.position.z += 2;
      awardsBound.position.z += 2;
    }
    MeshAwards.rotation.z += Math.PI/160;
  }
}

// animate Leo to mimic running motion
function runningMotionLeo() { 
  if (!isGameEnded) {
    if (leoVision) {
      cameraLeo.position.x = MeshLeoTorso.position.x;
      cameraLeo.position.y = MeshLeoTorso.position.y + 5.5;
      cameraLeo.position.z = MeshLeoTorso.position.z;
    }

    var currentTime = clock.getElapsedTime();
    if (currentTime - timeRecord <= 0.25) {
        return;
    }
    timeRecord = currentTime;
    var signA = 1;
    if (runningFlipFlop) {
      runningFlipFlop = false;
      signA = 1;
    } else {
      runningFlipFlop = true;
      signA = -1;
    }
    MeshLeoLArm.rotation.x = signA*Math.PI/8;
    MeshLeoRArm.rotation.x = -1*signA*Math.PI/8;
    MeshLeoRLeg.rotation.x = signA*Math.PI/8;
    MeshLeoLLeg.rotation.x = -1*signA*Math.PI/8;
  }
}

// perfrom jump animation if the flag is valid
function performJump() {
  if (!isGameEnded && jumpRecord.jumpEnable) {
    var currentTime = clock.getElapsedTime();
    if (currentTime - jumpRecord.startTime > 0.7) {
      jumpRecord.jumpEnable = false;
      MeshLeoTorso.position.y = 9;
      MeshLepoFullBody.position.y = 9;
      return;
    }
    if (jumpRecord.isJumping) {
      if (MeshLeoTorso.position.y > 30) {
        jumpRecord.isJumping = false;
      }
      MeshLeoTorso.position.y += 2*movementUnit;
      MeshLepoFullBody.position.y += 2*movementUnit;
    } else if (MeshLeoTorso.position.y > 9) {
        MeshLeoTorso.position.y -= 1.5*movementUnit;
        MeshLepoFullBody.position.y -= 1.5*movementUnit;
    }
  }
}

// generate the required geometry and vertices and set the flag for explosion
function generateExplosion(x, y) {
  if (hasParticle) {
    return;
  }
  explosionGeo = new THREE.Geometry();
  directions = [];
  for (i = 0; i < 1000; i ++) { 
    var vertex = new THREE.Vector3(x,y,0);
    explosionGeo.vertices.push( vertex );
    directions.push({
      x:(Math.random() * 40)-(40/2),
      y:(Math.random() * 40)-(40/2),
      z:(Math.random() * 40)-(40/2)});
  }
  particles = new THREE.ParticleSystem(explosionGeo, explosionMaterial);
  scene.add(particles); 
  hasParticle = true;
}

// perform the action explosion animation
function performExplosion() {
  if (!hasParticle) {
    return;
  } else if (particleFly >= 100) {
    particleFly = 0;
    hasParticle = false;
    scene.remove(particles);
  }
  for (var i = 0; i < 1000; i++){
    var particle =  particles.geometry.vertices[i]
    particle.y += directions[i].y;
    particle.x += directions[i].x;
    particle.z += directions[i].z;
  }
   particles.geometry.verticesNeedUpdate = true;
   particleFly += 1;
}


// =================================
//  GAME TRACKER
// =================================

// move and recycle the floor when they are out of view also trigger next level obstacle generate
function floorMovement() {
  if (!isGameEnded) {
    var prevX;
    for(var i = 0; i < 4; i++) {
      var floor = floors[i];
      if (floor.position.z >= 160) {
        LeoLevel = (LeoLevel == 3)? 0 : i + 1;
        floor.material = randomFloorMaterial();
        floor.position.z = -480;
        if (isStarted && distance > 0 && i != 0) {
          floor.position.x = randomIntGen(-5,5);
        }
        if (isStarted) {
          generateFutureLevelObstacles(distance, i, floor.position.x);
        }
      } else if (floor.position.z >= 0) {
        var offset = floor.position.x;
        switch(i) {
          case 0:
            boundry.left = -20 + offset;
            boundry.right = 20 + offset;
          break;
          case 1:
            boundry.left = -15 + offset;
            boundry.right = 15 + offset;
          break;
          case 2:
            boundry.left = -10 + offset;
            boundry.right = 10 + offset;
          break;
          case 3:
            boundry.left = -6 + offset;
            boundry.right = 6 + offset;
          break;
        }
      }
      floor.position.z += 2*movementUnit;
    }
    trackWallPlanes();
    onBoardingGuide(distance);
    trackAward(distance);
    if (isStarted) {
       distance += 1;
    }
    trackMeshText();
  }
}

// move and recycle the wall when they are out of view
function trackWallPlanes() {
  if (MeshWallLfront.position.z == -20) {
      MeshWallLback.material = (secondWallSet)? wallMaterial6 : wallMaterial3;
      MeshWallRback.material = (secondWallSet)? wallMaterial6 : wallMaterial3;
      MeshWallLback.position.z = -500;
    }
    if (MeshWallLmid.position.z == -20) {
      MeshWallLfront.position.z = - 500;
    }
    if (MeshWallLback.position.z == -20) {
      secondWallSet = !secondWallSet;
      MeshWallLfront.material = (secondWallSet)? wallMaterial4 : wallMaterial1;
      MeshWallLmid.material = (secondWallSet)? wallMaterial5 : wallMaterial2;
      MeshWallRfront.material = (secondWallSet)? wallMaterial4 : wallMaterial1;
      MeshWallRmid.material = (secondWallSet)? wallMaterial5 : wallMaterial2;
      MeshWallLmid.position.z = - 500;
    }

    if (MeshWallRfront.position.z == -20) {
      MeshWallRback.position.z = -500;
    }
    if (MeshWallRmid.position.z == -20) {
      MeshWallRfront.position.z = - 500;
    }
    if (MeshWallRback.position.z == -20) {
      MeshWallRmid.position.z = - 500;
    }

    MeshWallLfront.position.z += movementUnit;
    MeshWallLmid.position.z += movementUnit;
    MeshWallLback.position.z += movementUnit;

    MeshWallRfront.position.z += movementUnit;
    MeshWallRmid.position.z += movementUnit;
    MeshWallRback.position.z += movementUnit;
}

// move the mesh text when it is still relavent otherwise remove
function trackMeshText() {
  if (!isStarted) {
    return;
  }
  if (MeshText &&  MeshText.position.z < 100) {
      MeshText.position.z += gameSpeed;
  } else if (MeshText) {
      scene.remove(MeshText);
  }

  if (distance % 1000 == 500) {
      var future = distance + 500;
      displayText(future+" m", -500, 5, -Math.PI /4);
  }
  else if (distance % 1000 == 0) {
      gameSpeed = (gameSpeed >= 2)? 2 : gameSpeed + 0.05;
  }
}

// at specific distance, guide the player on how to play
function onBoardingGuide (dist) {
  if (dist > 0 || isGameEnded) {
    return;
  }
  if(distance == -450) {
    displayText("Jump!", -50, 5, -Math.PI /4);
  } else if (distance == -300) {
    displayText("Move Left!", -50, 5, -Math.PI /4);
  } else if (distance == -200) {
    displayText("Move Right!", -50, 5, -Math.PI /4);
  } else if (distance == 0) {
    displayText("Start", -30, 5, -Math.PI /4);
  }
}

// for every 1000 meters toggle the award to have a chance of winning
function trackAward(dist) {
  if (!isGameEnded && dist  % 1000 == 0) {
    toggleAward(true && dist > 500);
  }
}

// detect collision between Leo and obstacles and award
function detectCollsion() {
  if (distance < 0) {
    return;
  }
  // var Leo = MeshLeoTorso.position;
  var originPoint = MeshLepoFullBody.position.clone();
  var boundingBoxVertices = MeshLepoFullBody.geometry.vertices;
  var boundingBoxMatrix = MeshLepoFullBody.matrix;
  var awardBoundArr = [];
  awardBoundArr.push(awardsBound);
  boundingBoxVertices.forEach(function(vert) {
    var vertClone = vert.clone().applyMatrix4(boundingBoxMatrix);
    // The direction vector that gives direction to the ray. Should be normalized.
    var direction = vertClone.sub(originPoint);
    if (direction) { // why is this crashing ??? 
      var normalizedDir = direction.clone().normalize();
      var rayCaster = new THREE.Raycaster(originPoint,normalizedDir);
      var collisionObstacle = rayCaster.intersectObjects(obstacles);
      var collisionAward = rayCaster.intersectObjects(awardBoundArr);
      if (collisionObstacle && collisionObstacle.length > 0 && collisionObstacle[0].distance < direction.length()) {
        generateExplosion(MeshLeoTorso.position.x, MeshLeoTorso.position.y);
        collisionFSX.play();
        gameOver(false);
      } else if (collisionAward && collisionAward.length > 0 && collisionAward[0].distance < direction.length()) {
        gameOver(true);
      }
    }
  });
}

// move obstacles and filter out used one
function obstacleController() {
  if (!isGameEnded && isStarted) {
    // first loop
    obstacles.forEach(function(item){
      if(item) {
        var pos = item.position;
        if (pos.z > 100) {
          // don't move object
          pos.z = 500;
        } else {
          pos.z += 2*movementUnit;
        }
      }
    });
    obstacles = obstacles.filter(function(item) {
      if(item.position.z >= 500) {
        scene.remove(item);
        return false;
      } else {
        return item.position.z < 500;
      }
    });
    detectCollsion();
  }
}

// =================================
//  GAME OVER
// =================================

// initialize object and set the flag for animations
function gameOver(hasWon) {
  isGameEnded = true;
  timeRecord = clock.getElapsedTime();
  isGameAnimation = true;
  backgroundMusic.stop();
  if (hasWon) {
    displayText("You've Won", 1, 5, -Math.PI /4);
    isWon = true;
    winFSX.play();
  } else {
    displayText("Game Over", 1, 5, -Math.PI /4);
    isWon = false;
    loseFSX.play();
  }
}

// animate and rearrange object for the leaderboard page
function gameOverAnimation () {
  if (!isGameAnimation) {
    return;
  }
  var currentTime = clock.getElapsedTime();
  if (currentTime - timeRecord > 3) {
      isGameAnimation = false;
      scene.remove(MeshWallLmid);
      scene.remove(MeshWallLback);
      scene.remove(MeshWallRfront);
      scene.remove(MeshWallRmid);
      scene.remove(MeshWallRback);
      renderer.setClearColor(  0x000000 );
      MeshWallLfront.rotation.y = 0;
      MeshWallLfront.position.set(0,0,3.5);
      MeshWallLfront.material = wallMaterialWin;
      displayText("Press R to Play Again!", 5, 5, -Math.PI /4);
      if (MeshAwards) {
        MeshAwards.position.set(0,30,6.5);
        MeshAwards.scale.x = 0.08;
        MeshAwards.scale.y = 0.08;
        MeshAwards.scale.z = 0.08;
        overwriteGameOverAnimation = true;
      }
      if (sphereGlow) {
        scene.remove(sphereGlow);
      }
      drifting.play();
      submitHighScore(distance, isWon);
      return;
  }
  if (isFallOff) {
    MeshLeoTorso.position.y -= 1;
    floors.forEach(function(f) {
      f.position.y -= randomNumGen(0.5,2);
    });
    obstacles.forEach(function(o) {
      o.position.y -= randomNumGen(1.5,3);
    });

    if (MeshAwards) {
        MeshAwards.position.y -= randomNumGen(1.5,3);
    }
    if (sphereGlow) {
      sphereGlow.position.y -= randomNumGen(1.5,3);
    }
    
  } else {
    if (MeshLeoTorso.position.y < 30) {
      MeshLeoTorso.position.y += 1;
    } else {
      isFallOff = true;
    }
  }
}

// check if Leo is out of bound
function isGameOver() {
  if (isGameEnded || MeshLeoTorso.position.y > 9) {
    return;
  }
  if (MeshLeoTorso.position.x < boundry.left) {
    isFallOff = true;
    gameOver(false);
  } else if (MeshLeoTorso.position.x > boundry.right) {
    isFallOff = true;
    gameOver(false);
  }
}





// =================================================================================
//	CONTROL
// =================================================================================

var keyboard = new THREEx.KeyboardState();
function onKeyDown(event) {

	if(keyboard.eventMatches(event,"A")) {         // L
		// console.log("L");
    moveLeo("LEFT");
	}
  else if(keyboard.eventMatches(event,"D")) {    // R
    // console.log("R");
    moveLeo("RIGHT");
  }
  else if(keyboard.eventMatches(event,"W")) {    // SPACE
    // console.log("W");
    moveLeo("JUMP");
  }
  else if(keyboard.eventMatches(event," ")) {    // SPACE
    // console.log("SPACE");
    if (!isStarted) {
      readySetGo();
    } else {
       moveLeo("JUMP");
    }
   
  }
  else if(keyboard.eventMatches(event,"P")) {    // PERSPECTIVE CHANGE
    // console.log("PERSPECTIVE");
    leoVision = !leoVision;
  } 
  else if (keyboard.eventMatches(event,"left")) {    // PERSPECTIVE CHANGE
    // console.log("ArrowLeft");
    moveLeo("LEFT");
  } 
  else if (keyboard.eventMatches(event,"right")) {    // PERSPECTIVE CHANGE
    // console.log("ArrowRight");
    moveLeo("RIGHT");
  } 
  else if (keyboard.eventMatches(event,"up")) {    // PERSPECTIVE CHANGE
    // console.log("ArrowRight");
    moveLeo("JUMP");
  } 
  else if (keyboard.eventMatches(event,"O")) {    // PERSPECTIVE CHANGE
    // console.log("Debug");
    isProduction = !isProduction;
  } 
  else if (keyboard.eventMatches(event,"R")) {    // PERSPECTIVE CHANGE
    if (isGameEnded) {
      // console.log("Restart");
      window.location.reload(false); 
    }
  } 
} 
keyboard.domElement.addEventListener('keydown', onKeyDown );

function onMouseDown(event) {
  if (!isStarted) {
      
      var beginGameText = [];
      if (MeshText) {
        beginGameText.push(MeshText);
      }
      var clickX =  2*(event.clientX / window.innerWidth)- 1;
      var clickY = -2*(event.clientY / window.innerHeight) + 1;
      var vector = new THREE.Vector3(clickX,clickY,1);
      projector.unprojectVector(vector,camera);
      var ray = new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
      var hasClicked = ray.intersectObjects(beginGameText);
      if (hasClicked.length > 0) {
        readySetGo();
      }
    } else {
       moveLeo("JUMP");
    }
}

function onMouseUp(event) {
  event.preventDefault();
}

document.addEventListener( 'mousedown', onMouseDown, false );
document.addEventListener( 'mouseup', onMouseUp, false );

function motion(event) {
  if (isGameEnded) {
    document.removeEventListener("devicemotion", motion);
    return;
  }
  var xMotion = event.accelerationIncludingGravity.x;
  console.log("Accelerometer: "
    + event.accelerationIncludingGravity.x + ", "
    + event.accelerationIncludingGravity.y + ", "
    + event.accelerationIncludingGravity.z
  );
  var deltaMotion = xMotion - lastDeviceMotion;

  if (deltaMotion < 0) {
    if (MeshLeoTorso.position.x < boundry.right) {
        MeshLeoTorso.position.x += 1;
        MeshLepoFullBody.position.x += 1;
      }
  } else {
    if (MeshLeoTorso.position.x > boundry.left) {
        MeshLeoTorso.position.x -= 1;
        MeshLepoFullBody.position.x -= 1;
      }
  }
  // lastDeviceMotion = xMotion;
}

if(useMotion && window.DeviceMotionEvent){
  window.addEventListener("devicemotion", motion, false);
}else{
  console.log("DeviceMotionEvent is not supported");
}



// =================================================================================
//	Update
// =================================================================================

var fps = 60;
var lastLoop = new Date;
function fpsCounter() { 
    var thisLoop = new Date;
    var currfps = Math.ceil((1000 / (thisLoop - lastLoop)));
    lastLoop = thisLoop;
    if (fps != currfps) {
      document.getElementById('fps').innerHTML = "FPS: "+currfps;
      fps = currfps;
    }
}

// SETUP UPDATE CALL-BACK
function update() {

  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  if (!isPaused) {
    floorMovement();
    obstacleController();
    runningMotionLeo();
    performJump();
    if (isStarted) {
      isGameOver();
      gameOverAnimation();
    } else if (MeshText) {
        MeshText.rotation.x += Math.PI/160;
    }
    // stats.update();
    fpsCounter();
    updateGameStat(distance, numNomination);
  } else {
    loadProgress();
  }

  performExplosion();

  animateAward();
  requestAnimationFrame(update);
  renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.setScissor( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.setScissorTest ( true );
  renderer.render( scene, camera );

  if (!isGameEnded) {
    renderer.setViewport( 0.5 * SCREEN_WIDTH, 0.5 * SCREEN_HEIGHT, 0.75 * SCREEN_WIDTH, 0.75 * SCREEN_HEIGHT);
    renderer.setScissor( 0.75 * SCREEN_WIDTH, 0.75 * SCREEN_HEIGHT, 0.75 * SCREEN_WIDTH, 0.75 * SCREEN_HEIGHT);
    renderer.setScissorTest ( true );
    renderer.render( scene, (leoVision)? cameraTopDown : cameraLeo );
  }
  
}

update();


// =================================================================================
//  UTILS
// =================================================================================

// modify version of this:
// http://www.w3schools.com/games/game_sound.asp
function sound(src, repeat) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    // if (repeat) {
      this.sound.loop=repeat;
    // }
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function randomNumGen (min, max) {
    return Math.random() * (max - min + 1) + min;
}

function randomIntGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// display text with a specific font
function displayText(text, depth, fontSize, rotation){
  if (MeshText) {
    scene.remove(MeshText);
  }
  loader.load( 'fonts/helvetiker_bold.typeface.js', function ( font ) {
          var textGeo = new THREE.TextGeometry(text, {
              font: font,
              size: fontSize, //5,
              height: 3,
          });
          textGeo.computeBoundingBox();
          var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
          MeshText = new THREE.Mesh( textGeo, textMaterial );
          MeshText.position.x = centerOffset;
          MeshText.position.y = 10;
          MeshText.position.z = depth;
          MeshText.rotation.x = rotation; //-Math.PI /4;
          scene.add( MeshText );
      });
}

// randomly select obstacle type
function randomizeObstacles(typeStrict) {
  if (!isGameEnded) {
    var type = randomIntGen(1,typeStrict);
    switch(type) {
        case 1:
          return MeshObstacle = new THREE.Mesh(GeometryObstacleA, randomObstacleMaterial());
        case 2:
          return MeshObstacle = new THREE.Mesh(GeometryObstacleB, randomObstacleMaterial());
        case 3:
          return MeshObstacle = new THREE.Mesh(GeometryObstacleC, randomObstacleMaterial());
        case 4:
         return MeshObstacle = new THREE.Mesh(GeometryObstacleD, randomObstacleMaterial());
        default:
          return MeshObstacle = new THREE.Mesh(GeometryObstacleB, randomObstacleMaterial());
      }
  }
}

// randomly select obstacle material/texture
function randomObstacleMaterial() {
  // return material;
  var rnd = randomIntGen(1,6);
  // rnd = 100;
  switch(rnd) {
    case 1:
      return new THREE.MeshLambertMaterial( { color: 0xff0000} );
    case 2:
      return new THREE.MeshLambertMaterial( { color: 0x9a2600} );
    case 3:
      return new THREE.MeshLambertMaterial( { color: 0xffff00} );
    case 4:
      return new THREE.MeshLambertMaterial( { color: 0x33cc33} );
    case 5:
      return new THREE.MeshLambertMaterial( { color: 0x0099cc} );
    case 6:
      return new THREE.MeshLambertMaterial( { color: 0x9933ff} );
    default:
      return material;
  }
}

// randomly select floor material
function randomFloorMaterial() {
  var rnd = randomIntGen(1,25);
  switch(rnd) {
    case 1:
      return floorMaterial1;
    case 2:
      return floorMaterial2;
    case 3:
      return floorMaterial3;
    case 4:
      return floorMaterial4;
    case 5:
      return floorMaterial5;
    case 6:
      return floorMaterial6;
    case 7:
      return floorMaterial7;
    case 8:
      return floorMaterial8;
    case 9:
      return floorMaterial9;
    case 10:
      return floorMaterial10;
    case 11:
      return floorMaterial11;
    case 12:
      return floorMaterial12;
    case 13:
      return floorMaterial13;
    case 14:
      return floorMaterial14;
    case 15:
      return floorMaterial15;
    case 16:
      return floorMaterial16;
    case 17:
      return floorMaterial17;
    case 18:
      return floorMaterial18;
    case 19:
      return floorMaterial19;
    case 20:
      return floorMaterial20;
    case 21:
      return floorMaterial21;
    case 22:
      return floorMaterial22;
    case 23:
      return floorMaterial23;
    case 24:
      return floorMaterial24;
    default:
      return floorMaterial6;
  }
}