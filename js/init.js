var container;

var camera, scene, renderer, controls;
var cameraParent = new THREE.Object3D;

var sunlight, tv, slot;

var boolStartStop = false;
var button, terminal;
//var startStopButton, buttonFullScreen, button3D, buttonDayNight;
var groupButton = new THREE.Object3D;

var clock = new THREE.Clock();
var mouseX = 0, mouseY = 0;
var stats;
/*var rendererStats	= new THREEx.RendererStats();
rendererStats.domElement.style.position	= 'absolute';
rendererStats.domElement.style.right	= '0px';
rendererStats.domElement.style.bottom	= '0px';
document.body.appendChild( rendererStats.domElement );*/

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
//GUI
//var gui = new dat.GUI( { width: 300 } ), optionsTonguesOfFire, optionsOriginFire, optionsStartStop;

var totalRound2D, totalScore2D;
var totalRound = 0;
var totalScore = 261485;
var boolStopScore = false;
var boolMoveCamera = false;
//var checkStartStop = false;
var isMobile;

var textureLoader;
var loadingManager = null;
var RESOURCES_LOADED = false;
var loadingScreen;
var shaders = new ShaderLoader('glsl', 'glsl');
shaders.shaderSetLoaded = function(){
    init();
};

shaders.load( 'vertexShaderWideScreen' , 'vertexShWideScreen' , 'vertex' );
shaders.load( 'fragmentShaderWideScreen' , 'fragmentShWideScreen' , 'fragment' );

shaders.load( 'vertexShaderProjector' , 'vertexShProjector' , 'vertex' );
shaders.load( 'fragmentShaderProjector' , 'fragmentShProjector' , 'fragment' );

shaders.load( 'vertexShaderTotalHologram' , 'vertexShTotalHologram' , 'vertex' );
shaders.load( 'fragmentShaderTotalHologram' , 'fragmentShTotalHologram' , 'fragment' );

shaders.load( 'vertexShaderHologram' , 'vertexShHologram' , 'vertex' );
shaders.load( 'fragmentShaderHologram' , 'fragmentShHologram' , 'fragment' );

shaders.load( 'vertexShaderLoader' , 'vertexShLoader' , 'vertex' );
shaders.load( 'fragmentShaderLoader' , 'fragmentShLoader' , 'fragment' );

function init() {
    isMobile = new DetectedMobile().getIsMobile();

    loadingScreen = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
        hemiLight: new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.6 ),
        planeLoader: new THREE.Mesh(
            new THREE.PlaneGeometry(80, 80),
            new THREE.ShaderMaterial({
                uniforms: {
                    time:       { value: 0.0 },
                    speed:      { value: 2.0 },
                    uvScale:    { value: new THREE.Vector2(1.0, 1.0) },
                    brightness: { value: 1.0 },
                    color:      { value: new THREE.Vector3(0.05, 0.19, 0.2) },
                    popSize:    { value: 0.15 },
                    baseSize:   { value: 0.89 },
                    radius:     { value: 0.18 }
                },
                vertexShader: shaders.vertexShaders.vertexShLoader,
                fragmentShader: shaders.fragmentShaders.fragmentShLoader
            })
        )
    };
    // Set up the loading screen's scene.
    // It can be treated just like our main scene.
    loadingScreen.planeLoader.position.set(0,0,5);
    loadingScreen.camera.position.set(0,0,50);
    loadingScreen.camera.lookAt(loadingScreen.planeLoader.position);
    loadingScreen.scene.add(loadingScreen.planeLoader);
    loadingScreen.hemiLight.name = "hemiLight";
    loadingScreen.hemiLight.color.setHSL( 0.6, 1, 0.6 );
    loadingScreen.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    loadingScreen.hemiLight.position.set( 0, 50, 0 );
    loadingScreen.scene.add(  loadingScreen.hemiLight );
    loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function(item, loaded, total){
        console.log(item, loaded, total);
    };

    loadingManager.onLoad = function(){
        console.log("loaded all resources");
        RESOURCES_LOADED = true;

        slot.addAnimation();
      //  button.addAnimation();
        // tv.addAnimation();
    };

    textureLoader = new THREE.TextureLoader(loadingManager);

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
    //  camera.position.x = 20;
    // camera.position.y = 2.0;
    camera.position.z = 160.0;
    camera.position.y = 10.0;
    cameraParent.add(camera);
    cameraParent.position.y = -10;
    //  camera.position.x = 1.5;
    // scene
    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( "#e8ede5", 0.1 );
    scene.add(cameraParent);
////////////////////////////////////////////
    sunlight = new SunLight(loadingManager, false);
    scene.add(sunlight);
////////////////////////////////////////////
    slot = new ControllerTV(0, 0, 0, 3, 3, 8, 12, textureLoader, false);
    slot.position.y = 11.0;
    // slot.scale.set(2.1, 2.1, 2.1);
    scene.add(slot);
////////////////////////////////////////////
    var geometry = new THREE.PlaneBufferGeometry(512, 256);
    geometry.rotateX(-Math.PI*2.0);
    var material = new THREE.MeshPhongMaterial({
        map: textureLoader.load("textures/background/back2.jpg")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -170;
    scene.add(mesh);
////////////////////////////////////////////
    /*  startStopButton = new ButtonKey(140, -40, 10, "start", textureLoader, false);
      startStopButton.name = "startStopButton";
      startStopButton.scale.set(0.4, 0.4, 0.4);
      groupButton.add(startStopButton);

      buttonFullScreen = new ButtonKey(140, 45, 10, "fullscreen", textureLoader, false);
      buttonFullScreen.name = "buttonFullScreen";
      buttonFullScreen.scale.set(0.4, 0.4, 0.4);
      groupButton.add(buttonFullScreen);*/

    /* buttonDayNight = new ButtonKey(180, 207.5, 0, "daynight", textureProvider.getButtonTextures(), isMobile);
     buttonDayNight.name = "buttonDayNight";
     buttonDayNight.scale.set(0.5, 0.5, 0.5);
     groupButton.add(buttonDayNight);

     button3D = new ButtonKey(-150, 50, 0, "3d", textureProvider.getButtonTextures(), isMobile);
     button3D.name = "button3D";
     buttonFullScreen.scale.set(0.8, 0.8, 0.8);
     groupButton.add(button3D);
     groupButton.name = "groupButton"; */
////////////////////////////////////////////
    button = new Button3D(textureLoader, false);
    button.name = "button";
    button.position.set(60, -30, 14.0);
    button.scale.set(0.2, 0.2, 0.2);
  //  button.rotation.set(0.5, 0.0, 0.3);
    button.rotation.x = Math.PI/10;
   // button.rotation.y = Math.PI/6;
  //  button.rotation.z = Math.PI/6;
    groupButton.add(button);
    groupButton.name = "groupButton";
    scene.add(groupButton);
    //  scene.add(button);
///////////////////////////////////////////////
    //var stringIn = totalScore.toString();
    var stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    var stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/winplane/numbers1.png');
    totalRound2D = new MessageTotalRound(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75);
    totalRound2D.position.y = 45 /*+ 10*/;
    totalRound2D.position.z = 25;
    totalRound2D.rotation.x = 0.5;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
  //  totalRound2D.setString(stringIn);
    totalRound2D.setNumber(0);
    totalRound2D.stop();
   // totalRound2D.start();
    //cameraParent.add(totalRound2D);
    totalRound2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalRound2D);
////////////////////////////////////////////
    stringIn = totalScore.toString();
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/winplane/numbers1.png');
    totalScore2D = new MessageTotalScore(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75);
    totalScore2D.position.y = -42 /*+ 10*/;
    totalScore2D.position.z = 25;
    totalScore2D.rotation.x = -Math.PI/2;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
    totalScore2D.setBeginNumber(totalScore);
    totalScore2D.setNumber(totalScore);
    totalScore2D.start();
    //cameraParent.add(totalRound2D);
    totalScore2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalScore2D);
////////////////////////////////////////////
    terminal = new Terminal(textureLoader, false);
    terminal.name = "terminal";
    terminal.position.set(0, -40.0, 5.0);
    terminal.scale.set(0.2, 0.2, 0.2);
    //  terminal.rotation.set(0.5, 0.0, 0.3);
    //terminal.rotation.x = Math.PI/9;
    // terminal.rotation.y = Math.PI/6;
    //  terminal.rotation.z = Math.PI/6;
    scene.add(terminal);
///////////////////////////////////////////////

    renderer = new THREE.WebGLRenderer({ antialias: true, precision: "highp" });
    renderer.sortObjects = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapAutoUpdate = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.shadowMapSoft = true;
    renderer.physicallyBasedShading = true;
    renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setClearColor("#dcf6ff");
    renderer.physicallyBasedShading = true;

    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

   //  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //   controls.addEventListener( 'change', render ); // remove when using animation loop
    // enable animation loop when using damping or autorotation
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
  //   controls.enableZoom = true;

    stats = new Stats();
    container.appendChild( stats.dom );

    document.addEventListener( 'mouseup', onDocumentMouseDown, false );

    if (!isMobile) {
        document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    if( RESOURCES_LOADED == false ){
        requestAnimationFrame(animate);
        var deltaTimeLoader = clock.getDelta();
        loadingScreen.planeLoader.material.uniforms.time.value += deltaTimeLoader;
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return; // Stop the function here.
    }
    requestAnimationFrame( animate );

    TWEEN.update();

    // var time = Date.now() * 0.01 ;
    var deltaTime = clock.getDelta();
    var deltaTimeElapsed = clock.getElapsedTime();

    if (slot.getTotalSum() > totalRound && boolStopScore && slot.getBoolEndAnimation()) {
        boolMoveCamera = true;
        totalRound = slot.getTotalSum();
        totalScore += totalRound;

        totalScore2D.setNumber(totalScore);
        totalScore2D.start();

        totalRound2D.nameSlot.visible = false;
        totalRound2D.setNumber(totalRound);
        totalRound2D.start();
        boolStopScore = false;
        boolStartStop = false;
        console.log("totalScore", totalScore);
        totalRound = 0;
    }
    if (slot.boolChangeStopToStart) {
       button.startColor();
    }
////////////////////////////////////////////////////////////
    // sunlight.updateWithTime( deltaTimeElapsed );
////////////////////////////////////////////////////////////
    slot.updateWithTime(deltaTimeElapsed, deltaTime);
    totalRound2D.update(deltaTime * 1.2);
    totalScore2D.update(deltaTime * 1.2);
////////////////////////////////////////////////////////////
    /* if (slot.getBoolEndAnimation()) {
         boolStartStop = false;
         startStopButton.setTexture("start");
     }*/
    //startStopButton.update(deltaTime * 4.);
    //buttonFullScreen.update(deltaTime * 4.);
    //buttonDayNight.update(deltaTime * 4.);
    //button3D.update(deltaTime * 4.);
////////////////////////////////////////////////////////////
    button.updateWithTime(deltaTimeElapsed, deltaTime);
////////////////////////////////////////////////////////////
  /*  if (boolMoveCamera) {
        // cameraParent.position.x = (Math.sin(deltaTimeElapsed * 4.0) - Math.cos(deltaTimeElapsed * 4.0)) * 5  /!*+ Math.random() * (0.22 - 0.2) + 0.2*!/;
        // cameraParent.rotation.y =/!* Math.abs*!/(Math.sin(deltaTimeElapsed * 4.0) - Math.cos(deltaTimeElapsed * 4.0)) * 0.02;


        // cameraParent.rotation.y = (Math.sin(deltaTimeElapsed * 8.0) - Math.cos(deltaTimeElapsed * 8.0)) * 0.1;
        // cameraParent.rotation.z = (Math.sin(deltaTimeElapsed * 8.0) - Math.cos(deltaTimeElapsed * 8.0)) * 0.01;
        /!*  if (totalRound2D.position.y  <= 40.0) {
              totalRound2D.position.y = 40.0;
              //boolMoveCamera = false;
          } else {
              totalRound2D.position.y -= deltaTime*5.25;
          }
          if (totalRound2D.position.z  >= 45.0) {
              totalRound2D.position.z = 45.0;
              //boolMoveCamera = false;
          } else {
              totalRound2D.position.z += deltaTime*15.0;
          }
  *!/
        if (camera.position.z  >= 170.0) {
            camera.position.z = 170.0;
            //boolMoveCamera = false;
        } else {
            camera.position.z += deltaTime*10.0;
        }

      /!*  if (cameraParent.rotation.x  >= 0.5) {
            cameraParent.rotation.x = 0.5;
            //boolMoveCamera = false;
        } else {
            cameraParent.rotation.x += deltaTime * 0.5;
        }*!/
        if (cameraParent.rotation.y  >= 0.6) {
            cameraParent.rotation.y = 0.6;
            //boolMoveCamera = false;
        } else {
            cameraParent.rotation.y += deltaTime * 0.6;
        }
    } else {
        if (camera.position.z  <= 160.0) {
            camera.position.z = 160.0;
            //boolMoveCamera = false;
        } else {
            camera.position.z -= deltaTime*9.3;
        }

       /!* if (cameraParent.rotation.x  <= 0.0) {
            cameraParent.rotation.x = 0.0;
        } else {
            cameraParent.rotation.x -= deltaTime * 0.5;
        }*!/
        if (cameraParent.rotation.y  <= 0.0) {
            cameraParent.rotation.y = 0.0;
        } else {
            cameraParent.rotation.y -= deltaTime * 0.6;
        }
    }*/
////////////////////////////////////////////////////////////
  //  controls.update();
    stats.update();
  //  rendererStats.update(renderer);
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onKeyDown ( event ) {
    switch ( event.keyCode ) {
        case 82: // r - refresh
            //tv.startAnimation();
            //  slot.startAnimation();
            break;
        case 83: // s - stop
            //tv.stopAnimation();
            //  slot.stopAnimation();
            break;
        case 84: // t - paused
            // tv.pausedAnimation();
            //tv.pausedToTimeAnimation();
            // slot.pausedToTimeAnimation();
            break;
        case 32: // stop rotate
            // tv.stopRotateSymb( Math.round( Math.random() * 7.0 ) );
            boolMoveCamera = false;
            slot.stopStartRotateSymb();
            if (!boolStartStop) {
                button.stopColor();

                totalScore -= 10.;
                totalScore2D.setNumber(totalScore);
                totalScore2D.start();

                totalRound2D.stop();
                totalRound2D.nameSlot.visible = true;
                boolStopScore = true;
                boolStartStop = true;
            } else {
                button.startColor();
                boolStartStop = false;
            }
            break;
    }
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // find intersections
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( button.children );

    if (intersects.length > 0) {
        if (intersects[0].object.parent.name == "button") {
            document.body.style.cursor = 'pointer';
        }
    } else {
        document.body.style.cursor = 'auto';
    }

}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( groupButton.children, true );
    if ( intersects.length > 0 ) {
        if (intersects[0].object.parent.name == "button") {
            boolMoveCamera = false;
            slot.stopStartRotateSymb();
            if (!boolStartStop) {
                button.stopColor();

                totalScore -= 10.;
                totalScore2D.setNumber(totalScore);
                totalScore2D.start();

                totalRound2D.stop();
                totalRound2D.nameSlot.visible = true;
                boolStopScore = true;
                boolStartStop = true;
            } else {
                button.startColor();
                boolStartStop = false;
            }
        }
        /*  if (intersects[0].object.parent.name == "startStopButton") {

            //  if (!boolStartStop) {
              //    if (slot.getBoolEndAnimation()) {
              //        startStopButton.start();
               //       slot.stopRotateSymb();
               //       startStopButton.setTexture("stop");
                   //   boolStopScore = true;
                   //   boolStartStop = true;
                   //   totalScore -= 10.;
                   //   var stringIn = totalScore.toString();
                    //  totalRound2D.setString(stringIn);
                  //    boolCoinAnimate = false;
                   //   boolCoinAnimateEnd = true;
                    //  boolLeftFishAnimate = false;
                    //  boolLeftFishAnimateEnd = true;
                    //  boolRightFishAnimate = false;
                    //  boolRightFishAnimateEnd = true;
                    //  boolDownFishAnimate = false;
                     // boolDownFishAnimateEnd = true;
                      //  totalScore3D.stop();
              //    }
          //    } else {
                  startStopButton.start();
                  slot.stopStartRotateSymb();
           //       boolStartStop = false;
            //  }
          }
          if (intersects[0].object.parent.name == "buttonFullScreen") {
              if( THREEx.FullScreen.activated() ){
                  THREEx.FullScreen.cancel();
                  buttonFullScreen.setTexture("fullscreen");
                  // buttonFullScreen.children[0].material.map = fullScreenButton;
                  // buttonFullScreen.children[0].material.map.needsUpdate = true;
              }else{
                  THREEx.FullScreen.request();
                  buttonFullScreen.setTexture("fullscreencancel");
                  // buttonFullScreen.children[0].material.map = fullScreenButtonCancel;
                  // buttonFullScreen.children[0].material.map.needsUpdate = true;
              }
              buttonFullScreen.start();
          }*/
        /* if (intersects[0].object.parent.name == "button3D") {
             if(bool3D){
                 button3D.setTexture("3d");
                 bool3D = false;
             } else{
                 button3D.setTexture("3dcancel");
                 bool3D = true;
             }
             button3D.start();
         }*/
        /* if (intersects[0].object.parent.name == "buttonDayNight") {
             if(boolNight){
                 flameBonfireLeft.stop();
                 flameBonfireRight.stop();
                 sunlight.stop();
                 boolNight = false;
             } else{
                 sunlight.start();
                 flameBonfireLeft.start();
                 flameBonfireRight.start();
                 boolNight = true;
             }
             buttonDayNight.start();
         }*/
    }
}