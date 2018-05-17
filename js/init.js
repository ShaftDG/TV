var container;

var boolControls = false;

var postprocessing = {};
var matChanger, effectController;

var camera, cubeCamera, scene, renderer, controls;
var cameraParent = new THREE.Object3D;

var sunlight, tv, slot;

var dt = 0;

var boolStartStop = false;
var boolStartStopAutoPlay = false;
var boolUpdateScore = false;
var button, terminal, buttonHoloFullScreen, buttonHoloAutoPlay, buttonHoloBet;
var textureFullScreen, textureFullScreenCancel;

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

var totalRound2D, totalScore2D, totalBet, totalFreeSpin;
//var totalRound = 0;
//var totalScore = 261485;
var boolStopScore = false;
var boolMoveCamera = false;
var boolStartColor = false;
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

shaders.load( 'vertexShaderFireParticles' , 'vertexShFireParticles' , 'vertex' );
shaders.load( 'fragmentShaderFireParticles' , 'fragmentShFireParticles' , 'fragment' );

shaders.load( 'vertexShaderWideScreen' , 'vertexShWideScreen' , 'vertex' );
shaders.load( 'fragmentShaderWideScreen' , 'fragmentShWideScreen' , 'fragment' );

shaders.load( 'vertexShaderWideScreenBackground' , 'vertexShWideScreenBackground' , 'vertex' );
shaders.load( 'fragmentShaderWideScreenBackground' , 'fragmentShWideScreenBackground' , 'fragment' );

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
        totalFreeSpin.addAnimation();
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
    // CUBE CAMERA
    //cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );
////////////////////////////////////////////
    sunlight = new SunLight(loadingManager, isMobile);
    scene.add(sunlight);
////////////////////////////////////////////
    slot = new ControllerTV(0, 0, 0, 3, 3, 8, 12, textureLoader, false);
    slot.position.y = 11.0;
    // slot.scale.set(2.1, 2.1, 2.1);
    scene.add(slot);
////////////////////////////////////////////
   /* var geometry = new THREE.PlaneBufferGeometry(512, 256);
    geometry.rotateX(-Math.PI*2.0);
    var material = new THREE.MeshPhongMaterial({
        map: textureLoader.load("textures/background/back2.jpg")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -150;
    scene.add(mesh);*/
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
    textureFullScreen = textureLoader.load("textures/button/buttonFullScreen.png");
    textureFullScreenCancel = textureLoader.load("textures/button/buttonFullScreenCancel.png");
    buttonHoloFullScreen = new ButtonHolo(textureFullScreen, textureLoader, false);
    buttonHoloFullScreen.name = "buttonHoloFullScreen";
    buttonHoloFullScreen.position.set(48, 45, 28);
    buttonHoloFullScreen.scale.set(0.1, 0.1, 0.1);
    //  button.rotation.set(0.5, 0.0, 0.3);
 //   buttonHoloFullScreen.rotation.x = Math.PI/10;
    // button.rotation.y = Math.PI/6;
    //  button.rotation.z = Math.PI/6;
    groupButton.add(buttonHoloFullScreen);
    //scene.add(buttonHoloFullScreen);
///////////////////////////////////////////////
    var textureAutoPlay = textureLoader.load("textures/button/buttonAutoPlay.png");
    buttonHoloAutoPlay = new ButtonHolo(textureAutoPlay, textureLoader, false);
    buttonHoloAutoPlay.name = "buttonHoloAutoPlay";
    buttonHoloAutoPlay.position.set(60, -46, 27);
    buttonHoloAutoPlay.scale.set(0.15, 0.15, 0.15);
    //  button.rotation.set(0.5, 0.0, 0.3);
    //   buttonHoloFullScreen.rotation.x = Math.PI/10;
    // button.rotation.y = Math.PI/6;
    //  button.rotation.z = Math.PI/6;
    groupButton.add(buttonHoloAutoPlay);
    //scene.add(buttonHoloFullScreen);
////////////////////////////////////////////
    var textureBet = textureLoader.load("textures/button/buttonBet.png");
    buttonHoloBet = new ButtonHolo(textureBet, textureLoader, false);
    buttonHoloBet.name = "buttonHoloBet";
    buttonHoloBet.position.set(-60, -46, 19);
    buttonHoloBet.scale.set(0.2, 0.2, 0.2);
    //  button.rotation.set(0.5, 0.0, 0.3);
    //   buttonHoloFullScreen.rotation.x = Math.PI/10;
    // button.rotation.y = Math.PI/6;
    //  button.rotation.z = Math.PI/6;
    groupButton.add(buttonHoloBet);
    //scene.add(buttonHoloFullScreen);
////////////////////////////////////////////
    button = new Button3D(textureLoader, false);
    button.name = "buttonStartStop";
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
    totalRound2D = new MessageTotalRound(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01);
    totalRound2D.position.y = 45 /*+ 10*/;
    totalRound2D.position.z = 25;
    totalRound2D.rotation.x = 0.5;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
  //  totalRound2D.setString(stringIn);
    totalRound2D.setBeginNumber(0);
    totalRound2D.setNumber(0);
    totalRound2D.stop();
   // totalRound2D.start();
    //cameraParent.add(totalRound2D);
    totalRound2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalRound2D);
////////////////////////////////////////////
    stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/winplane/numbers1.png');
    totalScore2D = new MessageTotalScore(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01);
    totalScore2D.position.y = -42 /*+ 10*/;
    totalScore2D.position.z = 25;
    totalScore2D.rotation.x = -Math.PI/2;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
    var totalScore = slot.getTotalScore();
    totalScore2D.setBeginNumber(totalScore);
    totalScore2D.setNumber(totalScore);
    //cameraParent.add(totalRound2D);
    totalScore2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalScore2D);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/winplane/numbers1.png');
    totalBet = new MessageBet(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01);
    totalBet.position.y = -23.5 /*+ 10*/;
    totalBet.position.x = -65;
    totalBet.position.z = 5;
   // totalBet.rotation.x = -Math.PI/2;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
    var bet = slot.getBet();
    totalBet.setBeginNumber(0);
    totalBet.setNumber(bet);
    //cameraParent.add(totalRound2D);
    totalBet.scale.set(0.7, 0.7, 0.7);
  //  totalBet.rotation.y = Math.PI / 8;
    scene.add(totalBet);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/winplane/numbers1.png');
    totalFreeSpin = new MessageFreeSpin(-3.5, 0, 85, textureLoader, stringPattern, 5, 2, stringIn, "centre", 7, 7, -0.75, 0.01);
    totalFreeSpin.position.y = 12 /*+ 10*/;
    totalFreeSpin.position.x = 70;
    totalFreeSpin.position.z = -45;
    // totalBet.rotation.x = -Math.PI/2;
    // totalRound2D.rotation.x = -60 * Math.PI / 180;
    totalFreeSpin.setBeginNumber(0);
    totalFreeSpin.setNumber(0);
    totalFreeSpin.stop();
    //cameraParent.add(totalRound2D);
 //   totalFreeSpin.scale.set(0.7, 0.7, 0.7);
  //  totalFreeSpin.rotation.y = -Math.PI / 5;
    scene.add(totalFreeSpin);
//////////////////////////////////////////////////
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

    if (!isMobile) {
        scene.matrixAutoUpdate = false;
        initPostprocessing();
        renderer.autoClear = false;
        effectController = {
            focus: 140.0,
            aperture: 5,
            maxblur: 1.0
        };
        matChanger = function (effectController) {
            postprocessing.bokeh.uniforms["focus"].value = effectController.focus;
            postprocessing.bokeh.uniforms["aperture"].value = effectController.aperture * 0.00001;
            postprocessing.bokeh.uniforms["maxblur"].value = effectController.maxblur;
        };
        matChanger(effectController);
    }
    container.appendChild( renderer.domElement );

    if (boolControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render); // remove when using animation loop
        // enable animation loop when using damping or autorotation
        //controls.enableDamping = true;
        //controls.dampingFactor = 0.25;
        controls.enableZoom = true;
    }

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

function initPostprocessing() {
    var renderPass = new THREE.RenderPass( scene, camera );
    var bokehPass = new THREE.BokehPass( scene, camera, {
        focus: 		1.0,
        aperture:	0.025,
        maxblur:	1.0,
        width: window.innerWidth,
        height: window.innerHeight
    } );
    bokehPass.renderToScreen = true;
    var composer = new THREE.EffectComposer( renderer );
    composer.addPass( renderPass );
    composer.addPass( bokehPass );
    postprocessing.composer = composer;
    postprocessing.bokeh = bokehPass;
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

    if (slot.autoPlay) {
        if (slot.autoPlayStart) {
            slot.autoPlayStart = false;
            button.stopColor();
            sunlight.setStopButtonlight();
            boolStartColor = true;
            if (!slot.boolFreeSpin) {
                totalScore2D.setNumber(slot.getTotalScore());
                slot.autoPlayStart = false;
                if (!totalRound2D.nameSlot.visible) {
                    totalRound2D.visibleSlotName();
                }
                totalRound2D.setBeginNumber(0);
                totalRound2D.stop();
            }
        }
        if (slot.autoPlayStop) {
            if (boolStartColor) {
                boolStartColor = false;
                button.startColor();
                sunlight.setStartButtonlight();
            }
            if (!slot.boolFreeSpin) {
                if (totalRound2D.boolEndOfCount) {
                    dt += deltaTime;
                }
                if (slot.getTotalSum() > 0) {
                    totalRound2D.nameSlot.visible = false;
                    totalRound2D.setNumber(slot.getTotalSum());
                }
            } else {
                if (slot.totalRoundFreeSpin > 0) {
                    totalRound2D.nameSlot.visible = false;
                    totalRound2D.setNumber(slot.totalRoundFreeSpin);
                    boolUpdateScore = true;
                } else {
                    if (totalRound2D.boolEndOfCount) {
                        dt += deltaTime;
                    }
                }
            }
        }

    } else {
        buttonHoloAutoPlay.materialHolo.uniforms.boolOn.value = false;
        buttonHoloAutoPlay.boolOnOffSwitch = false;
        boolStartStopAutoPlay = false;

            if (slot.getTotalSum() > 0 && boolStopScore && slot.getBoolEndAnimation()) {
                boolMoveCamera = true;
                if (!slot.boolFreeSpin) {
                    var totalRound = slot.getTotalSum();
                    if (totalRound2D.boolEndOfCount) {
                        dt += deltaTime;
                    }
                    totalRound2D.nameSlot.visible = false;
                    totalRound2D.setNumber(totalRound);
                } else {
                    boolUpdateScore = true;
                    totalRound2D.nameSlot.visible = false;
                    totalRound2D.setNumber(slot.totalRoundFreeSpin);
                    boolStopScore = false;
                }
            }
    }

    if (dt > 1.0) {
        dt = 0;
        totalScore2D.setNumber(slot.getTotalScore());
        totalRound2D.setNumber(0);
        boolStopScore = false;
        slot.autoPlayStop = false;
        boolStartColor = true;
    }

    if (!slot.genArraySymb.boolFreeSpin && boolUpdateScore) {
        totalScore2D.setNumber(slot.getTotalScore());
        totalRound2D.setNumber(0);
        boolUpdateScore = false;
    }
    if (slot.genArraySymb.numFreeSpin >= 0 && slot.boolFreeSpin && slot.switchNumFreeSpinPlus) {
        totalFreeSpin.setNumber(slot.genArraySymb.numFreeSpin);
    } else if (slot.genArraySymb.numFreeSpin >= 0 && slot.boolFreeSpin && slot.switchNumFreeSpinMinus) {
        totalFreeSpin.setNumber(slot.genArraySymb.numFreeSpin);
    } else if (slot.genArraySymb.numFreeSpin >= 0 && slot.boolFreeSpin && slot.switchNumFreeSpinBoforePlus) {
        totalFreeSpin.setNumber(slot.genArraySymb.numFreeSpin - slot.genArraySymb.numFreeSpinToRound);
    } else  if (!slot.boolFreeSpin) {
        totalFreeSpin.stop();
    }

    if (slot.boolChangeStopToStart && boolStartStop) {
       button.startColor();
       sunlight.setStartButtonlight();
       boolStartStop = false;
    }
////////////////////////////////////////////////////////////
    // sunlight.updateWithTime( deltaTimeElapsed );
////////////////////////////////////////////////////////////
    slot.updateWithTime(deltaTimeElapsed, deltaTime);
    totalRound2D.update(deltaTime * 1.2);
    totalScore2D.update(deltaTime * 1.2);
    totalBet.update(deltaTime * 1.2);
    totalFreeSpin.update(deltaTimeElapsed, deltaTime * 1.2);
////////////////////////////////////////////////////////////
    var speedFactor = 2.0;
    if (slot.genArraySymb.numFreeSpin > 0) {
       // totalScore2D.stop();
        if (slot.genArraySymb.numFreeSpin > 0 && slot.boolFreeSpin) {
            slot.boolMoveBackFreeSpin = false;
            slot.boolMoveFreeSpin = true;
            if (slot.position.x <= -15.0) {
                slot.position.x = -15.0;
            } else {
                slot.position.x -= deltaTime * 10.0*speedFactor;
            }
            if (slot.position.y <= 0.0) {
                slot.position.y = 0.0;
            } else {
                slot.position.y -= deltaTime * 7.25*speedFactor;
            }
            if (slot.position.z >= 30.0) {
                slot.position.z = 30.0;
            } else {
                slot.position.z += deltaTime * 20.0*speedFactor;
            }
            ///////////////////
            totalFreeSpin.startAnimation();
            if (!isMobile) {
                if (effectController.focus <= 120) {
                    effectController.focus = 120;
                } else {
                    effectController.focus -= deltaTime * 20;
                }
              /*  if (effectController.aperture >= 10) {
                    effectController.aperture = 10;
                } else {
                    effectController.aperture += deltaTime * 20;
                }*/
                matChanger(effectController);
            }
        /*    if (totalFreeSpin.rotation.y <= -Math.PI / 4) {
                totalFreeSpin.rotation.y = -Math.PI / 4;
            } else {
                totalFreeSpin.rotation.y -= deltaTime*0.45*speedFactor;
            }
            if (totalFreeSpin.position.x <= 60.0) {
                totalFreeSpin.position.x = 60.0;
            } else {
                totalFreeSpin.position.x -= deltaTime * 35.0*speedFactor;
            }*/
        /*    if (totalFreeSpin.position.y <= 12.0) {
                totalFreeSpin.position.y = 12.0;
            } else {
                totalFreeSpin.position.y -= deltaTime * 10.0*speedFactor;
            }*/
          /*  if (totalFreeSpin.position.z >= 40.0) {
                totalFreeSpin.position.z = 40.0;
            } else {
                totalFreeSpin.position.z += deltaTime * 30*speedFactor;
            }*/
            //////////////////
            if (totalScore2D.rotation.x <= -Math.PI) {
                totalScore2D.rotation.x = -Math.PI;
            } else {
                totalScore2D.rotation.x -= deltaTime * 0.5 * speedFactor;
            }
            if (totalScore2D.position.y <= -70) {
                totalScore2D.position.y = -70;
            } else {
                totalScore2D.position.y -= deltaTime * 30.0*speedFactor;
            }
            sunlight.setPositionTotalScorelight(totalScore2D.position);
            ///////////////////
            if (totalBet.rotation.y >= Math.PI) {
                totalBet.rotation.y = Math.PI;
            } else {
                totalBet.rotation.y += deltaTime * 1.0 * speedFactor;
            }
            ///////////////////
            if (buttonHoloBet.position.y <= -70) {
                buttonHoloBet.position.y = -70;
            } else {
                buttonHoloBet.position.y -= deltaTime * 30.0*speedFactor;
            }
        }
    } else if (slot.genArraySymb.numFreeSpin <= 0 && !slot.boolFreeSpin) {
        if (slot.position.x >= 0.0) {
            slot.position.x = 0.0;
        } else {
            slot.position.x += deltaTime * 10.0*speedFactor;
        }
        if (slot.position.y >= 11.0) {
            slot.position.y = 11.0;
        } else {
            slot.position.y += deltaTime * 7.25*speedFactor;
        }
        if (slot.position.z <= 0.0) {
            slot.position.z = 0.0;
            slot.boolMoveBackFreeSpin = true;
            slot.boolMoveFreeSpin = false;
        } else {
            slot.position.z -= deltaTime * 20.0*speedFactor;
        }
        //////////////////////////
        totalFreeSpin.startAnimationAfterPause();
        if (!isMobile) {
            if (effectController.focus >= 140) {
                effectController.focus = 140;
            } else {
                effectController.focus += deltaTime * 20;
            }
           /* if (effectController.aperture <= 5) {
                effectController.aperture = 5;
            } else {
                effectController.aperture -= deltaTime * 20;
            }*/
            matChanger(effectController);
        }
       /* if (totalFreeSpin.rotation.y >= 0.0) {
            totalFreeSpin.rotation.y = 0.0;
        } else {
            totalFreeSpin.rotation.y += deltaTime*0.45*speedFactor;
        }
        if (totalFreeSpin.position.x >= 120.0) {
            totalFreeSpin.position.x = 120.0;
        } else {
            totalFreeSpin.position.x += deltaTime * 30.0*speedFactor;
        }*/
       /* if (totalFreeSpin.position.y >= 22.0) {
            totalFreeSpin.position.y = 22.0;
        } else {
            totalFreeSpin.position.y += deltaTime * 0.01*speedFactor;
        }*/
       /* if (totalFreeSpin.position.z <= 10.0) {
            totalFreeSpin.position.z = 10.0;
        } else {
            totalFreeSpin.position.z -= deltaTime * 0.05*speedFactor;
        }*/
        ////////////////////////////
        if (totalScore2D.rotation.x >= -Math.PI/2) {
            totalScore2D.rotation.x = -Math.PI/2;
        } else {
            totalScore2D.rotation.x += deltaTime * 0.5 * speedFactor;
        }
        if (totalScore2D.position.y >= -42) {
            totalScore2D.position.y = -42;
        } else {
            totalScore2D.position.y += deltaTime * 30.0*speedFactor;
        }
        sunlight.setPositionTotalScorelight(totalScore2D.position);
        //////////////////////////
        if (totalBet.rotation.y <= 0) {
            totalBet.rotation.y = 0;
        } else {
            totalBet.rotation.y -= deltaTime * 1.0 * speedFactor;
        }
        ///////////////////
        if (buttonHoloBet.position.y >= -46) {
            buttonHoloBet.position.y = -46;
        } else {
            buttonHoloBet.position.y += deltaTime * 30.0*speedFactor;
        }
    }
    /* if (slot.getBoolEndAnimation()) {
         boolStartStop = false;
         startStopButton.setTexture("start");
     }*/
    //startStopButton.update(deltaTime * 4.);
    //buttonFullScreen.update(deltaTime * 4.);
    //buttonDayNight.update(deltaTime * 4.);
    //button3D.update(deltaTime * 4.);
////////////////////////////////////////////////////////////
    buttonHoloFullScreen.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloAutoPlay.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloBet.updateWithTime(deltaTimeElapsed, deltaTime);
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
    if (boolControls) {
        controls.update();
    }
    stats.update();
  //  rendererStats.update(renderer);
    render();
}

function render() {
    // render cube map
  //  totalFreeSpin.visible = false;
  //  cubeCamera.update( renderer, scene );
 //   totalFreeSpin.visible = true;
    if (!isMobile) {
        postprocessing.composer.render(0.1);
    } else {
        renderer.render( scene, camera );
    }
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
            if (!slot.genArraySymb.boolFreeSpin) {
                slot.stopStartRotateSymb();
                var totalScore = slot.getTotalScore();
                totalScore2D.setNumber(totalScore);
                if (!boolStartStop) {
                    button.stopColor();
                    sunlight.setStopButtonlight();
                    totalRound2D.setBeginNumber(0);
                    totalRound2D.stop();
                    if (!totalRound2D.nameSlot.visible) {
                        totalRound2D.visibleSlotName();
                    }
                    boolStopScore = true;
                    boolStartStop = true;
                } else if (slot.boolChangeStopToStart) {
                    button.startColor();
                    sunlight.setStartButtonlight();
                    boolStartStop = false;
                }
            } else {
                slot.stopStartRotateSymbFreeSpin();
                if (!boolStartStop) {
                    button.stopColor();
                    sunlight.setStopButtonlight();
             //       totalRound2D.setBeginNumber(0);
              //      totalRound2D.stop();
              //      if (!totalRound2D.nameSlot.visible) {
               //         totalRound2D.visibleSlotName();
              //      }
                    boolStopScore = true;
                    boolStartStop = true;
                } else if (slot.boolChangeStopToStart) {
                    button.startColor();
                    sunlight.setStartButtonlight();
                    boolStartStop = false;
                }
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
    var intersects = raycaster.intersectObjects( groupButton.children, true );

    if (intersects.length > 0) {
        if (intersects[0].object.parent.parent.parent.name == "buttonStartStop") {
            document.body.style.cursor = 'pointer';
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloFullScreen") {
            document.body.style.cursor = 'pointer';
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloAutoPlay") {
            document.body.style.cursor = 'pointer';
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloBet") {
            var uv = intersects[ 0 ].uv;
            if (uv.x >= 0.24 && uv.x <= 0.76 && uv.y >= 0.65 && uv.y <= 0.88) {
                document.body.style.cursor = 'pointer';
            } else if (uv.x >= 0.24 && uv.x <= 0.76 && uv.y >= 0.12 && uv.y <= 0.35) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'auto';
            }
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
       // console.log(intersects[0].object.parent.name);
        if (intersects[0].object.parent.name == "button") {
            boolMoveCamera = false;
            if (!slot.genArraySymb.boolFreeSpin) {
                slot.stopStartRotateSymb();
                var totalScore = slot.getTotalScore();
                totalScore2D.setNumber(totalScore);
                if (!boolStartStop) {
                    button.stopColor();
                    sunlight.setStopButtonlight();
                    totalRound2D.setBeginNumber(0);
                    totalRound2D.stop();
                    if (!totalRound2D.nameSlot.visible) {
                        totalRound2D.visibleSlotName();
                    }
                    boolStopScore = true;
                    boolStartStop = true;
                } else if (slot.boolChangeStopToStart) {
                    button.startColor();
                    sunlight.setStartButtonlight();
                    boolStartStop = false;
                }
            } else {
                slot.stopStartRotateSymbFreeSpin();
                if (!boolStartStop) {
                    button.stopColor();
                    sunlight.setStopButtonlight();
                    //       totalRound2D.setBeginNumber(0);
                    //      totalRound2D.stop();
                    //      if (!totalRound2D.nameSlot.visible) {
                    //         totalRound2D.visibleSlotName();
                    //      }
                    boolStopScore = true;
                    boolStartStop = true;
                } else if (slot.boolChangeStopToStart) {
                    button.startColor();
                    sunlight.setStartButtonlight();
                    boolStartStop = false;
                }
            }
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloFullScreen") {
            if( THREEx.FullScreen.activated() ){
                THREEx.FullScreen.cancel();
                buttonHoloFullScreen.setTexture( textureFullScreen );
                // buttonFullScreen.children[0].material.map = fullScreenButton;
                // buttonFullScreen.children[0].material.map.needsUpdate = true;
            }else{
                THREEx.FullScreen.request();
                buttonHoloFullScreen.setTexture( textureFullScreenCancel );
                // buttonFullScreen.children[0].material.map = fullScreenButtonCancel;
                // buttonFullScreen.children[0].material.map.needsUpdate = true;
            }
            buttonHoloFullScreen.startGlitch();
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloAutoPlay") {
            if (!slot.genArraySymb.boolFreeSpin) {
                if (!boolStartStopAutoPlay) {
                    console.log("AutoPlay = Start");
                    boolStartStopAutoPlay = true;
                    slot.autoPlay = true;
                    buttonHoloAutoPlay.OnOff();
                    slot.stopStartRotateSymb();
                } else {
                    console.log("AutoPlay = Stop");
                    boolStartStopAutoPlay = false;
                    slot.autoPlay = false;
                    buttonHoloAutoPlay.OnOff();
                    //  slot.stopStartRotateSymb();
                    boolStartStop = true;
                }
                buttonHoloAutoPlay.startGlitch();

            } else {
                if (!boolStartStopAutoPlay) {
                    console.log("AutoPlay = Start");
                    boolStartStopAutoPlay = true;
                    slot.autoPlay = true;
                    buttonHoloAutoPlay.OnOff();
                    slot.stopStartRotateSymbFreeSpin();
                } else {
                    console.log("AutoPlay = Stop");
                    boolStartStopAutoPlay = false;
                    slot.autoPlay = false;
                    buttonHoloAutoPlay.OnOff();
                    //  slot.stopStartRotateSymbFreeSpin();
                    boolStartStop = true;
                }
                buttonHoloAutoPlay.startGlitch();
            }
        }
        if (intersects[0].object.parent.parent.parent.name == "buttonHoloBet") {

            var uv = intersects[ 0 ].uv;

            buttonHoloBet.startGlitch();
            var bet = slot.getBet();
            totalBet.setBeginNumber(bet);

            if (uv.x >= 0.24 && uv.x <= 0.76 && uv.y >= 0.65 && uv.y <= 0.88) {
                if (bet < 50) {
                    bet += 10.0;
                } else if (bet >= 50 && bet < 500) {
                    bet += 50.0;
                } else if (bet >= 500 && bet < 1000) {
                    bet += 100.0;
                } else if (bet >= 1000) {
                    bet = 1000.0;
                }
                totalBet.setNumber(bet);
                slot.setBet(bet);
            } else if (uv.x >= 0.24 && uv.x <= 0.76 && uv.y >= 0.12 && uv.y <= 0.35) {
                if (bet <= 50 && bet > 10) {
                    bet -= 10.0;
                } else if (bet > 50 && bet <= 500) {
                    bet -= 50.0;
                } else if (bet > 500 && bet <= 1000) {
                    bet -= 100.0;
                } else if (bet <= 10) {
                    bet = 10.0;
                }
                totalBet.setNumber(bet);
                slot.setBet(bet);
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
         */
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