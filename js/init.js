var container;

var boolControls = false;

var postprocessing = {};
var matChanger, effectController;

var camera, cubeCamera, scene, renderer, controls;
var cameraParent = new THREE.Object3D;

var sunlight, tv, slot;

var dtCollect = 0;
var dtNameSlot = 0;

var boolStartStop = false;
var boolStartStopAutoPlay = false;
var boolUpdateScore = false;
var button, terminal, buttonHoloFullScreen, buttonHoloAutoPlay, buttonHoloBet;
var textureFullScreen, textureFullScreenCancel;

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

var totalRound2D, totalScore2D, totalBet, totalFreeSpin;
var boolStopScore = false;
var boolStartColor = false;
var isMobile;
var stringInsert = "";

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

function desktop() {
    slot = new ControllerTV(0, 0, 0, 3, 3, 8, 12, textureLoader, isMobile);
    slot.position.y = 11.0;
    // slot.scale.set(2.1, 2.1, 2.1);
    scene.add(slot);
////////////////////////////////////////////
    textureFullScreen = textureLoader.load("textures/" + stringInsert + "button/buttonFullScreen.png");
    textureFullScreenCancel = textureLoader.load("textures/" + stringInsert + "button/buttonFullScreenCancel.png");
    buttonHoloFullScreen = new ButtonHolo(textureFullScreen, textureLoader, isMobile);
    buttonHoloFullScreen.name = "buttonHoloFullScreen";
    buttonHoloFullScreen.position.set(48, 45, 28);
    buttonHoloFullScreen.scale.set(0.1, 0.1, 0.1);
    groupButton.add(buttonHoloFullScreen);
///////////////////////////////////////////////
    var textureAutoPlay = textureLoader.load("textures/" + stringInsert + "button/buttonAutoPlay.png");
    buttonHoloAutoPlay = new ButtonHolo(textureAutoPlay, textureLoader, isMobile);
    buttonHoloAutoPlay.name = "buttonHoloAutoPlay";
    buttonHoloAutoPlay.position.set(60, -46, 27);
    buttonHoloAutoPlay.scale.set(0.15, 0.15, 0.15);
    groupButton.add(buttonHoloAutoPlay);
////////////////////////////////////////////
    var textureBet = textureLoader.load("textures/" + stringInsert + "button/buttonBet.png");
    buttonHoloBet = new ButtonHolo(textureBet, textureLoader, isMobile);
    buttonHoloBet.name = "buttonHoloBet";
    buttonHoloBet.position.set(-60, -46, 19);
    buttonHoloBet.scale.set(0.2, 0.2, 0.2);
    groupButton.add(buttonHoloBet);
////////////////////////////////////////////
    button = new Button3D(textureLoader, isMobile);
    button.name = "buttonStartStop";
    button.position.set(60, -30, 14.0);
    button.scale.set(0.2, 0.2, 0.2);
    button.rotation.x = Math.PI/10;
    groupButton.add(button);
    groupButton.name = "groupButton";
    scene.add(groupButton);
///////////////////////////////////////////////
    //var stringIn = totalScore.toString();
    var stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    var stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalRound2D = new MessageTotalRound(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01, isMobile);
    totalRound2D.position.y = 45 /*+ 10*/;
    totalRound2D.position.z = 30;
    totalRound2D.rotation.x = 0.32;
    totalRound2D.setBeginNumber(0);
    totalRound2D.setNumber(0);
    totalRound2D.stop();
    totalRound2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalRound2D);
////////////////////////////////////////////
    stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalScore2D = new MessageTotalScore(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01, isMobile);
    totalScore2D.position.y = -38 /*+ 10*/;
    totalScore2D.position.z = 40;
    totalScore2D.rotation.x = -0.3;
    var totalScore = slot.getTotalScore();
    totalScore2D.setBeginNumber(totalScore);
    totalScore2D.setNumber(totalScore);
    totalScore2D.scale.set(0.7, 0.7, 0.7);
    scene.add(totalScore2D);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalBet = new MessageBet(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01, isMobile);
    totalBet.position.y = -23.5 /*+ 10*/;
    totalBet.position.x = -65;
    totalBet.position.z = 5;
    var bet = slot.getBet();
    totalBet.setBeginNumber(0);
    totalBet.setNumber(bet);
    totalBet.scale.set(0.7, 0.7, 0.7);
    scene.add(totalBet);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalFreeSpin = new MessageFreeSpin(-4.0, 0, 87, textureLoader, stringPattern, 5, 2, stringIn, "centre", 7, 7, -0.75, 0.01, isMobile);
    totalFreeSpin.position.y = 12 /*+ 10*/;
    totalFreeSpin.position.x = 70;
    totalFreeSpin.position.z = -45;
    totalFreeSpin.setBeginNumber(0);
    totalFreeSpin.setNumber(0);
    totalFreeSpin.stop();
    scene.add(totalFreeSpin);
//////////////////////////////////////////////////
    terminal = new Terminal(textureLoader, isMobile);
    terminal.name = "terminal";
    terminal.position.set(0, -40.0, 5.0);
    terminal.scale.set(0.2, 0.2, 0.2);
    //  terminal.rotation.set(0.5, 0.0, 0.3);
    //terminal.rotation.x = Math.PI/9;
    // terminal.rotation.y = Math.PI/6;
    //  terminal.rotation.z = Math.PI/6;
    scene.add(terminal);
///////////////////////////////////////////////
}

function updateDesktop(deltaTime, deltaTimeElapsed) {
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
                    dtCollect += deltaTime;
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
                        dtCollect += deltaTime;
                    }
                }
            }
        }

    } else {
        buttonHoloAutoPlay.materialHolo.uniforms.boolOn.value = false;
        buttonHoloAutoPlay.boolOnOffSwitch = false;
        boolStartStopAutoPlay = false;

        if (slot.getTotalSum() > 0 && boolStopScore && slot.getBoolEndAnimation()) {
            if (!slot.boolFreeSpin) {
                var totalRound = slot.getTotalSum();
                if (totalRound2D.boolEndOfCount) {
                    dtCollect += deltaTime;
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

    if (dtCollect > 1.0) {
        dtCollect = 0;
        totalScore2D.setNumber(slot.getTotalScore());
        totalRound2D.setNumber(0);
        boolStopScore = false;
        slot.autoPlayStop = false;
        boolStartColor = true;
    }
    if (totalRound2D.isZero) {
        dtNameSlot += deltaTime;
        if (!totalRound2D.nameSlot.visible && dtNameSlot > 0.5) {
            totalRound2D.visibleSlotName();
            dtNameSlot = 0.0;
            totalRound2D.isZero = false;
        }
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
    } else if (slot.genArraySymb.numFreeSpin >= 0 && slot.boolFreeSpin && slot.switchNumFreeSpinBeforePlus) {
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
                matChanger(effectController);
            }
            //////////////////
           /* if (totalScore2D.rotation.x <= -Math.PI) {
                totalScore2D.rotation.x = -Math.PI;
            } else {
                totalScore2D.rotation.x -= deltaTime * 1.0 * speedFactor;
            }*/
            if (totalScore2D.position.z >= 90) {
                totalScore2D.position.z = 90;
            } else {
                totalScore2D.position.z += deltaTime * 30.0*speedFactor;
            }
            sunlight.setPositionTotalScorelight(totalScore2D.position);
            ///////////////////
            if (totalBet.rotation.y >= Math.PI) {
                totalBet.rotation.y = Math.PI;
            } else {
                totalBet.rotation.y += deltaTime * 1.0 * speedFactor;
            }
            ///////////////////
            buttonHoloBet.children[0].children[0].children[0].visible = false;
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
            matChanger(effectController);
        }
        ////////////////////////////
       /* if (totalScore2D.rotation.x >= -Math.PI/2) {
            totalScore2D.rotation.x = -Math.PI/2;
        } else {
            totalScore2D.rotation.x += deltaTime * 1.0 * speedFactor;
        }*/
        /* if (totalScore2D.position.y >= -42) {
             totalScore2D.position.y = -42;
         } else {
             totalScore2D.position.y += deltaTime * 30.0*speedFactor;
         }*/
        if (totalScore2D.position.z <= 40) {
            totalScore2D.position.z = 40;
        } else {
            totalScore2D.position.z -= deltaTime * 50.0*speedFactor;
        }
        sunlight.setPositionTotalScorelight(totalScore2D.position);
        //////////////////////////
        if (totalBet.rotation.y <= 0) {
            totalBet.rotation.y = 0;
        } else {
            totalBet.rotation.y -= deltaTime * 1.0 * speedFactor;
        }
        ///////////////////
        buttonHoloBet.children[0].children[0].children[0].visible = true;
    }
////////////////////////////////////////////////////////////
    buttonHoloFullScreen.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloAutoPlay.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloBet.updateWithTime(deltaTimeElapsed, deltaTime);
    button.updateWithTime(deltaTimeElapsed, deltaTime);
}

function mobile() {
    slot = new ControllerTV(0, 0, 0, 3, 3, 8, 12, textureLoader, isMobile);
    slot.position.set(-25, 0, 30);
    //slot.position.y = 11.0;
    // slot.scale.set(2.1, 2.1, 2.1);
    scene.add(slot);
////////////////////////////////////////////
    textureFullScreen = textureLoader.load("textures/" + stringInsert + "button/buttonFullScreen.png");
    textureFullScreenCancel = textureLoader.load("textures/" + stringInsert + "button/buttonFullScreenCancel.png");
    buttonHoloFullScreen = new ButtonHolo(textureFullScreen, textureLoader, isMobile);
    buttonHoloFullScreen.name = "buttonHoloFullScreen";
    buttonHoloFullScreen.position.set(85, 25, 30);
    buttonHoloFullScreen.scale.set(0.12, 0.12, 0.12);
    groupButton.add(buttonHoloFullScreen);
///////////////////////////////////////////////
    var textureAutoPlay = textureLoader.load("textures/" + stringInsert + "button/buttonAutoPlay.png");
    buttonHoloAutoPlay = new ButtonHolo(textureAutoPlay, textureLoader, isMobile);
    buttonHoloAutoPlay.name = "buttonHoloAutoPlay";
    buttonHoloAutoPlay.position.set(60, -46+15, 27+30);
    buttonHoloAutoPlay.scale.set(0.2, 0.2, 0.2);
    groupButton.add(buttonHoloAutoPlay);
////////////////////////////////////////////
    var textureBet = textureLoader.load("textures/" + stringInsert + "button/buttonBet.png");
    buttonHoloBet = new ButtonHolo(textureBet, textureLoader, isMobile);
    buttonHoloBet.name = "buttonHoloBet";
    buttonHoloBet.position.set(35, -46+13, 19+30);
    buttonHoloBet.scale.set(0.2, 0.2, 0.2);
    groupButton.add(buttonHoloBet);
////////////////////////////////////////////
    button = new Button3D(textureLoader, isMobile);
    button.name = "buttonStartStop";
    button.position.set(60, -30+12, 14.0+30);
    button.scale.set(0.2, 0.2, 0.2);
    button.rotation.x = Math.PI/10;
    groupButton.add(button);
    groupButton.name = "groupButton";
    scene.add(groupButton);
///////////////////////////////////////////////
    //var stringIn = totalScore.toString();
    var stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    var stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalRound2D = new MessageTotalRound(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01, isMobile);
    totalRound2D.position.x = 45;
    totalRound2D.position.y = 40 /*+ 10*/;
    totalRound2D.position.z = 32;
    totalRound2D.rotation.x = 0.3;
    totalRound2D.setBeginNumber(0);
    totalRound2D.setNumber(0);
    totalRound2D.stop();
    totalRound2D.scale.set(0.65, 0.65, 0.65);
    scene.add(totalRound2D);
////////////////////////////////////////////
    stringIn = "000000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalScore2D = new MessageTotalScore(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 12, 12, -0.75, 0.01, isMobile);
    totalScore2D.position.x = -32;
    totalScore2D.position.y = 42 /*+ 10*/;
    totalScore2D.position.z = 35;
    totalScore2D.rotation.x = 0.3;
    var totalScore = slot.getTotalScore();
    totalScore2D.setBeginNumber(totalScore);
    totalScore2D.setNumber(totalScore);
    totalScore2D.scale.set(0.65, 0.65, 0.65);
    scene.add(totalScore2D);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalBet = new MessageBet(0, 0, 0, textureLoader, stringPattern, 5, 2, stringIn, "centre", 10, 10, -0.75, 0.01, isMobile);
    totalBet.position.x = 37;
    totalBet.position.y = -23.5+14 /*+ 10*/;
    totalBet.position.z = 5+30;
    //totalBet.rotation.z = Math.PI / 2.0;
    //totalBet.children[0].rotation.z = Math.PI / 2.0;
    var bet = slot.getBet();
    totalBet.setBeginNumber(0);
    totalBet.setNumber(bet);
    totalBet.scale.set(0.7, 0.7, 0.7);
    scene.add(totalBet);
////////////////////////////////////////////
    stringIn = "00000";
    //var stringPattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //var stringPattern = "abcdefghijklmnoprstuvwxyz1234567890";
    //var stringPattern = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    stringPattern = "0123456789";
    //var textLoader = new THREE.TextureLoader(loadingManager);
    //var baseTexture =  textLoader.load('textures/" + stringInsert + "winplane/numbers1.png');
    totalFreeSpin = new MessageFreeSpin(-4.0, 0, 87, textureLoader, stringPattern, 5, 2, stringIn, "centre", 7, 7, -0.75, 0.01, isMobile);
    totalFreeSpin.position.y = 14 /*+ 10*/;
    totalFreeSpin.position.x = 52;
    totalFreeSpin.position.z = 0;
    totalFreeSpin.scale.set(0.7, 0.7, 0.7);
    totalFreeSpin.setBeginNumber(0);
    totalFreeSpin.setNumber(0);
    totalFreeSpin.stop();
    scene.add(totalFreeSpin);
//////////////////////////////////////////////////
    terminal = new Terminal(textureLoader, isMobile);
    terminal.name = "terminal";
    terminal.position.set(0, -40+12.0, 5.0+30);
    terminal.scale.set(0.2, 0.2, 0.2);
    //  terminal.rotation.set(0.5, 0.0, 0.3);
    //terminal.rotation.x = Math.PI/9;
    // terminal.rotation.y = Math.PI/6;
    //  terminal.rotation.z = Math.PI/6;
    scene.add(terminal);
///////////////////////////////////////////////
}

function updateMobile(deltaTime, deltaTimeElapsed) {
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
                    dtCollect += deltaTime;
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
                        dtCollect += deltaTime;
                    }
                }
            }
        }

    } else {
        buttonHoloAutoPlay.materialHolo.uniforms.boolOn.value = false;
        buttonHoloAutoPlay.boolOnOffSwitch = false;
        boolStartStopAutoPlay = false;

        if (slot.getTotalSum() > 0 && boolStopScore && slot.getBoolEndAnimation()) {
            if (!slot.boolFreeSpin) {
                var totalRound = slot.getTotalSum();
                if (totalRound2D.boolEndOfCount) {
                    dtCollect += deltaTime;
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

    if (dtCollect > 1.0) {
        dtCollect = 0;
        totalScore2D.setNumber(slot.getTotalScore());
        totalRound2D.setNumber(0);
        boolStopScore = false;
        slot.autoPlayStop = false;
        boolStartColor = true;
    }

    if (totalRound2D.isZero) {
        dtNameSlot += deltaTime;
        if (!totalRound2D.nameSlot.visible && dtNameSlot > 0.5) {
            totalRound2D.visibleSlotName();
            dtNameSlot = 0.0;
            totalRound2D.isZero = false;
        }
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
    } else if (slot.genArraySymb.numFreeSpin >= 0 && slot.boolFreeSpin && slot.switchNumFreeSpinBeforePlus) {
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
        if (slot.genArraySymb.numFreeSpin > 0 && slot.boolFreeSpin) {
            slot.boolMoveBackFreeSpin = false;
            slot.boolMoveFreeSpin = true;
            if (slot.position.x >= -22.0) {
                slot.position.x = -22.0;
            } else {
                slot.position.x += deltaTime * 5.0*speedFactor;
            }
            if (slot.position.y >= 5.0) {
                slot.position.y = 5.0;
            } else {
                slot.position.y += deltaTime * 7.25*speedFactor;
            }
            if (slot.position.z >= 45.0) {
                slot.position.z = 45.0;
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
                matChanger(effectController);
            }
            //////////////////
          /*  if (totalScore2D.rotation.x <= -Math.PI) {
                totalScore2D.rotation.x = -Math.PI;
            } else {
                totalScore2D.rotation.x -= deltaTime * 1.0 * speedFactor;
            }*/
            if (totalScore2D.position.y >= 60) {
                totalScore2D.position.y = 60;
            } else {
                totalScore2D.position.y += deltaTime * 30.0*speedFactor;
            }
          //  sunlight.setPositionTotalScorelight(totalScore2D.position);
            ///////////////////
            if (totalRound2D.position.x >= 48) {
                totalRound2D.position.x = 48;
            } else {
                totalRound2D.position.x += deltaTime * 6.0*speedFactor;
            }

            if (totalRound2D.position.y <= 32) {
                totalRound2D.position.y = 32;
            } else {
                totalRound2D.position.y -= deltaTime * 15.25*speedFactor;
            }

            if (totalRound2D.position.z >= 58) {
                totalRound2D.position.z = 58;
            } else {
                totalRound2D.position.z += deltaTime * 33.0*speedFactor;
            }

            if (totalRound2D.scale.x <= 0.37) {
                totalRound2D.scale.x = 0.37;
            } else {
                totalRound2D.scale.x -= deltaTime * 0.4*speedFactor;
            }
            if (totalRound2D.scale.y <= 0.37) {
                totalRound2D.scale.y = 0.37;
            } else {
                totalRound2D.scale.y -= deltaTime * 0.4*speedFactor;
            }
            if (totalRound2D.scale.z <= 0.37) {
                totalRound2D.scale.z = 0.37;
            } else {
                totalRound2D.scale.z -= deltaTime * 0.4*speedFactor;
            }
            ///////////////////
            if (totalBet.rotation.y >= Math.PI) {
                totalBet.rotation.y = Math.PI;
            } else {
                totalBet.rotation.y += deltaTime * 2.0 * speedFactor;
            }
            if (totalBet.position.z <= 0) {
                totalBet.position.z = 0;
            } else {
                totalBet.position.z -= deltaTime * 30.0*speedFactor;
            }
            ///////////////////
            if (buttonHoloBet.position.y <= -60) {
                buttonHoloBet.position.y = -60;
            } else {
                buttonHoloBet.position.y -= deltaTime * 30.0*speedFactor;
            }
          //  buttonHoloBet.children[0].children[0].children[0].visible = false;
        }
    } else if (slot.genArraySymb.numFreeSpin <= 0 && !slot.boolFreeSpin) {
      //  slot.boolMoveBackFreeSpin = true;
     //   slot.boolMoveFreeSpin = false;
        if (slot.position.x <= -25.0) {
            slot.position.x = -25.0;
        } else {
            slot.position.x -= deltaTime * 5.0*speedFactor;
        }
        if (slot.position.y <= 0.0) {
            slot.position.y = 0.0;
        } else {
            slot.position.y -= deltaTime * 7.25*speedFactor;
        }

        if (slot.position.z <= 30.0) {
            slot.position.z = 30.0;
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
            matChanger(effectController);
        }
        ////////////////////////////
       /* if (totalScore2D.rotation.x >= -Math.PI/2) {
            totalScore2D.rotation.x = -Math.PI/2;
        } else {
            totalScore2D.rotation.x += deltaTime * 1.0 * speedFactor;
        }*/
         if (totalScore2D.position.y <= 42) {
             totalScore2D.position.y = 42;
         } else {
             totalScore2D.position.y -= deltaTime * 30.0*speedFactor;
         }
       /* if (totalScore2D.position.z <= 35) {
            totalScore2D.position.z = 35;
        } else {
            totalScore2D.position.z -= deltaTime * 30.0*speedFactor;
        }*/
       // sunlight.setPositionTotalScorelight(totalScore2D.position);
        ///////////////////
        if (totalRound2D.position.x <= 45) {
            totalRound2D.position.x = 45;
        } else {
            totalRound2D.position.x -= deltaTime * 10.0*speedFactor;
        }

        if (totalRound2D.position.y >= 42) {
            totalRound2D.position.y = 42;
        } else {
            totalRound2D.position.y += deltaTime * 15.25*speedFactor;
        }

        if (totalRound2D.position.z <= 35) {
            totalRound2D.position.z = 35;
        } else {
            totalRound2D.position.z -= deltaTime * 33.0*speedFactor;
        }

        if (totalRound2D.scale.x >= 0.65) {
            totalRound2D.scale.x = 0.65;
        } else {
            totalRound2D.scale.x += deltaTime * 0.4*speedFactor;
        }
        if (totalRound2D.scale.y >= 0.65) {
            totalRound2D.scale.y = 0.65;
        } else {
            totalRound2D.scale.y += deltaTime * 0.4*speedFactor;
        }
        if (totalRound2D.scale.z >= 0.65) {
            totalRound2D.scale.z = 0.65;
        } else {
            totalRound2D.scale.z += deltaTime * 0.4*speedFactor;
        }
        //////////////////////////
        if (totalBet.rotation.y <= 0) {
            totalBet.rotation.y = 0;
        } else {
            totalBet.rotation.y -= deltaTime * 2.0 * speedFactor;
        }
        if (totalBet.position.z >= 35) {
            totalBet.position.z = 35;
        } else {
            totalBet.position.z += deltaTime * 30.0*speedFactor;
        }
        ///////////////////
        if (buttonHoloBet.position.y >= -33) {
            buttonHoloBet.position.y = -33;
        } else {
            buttonHoloBet.position.y += deltaTime * 30.0*speedFactor;
        }
        //buttonHoloBet.children[0].children[0].children[0].visible = true;
    }
////////////////////////////////////////////////////////////
    buttonHoloFullScreen.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloAutoPlay.updateWithTime(deltaTimeElapsed, deltaTime);
    buttonHoloBet.updateWithTime(deltaTimeElapsed, deltaTime);
    button.updateWithTime(deltaTimeElapsed, deltaTime);
}

function init() {
    isMobile = new DetectedMobile().getIsMobile();
   // isMobile = true;

    if (isMobile) {
        stringInsert = "mobile/";
    }

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
    };

    textureLoader = new THREE.TextureLoader(loadingManager);

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
    camera.position.z = 160.0;
    camera.position.y = 10.0;
    cameraParent.add(camera);
    cameraParent.position.y = -10;
    // scene
    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( "#e8ede5", 0.1 );
    scene.add(cameraParent);
////////////////////////////////////////////
    // CUBE CAMERA
   // cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );
////////////////////////////////////////////
    sunlight = new SunLight(loadingManager, isMobile);
    scene.add(sunlight);
////////////////////////////////////////////
    if (isMobile) {
        mobile();
    } else {
        desktop();
    }

    renderer = new THREE.WebGLRenderer({ precision: "highp" });
    if (isMobile) {
        renderer.antialias = false;
    } else {
        renderer.antialias = true;
        renderer.physicallyBasedShading = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMapAutoUpdate = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.shadowMapSoft = true;
    }
    renderer.sortObjects = false;
    renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setClearColor("#dcf6ff");
    renderer.setSize( window.innerWidth, window.innerHeight );

    if (!isMobile) {
        scene.matrixAutoUpdate = false;
        initPostprocessing();
        renderer.autoClear = false;
        effectController = {
            focus: 140.0,
            aperture: 1.0,
            maxblur: 0.05
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

    if (isMobile) {
        updateMobile(deltaTime, deltaTimeElapsed);
    } else {
        updateDesktop(deltaTime, deltaTimeElapsed);
    }

////////////////////////////////////////////////////////////
    if (boolControls) {
        controls.update();
    }
    stats.update();
   // rendererStats.update(renderer);
    render();
}

function render() {
    //if (!isMobile) {
        // render cube map
      //  slot.visible = false;
      //  cubeCamera.update( renderer, scene );
      //  slot.visible = true;
     //   postprocessing.composer.render(0.1);
   // } else {
        renderer.render( scene, camera );
  //  }
}

function onKeyDown ( event ) {
    switch ( event.keyCode ) {
        case 82: // r - refresh

            break;
        case 83: // s - stop
            break;
        case 84: // t - paused
            break;
        case 32: // stop rotate
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
            }else{
                THREEx.FullScreen.request();
                buttonHoloFullScreen.setTexture( textureFullScreenCancel );
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
    }
}