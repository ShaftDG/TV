var container, stats;

var camera, scene, renderer, controls;

var sunlight, tv, slot;

var boolStartStop = false;
var button;
var startStopButton, buttonFullScreen, button3D, buttonDayNight;
var groupButton = new THREE.Object3D;

var clock = new THREE.Clock();
var mouseX = 0, mouseY = 0;
var stats;
var rendererStats	= new THREEx.RendererStats();
rendererStats.domElement.style.position	= 'absolute';
rendererStats.domElement.style.right	= '0px';
rendererStats.domElement.style.bottom	= '0px';
document.body.appendChild( rendererStats.domElement );

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
//GUI
//var gui = new dat.GUI( { width: 300 } ), optionsTonguesOfFire, optionsOriginFire, optionsStartStop;

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

shaders.load( 'vertexShaderHologram' , 'vertexShHologram' , 'vertex' );
shaders.load( 'fragmentShaderHologram' , 'fragmentShHologram' , 'fragment' );

shaders.load( 'vertexShaderLoader' , 'vertexShLoader' , 'vertex' );
shaders.load( 'fragmentShaderLoader' , 'fragmentShLoader' , 'fragment' );

function init() {
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
        button.addAnimation();
       // tv.addAnimation();
    };

    textureLoader = new THREE.TextureLoader(loadingManager);

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
  //  camera.position.x = 20;
   // camera.position.y = 2.0;
    camera.position.z = 115.0;
  //  camera.position.x = 1.5;
    // scene
    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( "#e8ede5", 0.1 );
////////////////////////////////////////////
    sunlight = new SunLight(loadingManager, false);
    scene.add(sunlight);
////////////////////////////////////////////
    slot = new ControllerTV(0, 0, 0, 3, 3, 8, 12, textureLoader, false);
    slot.position.y = 4.0;
   // slot.scale.set(2.1, 2.1, 2.1);
    scene.add(slot);
////////////////////////////////////////////
    var geometry = new THREE.PlaneBufferGeometry(512, 256);
    geometry.rotateX(-Math.PI*2.0);
    var material = new THREE.MeshPhongMaterial({
       map: textureLoader.load("textures/background/back2.jpg")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -200;
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
    button.position.set(55, -20.0, 25.0);
    button.scale.set(0.15, 0.15, 0.15);
    button.rotation.set(-0.4, -0.8, 0.0);
    groupButton.add(button);
    scene.add(groupButton);
  //  scene.add(button);
////////////////////////////////////////////
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
  //  controls.addEventListener( 'change', render ); // remove when using animation loop
    // enable animation loop when using damping or autorotation
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
  //  controls.enableZoom = true;

    stats = new Stats();
    container.appendChild( stats.dom );

    document.addEventListener( 'mouseup', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
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

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

function animate() {
    if( RESOURCES_LOADED == false ){
        requestAnimationFrame(animate);
        var deltaTime = clock.getDelta();
        loadingScreen.planeLoader.material.uniforms.time.value += deltaTime;
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return; // Stop the function here.
    }
    requestAnimationFrame( animate );

    TWEEN.update();

    var time = Date.now() * 0.01 ;
    var deltaTime = clock.getDelta();
    var deltaTimeElapsed = clock.getElapsedTime();

////////////////////////////////////////////////////////////
   // sunlight.updateWithTime( deltaTimeElapsed );
////////////////////////////////////////////////////////////
    slot.updateWithTime(deltaTimeElapsed, deltaTime);
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
    button.updateWithTime(deltaTime);
////////////////////////////////////////////////////////////

  //  controls.update();
    stats.update();
    rendererStats.update(renderer);
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
            slot.stopStartRotateSymb();
            break;
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
        if (intersects[0].object.name == "button") {
                button.start();
                slot.stopStartRotateSymb();
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
                  //  totalScore2D.setString(stringIn);
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