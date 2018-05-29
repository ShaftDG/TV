function  ControllerTV(posX, posY, posZ, numTVperLine, numLineTV, numSymbPerCylinder, totalSymb, textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "ControllerTV";

    this.textureLoader = textureLoader;

    this.dt = 0;
    this.dt1 = 0;
    this.dt2 = 0;

    this.k = 0;
    this.f = 0;
    this.g = 0;
    if (isMobile) {
        this.endPosition = new THREE.Vector3(65, 10, 12);
    } else {
        this.endPosition = new THREE.Vector3(77, 12, 12);
    }

    this.d = new THREE.Vector3(0,0,0);

    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;

    this.totalSum = 0;

    this.totalRoundFreeSpin = 0;

    this.speedSwitchStop = 0.25;
    this.speedSwitchBetweenRounds = 0.4;
    this.speedSwitchMoveBack = 2.0;
    this.speedSwitchWinLine = 3.0;

    this.numTVperLine = numTVperLine;
    this.numLineTV = numLineTV;
    this.numTotalTV = numLineTV * numTVperLine;

    this.numSymbPerCylinder = numSymbPerCylinder;
    this.numPlayingSymbPerCilinder = 3;
    this.totalSymb = totalSymb;
    /* this.arrayStop = [
         [1, 3, 5, 7],
         [2, 4, 6, 8],
         [9, 10, 11, 0],
         [2, 4, 6, 8],
         [9, 10, 11, 0],
     ];*/

    this.genArraySymb = new GenerateWinCombination(this.numTVperLine, this.numPlayingSymbPerCilinder, this.totalSymb);
    /* this.arrayStop = [
         [1, 3, 5],
         [4, 6, 8],
         [10, 11, 0],
         [2, 4, 6],
         [9, 10, 11],
     ];*/
    // this.arrayStop = this.genArraySymb.generate();
    this.arrayStop = [];

    this.arrayMove = [];

    this.boolRotate = false;

    this.boolUpdateArraySymb = false;
    this.boolStop = false;
    this.boolStart = true;
    this.boolMoveFront = false;
  //  this.boolMoveBack = false;
    this.boolEndAnimation = true;
    this.boolStartTimer = false;
    this.boolForceStop = false;
    this.boolShowLine = false;
    this.canStop = true;
    this.boolChangeStopToStart = true;

    this.boolMoveFreeSpin = false;
    this.boolMoveBackFreeSpin = false;
    this.switchNumFreeSpinMinus = false;
    this.switchNumFreeSpinPlus = false;
    this.switchNumFreeSpinBeforePlus = false;
    this.resolutionStart = false;

    this.animationEnded = false;

    this.autoPlay = false;
    this.autoPlayStart = false;
    this.autoPlayStop = false;

    this.boolFreeSpin = false;

    this.switchK = false;

    this.distanceBetweenTVX = 33;
    this.distanceBetweenTVY = 26;

  /*  var length = this.numTVperLine * (this.widthTV + this.distanceBetweenTV) - this.distanceBetweenTV;
    for (var i = 0; i < this.numTVperLine; i++) {
        var cylinder = new CylinderSlot(this.radiusCylinder, this.widthTV, this.numSymbPerCylinder, shaders, this.textureLoader, isMobile);
        cylinder.position.x =(0 - length / 2) + this.widthTV/2 + this.widthTV * i + this.distanceBetweenTV * i;
        this.add(cylinder);
    }*/
if (isMobile) {
    var optionsTonguesOfFire = {
        xCoord: 0,
        yCoord: 0,
        zCoord: 0,
        totalParticles: 5,
        scaleSizeParticles: 60,
        distortFlame: 1.8,
        distortAlpha: 1.4,
        beginRadius: 0.2,
        endRadius: 10.0,
        combustion: 0.1,
        movementSpeed: 4.0,
        pulseFactor: 1.0,
        boolBlending: true,
        flameSpeed: 2.0
    };

    var optionsOriginFire = {
        xCoord: 0,
        yCoord: 0,
        zCoord: 0,
        totalParticles: 1,
        scaleSizeParticles: 100,
        distortFlame: 1.4,
        distortAlpha: 1.4,
        beginRadius: 0.2,
        endRadius: 100.0,
        combustion: 0.013,
        movementSpeed: 0.0,
        pulseFactor: 0.0,
        boolBlending: true,
        flameSpeed: 2.0
    };
} else {
    var optionsTonguesOfFire = {
        xCoord: 0,
        yCoord: 0,
        zCoord: 0,
        totalParticles: 20,
        scaleSizeParticles: 95,
        distortFlame: 1.8,
        distortAlpha: 1.4,
        beginRadius: 0.2,
        endRadius: 10.0,
        combustion: 0.1,
        movementSpeed: 4.0,
        pulseFactor: 1.0,
        boolBlending: true,
        flameSpeed: 2.0
    };

    var optionsOriginFire = {
        xCoord: 0,
        yCoord: 0,
        zCoord: 0,
        totalParticles: 5,
        scaleSizeParticles: 140,
        distortFlame: 1.4,
        distortAlpha: 1.4,
        beginRadius: 0.2,
        endRadius: 100.0,
        combustion: 0.013,
        movementSpeed: 0.0,
        pulseFactor: 0.0,
        boolBlending: true,
        flameSpeed: 2.0
    };
}
    var optionsOriginFireParticles = {
        xCoord:              optionsOriginFire.xCoord,
        yCoord:              optionsOriginFire.yCoord,
        zCoord:              optionsOriginFire.zCoord,
        noiseTexture:        textureLoader.load("textures/sprites/originFire.png"),
        windVector:          new THREE.Vector3(-1.0, 0.0, 0.0),
        totalParticles:      optionsOriginFire.totalParticles,
        scaleSizeParticles:  optionsOriginFire.scaleSizeParticles,
        distortFlame:        optionsOriginFire.distortFlame,
        distortAlpha:        optionsOriginFire.distortFlame,
        beginRadius:         optionsOriginFire.beginRadius,
        endRadius:           optionsOriginFire.endRadius,
        combustion:          optionsOriginFire.combustion,
        movementSpeed:       optionsOriginFire.movementSpeed,
        pulseFactor:         optionsOriginFire.pulseFactor,
        boolBlending:        optionsOriginFire.boolBlending,
        flameSpeed:          optionsOriginFire.flameSpeed
    };
    var optionsTonguesOfFireParticles = {
        xCoord:                 optionsTonguesOfFire.xCoord,
        yCoord:                 optionsTonguesOfFire.yCoord,
        zCoord:                 optionsTonguesOfFire.zCoord,
        noiseTexture:           textureLoader.load("textures/sprites/originFire.png"),
        windVector:             new THREE.Vector3(-1.0, 0.0, 0.0),
        totalParticles:         optionsTonguesOfFire.totalParticles,
        scaleSizeParticles:     optionsTonguesOfFire.scaleSizeParticles,
        distortFlame:           optionsTonguesOfFire.distortFlame,
        distortAlpha:           optionsTonguesOfFire.distortFlame,
        beginRadius:            optionsTonguesOfFire.beginRadius,
        endRadius:              optionsTonguesOfFire.endRadius,
        combustion:             optionsTonguesOfFire.combustion,
        movementSpeed:          optionsTonguesOfFire.movementSpeed,
        pulseFactor:            optionsTonguesOfFire.pulseFactor,
        boolBlending:           optionsTonguesOfFire.boolBlending,
        flameSpeed:             optionsTonguesOfFire.flameSpeed
    };
    var optionsFire = {
        optionsOriginFireParticles: optionsOriginFireParticles,
        optionsTonguesOfFireParticles: optionsTonguesOfFireParticles
    };

    this.tvArray = new Array(this.numLineTV);
    for (var j = 0; j < this.numTVperLine; j++ ) {
        this.tvArray[j]=[];
    }

    this.particlesArray = new Array(3);

    var lengthX = (this.numTVperLine - 1) * (this.distanceBetweenTVX);
    var lengthY = (this.numTVperLine - 1) * (this.distanceBetweenTVY);
    if (isMobile) {

    } else {}
    for (var i = 0; i < this.numLineTV; i++) {
        for (var j = 0; j < this.numTVperLine; j++) {
            if ( i == 0 ) {
                var tv = new TV(textureLoader, "up", isMobile);
                tv.position.y = (lengthY / 2) - this.distanceBetweenTVY * i - 1.0;
                tv.position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                tv.position.z += 8;
                tv.rotation.x = 0.35;

                if ( j == 0 ) {
                    tv.rotation.y = 0.35;
                    tv.rotation.z = -0.15;
                 //   tv.position.x -= 2.5;
                    tv.position.z += 6;
                } else if ( j == 2) {
                    tv.rotation.y = -0.35;
                    tv.rotation.z = 0.15;
                 //   tv.position.x += 2.5;
                    tv.position.z += 6;
                }
                //  tv.position.z = -0.5;
                tv.scale.set(0.1, 0.1, 0.1);
                this.add(tv);
            } else if ( i == 1 ) {
                var tv = new TV(textureLoader, "middle", isMobile);
                tv.position.y = (lengthY / 2) - this.distanceBetweenTVY * i;
                tv.position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                if ( j == 0 ) {
                    tv.rotation.y = 0.35;
                    tv.position.x -= 2.5;
                    tv.position.z += 6;
                } else if ( j == 2) {
                    tv.rotation.y = -0.35;
                    tv.position.x += 2.5;
                    tv.position.z += 6;
                }
                //  tv.position.z = -0.5;
                tv.scale.set(0.1, 0.1, 0.1);
                this.add(tv);
            } else if ( i == 2 ) {
                var tv = new TV(textureLoader, "down", isMobile);
                tv.position.y = (lengthY / 2) - this.distanceBetweenTVY * i;
                tv.position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                tv.position.z += 2;
                tv.rotation.x = -0.35;
                if ( j == 0 ) {
                    tv.rotation.y = 0.35;
                    tv.rotation.z = 0.15;
                    tv.position.x -= 2.5;
                    tv.position.z += 6;
                } else if ( j == 2) {
                    tv.rotation.y = -0.35;
                    tv.rotation.z = -0.15;
                    tv.position.x += 2.5;
                    tv.position.z += 6;
                }
                //  tv.position.z = -0.5;
                tv.scale.set(0.1, 0.1, 0.1);
                this.add(tv);
            }
            tv.stopRotateSymb( Math.round( Math.random() * 7.0 ) );
            tv.name = "tv";
            this.tvArray[i][j] = tv;
        }
    }
    for (var i = 0; i < this.particlesArray.length; i++) {
            var flameParticlesFreeSpin = new FlameBonfire(optionsFire, loadingManager, isMobile);
            flameParticlesFreeSpin.name = "fire";
            flameParticlesFreeSpin.position.x = 0;
            flameParticlesFreeSpin.position.y = -20 + i * 10;
            flameParticlesFreeSpin.position.z = 30;
            flameParticlesFreeSpin.scaled = false;
            this.addGeometry(flameParticlesFreeSpin, new THREE.SphereBufferGeometry(0.1), optionsOriginFireParticles.windVector);
          //  flameParticlesFreeSpin.start();
            this.add(flameParticlesFreeSpin);
            this.particlesArray[i] = flameParticlesFreeSpin;
    }
/*    this.tv = new TV(textureLoader, isMobile);
    this.tv.position.y = 1.0;
    this.tv.position.x = 0.0;
    this.tv.position.z = -0.5;
    this.tv.scale.set(0.05, 0.05, 0.05);
    this.add(this.tv);*/

    this.position.x = this.posX;
    this.position.y = this.posY;
    this.position.z = this.posZ;
}
ControllerTV.prototype = Object.create(THREE.Object3D.prototype);
ControllerTV.prototype.constructor = ControllerTV;

ControllerTV.prototype.addGeometry = function(flameParticlesFreeSpin, geometry, windVector ) {
    flameParticlesFreeSpin.addFlame( geometry, windVector );
};

ControllerTV.prototype.setMotionVector = function(beginPosition, endPosition) {

    var vector = new THREE.Vector3(
                        beginPosition.x - endPosition.x,
                        beginPosition.y - endPosition.y,
                        beginPosition.z - endPosition.z
        );

    var length = Math.sqrt( vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    var inversLength  = 1.0 / length;
    vector.x *= inversLength;
    vector.y *= inversLength;
    vector.z *= inversLength;
return vector;
};

ControllerTV.prototype.freeSpinGamePosition = function(deltaTime) {
    var lengthX = (this.numTVperLine - 1) * (this.distanceBetweenTVX);
    var lengthY = (this.numTVperLine - 1) * (this.distanceBetweenTVY);
    for (var i = 0; i < this.numLineTV; i++) {
        for (var j = 0; j < this.numTVperLine; j++) {
            if ( i == 0 ) {
                if (this.tvArray[i][j].position.y >= ((lengthY / 2) - this.distanceBetweenTVY * i) + 3 ) {
                    this.tvArray[i][j].position.y = ((lengthY / 2) - this.distanceBetweenTVY * i) + 3;
                } else {
                    this.tvArray[i][j].position.y += deltaTime*10.0;
                }
                if (this.tvArray[i][j].rotation.x <= 0) {
                    this.tvArray[i][j].rotation.x = 0;
                } else {
                    this.tvArray[i][j].rotation.x -= deltaTime;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y <= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z >= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z += deltaTime;
                    }
                    if (this.tvArray[i][j].position.x <= (0 - lengthX / 2) + this.distanceBetweenTVX * j - 2.5) {
                        this.tvArray[i][j].position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j - 2.5;
                    } else {
                        this.tvArray[i][j].position.x -= deltaTime*7.5
                    }
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*40.0;
                    }
                } else if ( j == 1) {
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*30.0;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y >= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z <= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z -= deltaTime;
                    }
                    if (this.tvArray[i][j].position.x >= (0 - lengthX / 2) + this.distanceBetweenTVX * j + 2.5) {
                        this.tvArray[i][j].position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j + 2.5;
                    } else {
                        this.tvArray[i][j].position.x += deltaTime*7.5;
                    }
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*40.0;
                    }
                }
            } else if ( i == 1 ) {
                if (this.tvArray[i][j].position.y >= ((lengthY / 2) - this.distanceBetweenTVY * i) + 3 ) {
                    this.tvArray[i][j].position.y = ((lengthY / 2) - this.distanceBetweenTVY * i) + 3;
                } else {
                    this.tvArray[i][j].position.y += deltaTime*10.0;
                }

                if (this.tvArray[i][j].position.z <= 0) {
                    this.tvArray[i][j].position.z = 0;
                } else {
                    this.tvArray[i][j].position.z -= deltaTime*20.0;
                }

                if (this.tvArray[i][j].rotation.x <= 0) {
                    this.tvArray[i][j].rotation.x = 0;
                } else {
                    this.tvArray[i][j].rotation.x -= deltaTime;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y <= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z >= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z += deltaTime;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y >= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z <= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z -= deltaTime;
                    }
                }
            } else if ( i == 2 ) {
                if (this.tvArray[i][j].position.y >= ((lengthY / 2) - this.distanceBetweenTVY * i) + 3 ) {
                    this.tvArray[i][j].position.y = ((lengthY / 2) - this.distanceBetweenTVY * i) + 3;
                } else {
                    this.tvArray[i][j].position.y += deltaTime*10.0;
                }
                if (this.tvArray[i][j].rotation.x >= 0) {
                    this.tvArray[i][j].rotation.x = 0;
                } else {
                    this.tvArray[i][j].rotation.x += deltaTime * 0.9;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y <= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z <= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z -= deltaTime;
                    }
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*30.0;
                    }
                } else if ( j == 1) {
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*20.0;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y >= 0) {
                        this.tvArray[i][j].rotation.y = 0;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z >= 0) {
                        this.tvArray[i][j].rotation.z = 0;
                    } else {
                        this.tvArray[i][j].rotation.z += deltaTime;
                    }
                    if (this.tvArray[i][j].position.z <= 0) {
                        this.tvArray[i][j].position.z = 0;
                    } else {
                        this.tvArray[i][j].position.z -= deltaTime*30.0;
                    }
                }
            }
        }
    }
};

ControllerTV.prototype.mainGamePosition = function(deltaTime) {
    var lengthX = (this.numTVperLine - 1) * (this.distanceBetweenTVX);
    var lengthY = (this.numTVperLine - 1) * (this.distanceBetweenTVY);
    for (var i = 0; i < this.numLineTV; i++) {
        for (var j = 0; j < this.numTVperLine; j++) {
            if ( i == 0 ) {
                if (this.tvArray[i][j].position.y <= (lengthY / 2) - this.distanceBetweenTVY * i - 1.0) {
                    this.tvArray[i][j].position.y = (lengthY / 2) - this.distanceBetweenTVY * i - 1.0;
                } else {
                    this.tvArray[i][j].position.y -= deltaTime*10.0;
                }
                if (this.tvArray[i][j].rotation.x >= 0.35) {
                    this.tvArray[i][j].rotation.x = 0.35;
                } else {
                    this.tvArray[i][j].rotation.x += deltaTime;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y >= 0.35) {
                        this.tvArray[i][j].rotation.y = 0.35;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z <= -0.15) {
                        this.tvArray[i][j].rotation.z = -0.15;
                    } else {
                        this.tvArray[i][j].rotation.z -= deltaTime;
                    }
                    if (this.tvArray[i][j].position.x >= (0 - lengthX / 2) + this.distanceBetweenTVX * j) {
                        this.tvArray[i][j].position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                    } else {
                        this.tvArray[i][j].position.x += deltaTime*7.5;
                    }
                    if (this.tvArray[i][j].position.z >= 14) {
                        this.tvArray[i][j].position.z = 14;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                } else if ( j == 1) {
                    if (this.tvArray[i][j].position.z >= 8) {
                        this.tvArray[i][j].position.z = 8;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime * 30.0;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y <= -0.35) {
                        this.tvArray[i][j].rotation.y = -0.35;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z >= 0.15) {
                        this.tvArray[i][j].rotation.z = 0.15;
                    } else {
                        this.tvArray[i][j].rotation.z += deltaTime;
                    }
                    if (this.tvArray[i][j].position.x <= (0 - lengthX / 2) + this.distanceBetweenTVX * j) {
                        this.tvArray[i][j].position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                    } else {
                        this.tvArray[i][j].position.x -= deltaTime*7.5;
                    }
                    if (this.tvArray[i][j].position.z >= 14) {
                        this.tvArray[i][j].position.z = 14;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                }
            } else if ( i == 1 ) {
                if (this.tvArray[i][j].position.y <= (lengthY / 2) - this.distanceBetweenTVY * i) {
                    this.tvArray[i][j].position.y = (lengthY / 2) - this.distanceBetweenTVY * i;
                } else {
                    this.tvArray[i][j].position.y -= deltaTime*10.0;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y >= 0.35) {
                        this.tvArray[i][j].rotation.y = 0.35;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].position.z >= 6) {
                        this.tvArray[i][j].position.z = 6;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y <= -0.35) {
                        this.tvArray[i][j].rotation.y = -0.35;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].position.z >= 6) {
                        this.tvArray[i][j].position.z = 6;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                }
            } else if ( i == 2 ) {
                if (this.tvArray[i][j].position.y <= (lengthY / 2) - this.distanceBetweenTVY * i) {
                    this.tvArray[i][j].position.y = (lengthY / 2) - this.distanceBetweenTVY * i;
                } else {
                    this.tvArray[i][j].position.y -= deltaTime*10.0;
                }
                if (this.tvArray[i][j].rotation.x <= -0.35) {
                    this.tvArray[i][j].rotation.x = -0.35;
                } else {
                    this.tvArray[i][j].rotation.x -= deltaTime;
                }
                if ( j == 0 ) {
                    if (this.tvArray[i][j].rotation.y >= 0.35) {
                        this.tvArray[i][j].rotation.y = 0.35;
                    } else {
                        this.tvArray[i][j].rotation.y += deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z >= 0.15) {
                        this.tvArray[i][j].rotation.z = 0.15;
                    } else {
                        this.tvArray[i][j].rotation.z += deltaTime;
                    }
                    if (this.tvArray[i][j].position.z >= 8) {
                        this.tvArray[i][j].position.z = 8;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                } else if ( j == 1) {
                    if (this.tvArray[i][j].position.z >= 2) {
                        this.tvArray[i][j].position.z = 2;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*20.0;
                    }
                } else if ( j == 2) {
                    if (this.tvArray[i][j].rotation.y <= -0.35) {
                        this.tvArray[i][j].rotation.y = -0.35;
                    } else {
                        this.tvArray[i][j].rotation.y -= deltaTime;
                    }
                    if (this.tvArray[i][j].rotation.z <= -0.15) {
                        this.tvArray[i][j].rotation.z = -0.15;
                    } else {
                        this.tvArray[i][j].rotation.z -= deltaTime;
                    }
                    if (this.tvArray[i][j].position.z >= 8) {
                        this.tvArray[i][j].position.z = 8;
                    } else {
                        this.tvArray[i][j].position.z += deltaTime*40.0;
                    }
                }
            }
        }
    }
};

ControllerTV.prototype.setBeginSettings = function() {
    this.boolStart = true;
  //  this.boolStop = false;
    this.boolMoveFront = false;
  //  this.boolMoveBack = false;
    this.boolEndAnimation = false;
    this.boolStartTimer = true;
    this.animationEnded = false;
    this.switchNumFreeSpinMinus = false;
    this.switchNumFreeSpinPlus = false;
    this.switchNumFreeSpinBeforePlus = false;
    this.boolUpdateParticles = false;
    this.resolutionStart = true;
 //   this.boolForceStop = false;
  //  this.boolShowLine = false;
    this.k = 0;
    this.f = 0;
    this.g = 0;
    this.dt = 0;
  //  this.dt1 = 0;

 /*   for (var i = 0; i < this.numTVperLine; i++) {
        this.children[i].setBeginSettings();
    }
    for (var i = 0; i < this.numTVperLine; i++) {
        this.children[i].setBoolAnimateRotation(true);
    }*/
   /* for (var i = 0; i < this.numLineTV; i++) {
            this.particlesArray[i].position.copy(this.tvArray[i][j].position);
            this.particlesArray[i].position.y -= 7;
            this.particlesArray[i].position.z += 30;
    }*/
    for (var i = 0; i < this.numLineTV; i++) {
        this.particlesArray[i].scaled = false;
        this.particlesArray[i].switchOff();
    }
};

ControllerTV.prototype.start = function() {
    if (sound) {
       // sound.stopAll();
        sound.playButtonStart();
    }
  //  this.boolRotate = true;
    this.boolChangeStopToStart = false;
    this.arrayStop = [];
    this.genArraySymb.setTotalRound(0);
    this.arrayStop = this.genArraySymb.generate();
    this.moveArray = this.genArraySymb.getMoveArray();
    this.moveArrayFreeSpinSymb = this.genArraySymb.getMoveArrayFreeSpinSymb();
    this.totalSum = this.genArraySymb.getTotalRound();

    console.log("this.totalSum", this.totalSum);
    if (this.arrayStop.length != 0) {
        console.log("Stop array (start)", this.arrayStop);
        this.setBeginSettings();
    } else {
        this.boolUpdateArraySymb = true;
    }
};

ControllerTV.prototype.stop = function() {
    if (sound) {
        sound.stopButtonStart();
    }
    if (this.arrayStop.length != 0 && this.canStop) {
        this.canStop = false;
     //   this.boolRotate = false;
        this.boolForceStop = true;
        this.boolMoveFront = false;
        this.boolEndAnimation = false;
        this.boolStartTimer = false;
        this.dt = 0;
        this.dt1 = 0;
    }
};

ControllerTV.prototype.getBoolEndAnimation = function() {
    return this.boolEndAnimation;
};

/*
ControllerTV.prototype.getBoolStart = function() {
    return this.boolStart;
};

ControllerTV.prototype.moveFront = function(i, k) {

    this.children[i].setArrayMove(this.moveArray[k]);
    this.children[i].setBoolAnimateMoveFront(true);


    if (this.children[this.numTVperLine - 1].getBoolAnimateMoveFront()) {
        this.boolMoveFront = false;
        this.boolMoveBack = true;
    }
    this.dt1 = 0;
};

ControllerTV.prototype.getInfoWinLine = function() {
    var infoWinLine = {
        numline: this.k,
        arrayNumSymbLine: this.genArraySymb.getNumSymbline()
    };
    return infoWinLine;
};

ControllerTV.prototype.getBoolShowLine = function() {
    return this.boolShowLine;
};
*/
ControllerTV.prototype.getTotalSum = function() {
    return this.totalSum;
};

ControllerTV.prototype.getTotalScore = function() {
    return this.genArraySymb.getTotalScore();
};

ControllerTV.prototype.setTotalScore = function(num) {
    this.genArraySymb.setTotalScore(num);
};

ControllerTV.prototype.addAnimation = function() {

    for (var i = 0; i < this.numTotalTV; i++) {
       if (this.children[i].name == "tv") {
            this.children[i].addAnimation();
       }
    }
};

ControllerTV.prototype.startAnimation = function () {
   /* for (var i = 0; i < this.numTotalTV; i++) {
        if ( i > 2 && i < 6 ) {
            this.children[i].startAnimation();
        }
    }*/
 //   this.start();
//console.log(this.moveArray);
    for (var i = 0; i < this.numLineTV; i++) {
        for (var j = 0; j < this.numTVperLine; j++) {
          //  if ( this.moveArray[0][j][i] == 1 ) {
                this.tvArray[j][i].startAnimation();
          //  }
        }
    }
};

ControllerTV.prototype.stopAnimation = function () {

    for (var i = 0; i < this.numTotalTV; i++) {
        if (this.children[i].name == "tv") {
            this.children[i].stopAnimation();
        }
    }
};

ControllerTV.prototype.pausedAnimation = function () {
    for (var i = 0; i < this.numTotalTV; i++) {
        if (this.children[i].name == "tv") {
            this.children[i].pausedAnimation();
        }
    }
};

ControllerTV.prototype.pausedToTimeAnimation = function () {
    for (var i = 0; i < this.numTotalTV; i++) {
        if (this.children[i].name == "tv") {
            this.children[i].pausedToTimeAnimation();
        }
    }
};

ControllerTV.prototype.setBet = function (num) {
    this.genArraySymb.setBet(num);
};

ControllerTV.prototype.getBet = function () {
    return this.genArraySymb.getBet();
};

ControllerTV.prototype.stopStartRotateSymb = function () {

    if ( this.boolRotate ) {
        this.stop();
    } else {
        if ( this.boolEndAnimation ) {
            for (var i = 0; i < this.numLineTV; i++) {
                for (var j = 0; j < this.numTVperLine; j++) {
                    this.tvArray[j][i].stopAnimation();
                    this.tvArray[i][j].startRotateSymb();
                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                 //   var holoSymb = this.tvArray[j][i].getFreeSpinSymb();
                 //   holoSymb.scale.set(1.0, 1.0, 1.0);
                    this.tvArray[j][i].materialDisplay.needsUpdate = true;
                }
            }
            this.start();
            this.boolRotate = true;
            this.canStop = true;

            var totalScore = this.getTotalScore();
            totalScore -= this.genArraySymb.getBet();
            this.setTotalScore(totalScore);

            this.autoPlayStart = true;
            this.autoPlayStop = false;

            if (this.genArraySymb.boolPlusFreeSpin) {
                this.resolutionStart = false;
            }
        }
    }
};

ControllerTV.prototype.stopStartRotateSymbFreeSpin = function () {

    if ( this.boolRotate ) {
        this.stop();
    } else {
        if (this.resolutionStart) {
            if (this.boolEndAnimation) {
                for (var i = 0; i < this.numLineTV; i++) {
                    for (var j = 0; j < this.numTVperLine; j++) {
                        this.tvArray[j][i].stopAnimation();
                        this.tvArray[i][j].startRotateSymb();
                        this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                        //   var holoSymb = this.tvArray[j][i].getFreeSpinSymb();
                        //    holoSymb.scale.set(1.0, 1.0, 1.0);
                        //     holoSymb.visible = true;
                        this.tvArray[j][i].materialDisplay.needsUpdate = true;
                    }
                }
                this.start();
                this.boolRotate = true;
                this.canStop = true;

                this.autoPlayStart = true;
                this.autoPlayStop = false;

                if (this.genArraySymb.numFreeSpin <= 0) {
                    this.genArraySymb.boolFreeSpin = false;
                    this.boolFreeSpin = false;
                    this.genArraySymb.numFreeSpin = 0;
                } else {
                    this.genArraySymb.numFreeSpin -= 1;
                    if (!this.genArraySymb.boolPlusFreeSpin) {
                        this.switchNumFreeSpinMinus = true;
                    } else {
                        this.switchNumFreeSpinBeforePlus = true;
                        this.resolutionStart = false;
                    }
                }
            }
        }
    }
};

ControllerTV.prototype.mainGame = function (deltaTime) {
    if (this.autoPlay) {
        //force stop autoPlay
        if (this.boolForceStop) {
            this.boolStop = false;
            this.boolStartTimer = false;
            this.dt = 0;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped) {
                this.g++;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    if (this.getTotalSum() > 0) {
                        var totalRound = this.getTotalSum();
                        var totalScore = this.getTotalScore();
                        totalScore += totalRound;
                        this.setTotalScore(totalScore);
                    }
                    this.autoPlayStart = false;
                    this.autoPlayStop = true;
                    /* if (this.genArraySymb.boolFreeSpin) {
                         this.autoPlay = false;
                     }*/
                }
            }
        }

        //stop autoPlay
        if (this.boolStop) {
            this.dt1 += deltaTime;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped && this.dt1 >= 0.35) {
                this.g++;
                this.dt1 = 0;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolStop = false;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.boolStartTimer = false;
                    this.dt = 0;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    if (this.getTotalSum() > 0) {
                        var totalRound = this.getTotalSum();
                        var totalScore = this.getTotalScore();
                        totalScore += totalRound;
                        this.setTotalScore(totalScore);
                    }
                    this.autoPlayStart = false;
                    this.autoPlayStop = true;
                    /* if (this.genArraySymb.boolFreeSpin) {
                         this.autoPlay = false;
                     }*/
                }
            }
        }
        if (!this.animationEnded) {
            if (this.boolEndAnimation && this.arrayStop.length != 0) {
                var winL = this.genArraySymb.getWinlineRound();
                if (winL[this.k] == 0) {
                    this.k++;
                    if (this.k > this.moveArray.length - 1) {
                        this.k = 0;
                        if (this.genArraySymb.boolFreeSpin) {
                            this.autoPlay = false;
                            this.boolFreeSpin = true;
                            this.animationEnded = true;
                        } else {
                            this.stopStartRotateSymb();
                        }
                    }
                } else {
                    if (this.boolMoveFront) {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {
                                if (this.moveArray[this.k][i][j] == 1) {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                                    this.tvArray[j][i].symbsParent.visible = true;
                                    this.tvArray[j][i].startAnimation();
                                    this.boolMoveFront = false;
                                } else {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                }
                            }
                        }

                    } else /*if (this.boolMoveBack)*/ {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {

                                if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 2) {
                                    this.tvArray[j][i].stopAnimation();
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                    this.tvArray[j][i].symbsParent.visible = false;
                                    this.boolMoveFront = true;
                                }

                                if (this.moveArray[this.k][i][j] == 1) {
                                    if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 0) {
                                        this.switchK = true;
                                    }
                                }
                            }
                        }
                    }


                    if (this.switchK) {
                        this.k++;
                        if (this.k > this.moveArray.length - 1) {
                            this.k = 0;
                            if (this.genArraySymb.boolFreeSpin) {
                                this.autoPlay = false;
                                this.boolFreeSpin = true;
                                this.animationEnded = true;
                            } else {
                                this.stopStartRotateSymb();
                            }
                        }
                        this.switchK = false;
                    }
                }
            }
        }  else {
            this.animationFreeSpinSymb(deltaTime);
        }
    } else {
        //force stop
        if (this.boolForceStop) {
            this.boolStop = false;
            this.boolStartTimer = false;
            this.dt = 0;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped) {
                this.g++;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    if (this.getTotalSum() > 0) {
                        var totalRound = this.getTotalSum();
                        var totalScore = this.getTotalScore();
                        totalScore += totalRound;
                        this.setTotalScore(totalScore);
                    }
                }
            }
        }

        //normal stop
        if (this.boolStop) {
            this.dt1 += deltaTime;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped && this.dt1 >= 0.35) {
                this.g++;
                this.dt1 = 0;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolStop = false;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.boolStartTimer = false;
                    this.dt = 0;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    if (this.getTotalSum() > 0) {
                        var totalRound = this.getTotalSum();
                        var totalScore = this.getTotalScore();
                        totalScore += totalRound;
                        this.setTotalScore(totalScore);
                    }
                }
            }
        }
        if (!this.animationEnded) {
            if (this.boolEndAnimation && this.arrayStop.length != 0) {
                var winL = this.genArraySymb.getWinlineRound();
                if (winL[this.k] == 0) {
                    this.k++;
                    if (this.k > this.moveArray.length - 1) {
                        this.k = 0;
                        if (this.genArraySymb.boolFreeSpin) {
                            this.boolFreeSpin = true;
                            this.animationEnded = true;
                        }
                    }
                } else {

                    if (this.boolMoveFront) {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {
                                if (this.moveArray[this.k][i][j] == 1) {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                                    this.tvArray[j][i].symbsParent.visible = true;
                                    this.tvArray[j][i].startAnimation();
                                    this.boolMoveFront = false;
                                } else {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                }
                            }
                        }

                    } else /*if (this.boolMoveBack)*/ {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {

                                if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 2) {
                                    this.tvArray[j][i].stopAnimation();
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                    this.tvArray[j][i].symbsParent.visible = false;
                                    this.boolMoveFront = true;
                                }

                                if (this.moveArray[this.k][i][j] == 1) {
                                    if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 0) {
                                        this.switchK = true;
                                    }
                                }
                            }
                        }
                    }

                    if (this.switchK) {
                        this.k++;
                        if (this.k > this.moveArray.length - 1) {
                            this.k = 0;
                            if (this.genArraySymb.boolFreeSpin) {
                                this.boolFreeSpin = true;
                                this.animationEnded = true;
                            }
                        }
                        this.switchK = false;
                    }
                }
            }
        } else {
            this.animationFreeSpinSymb(deltaTime);
        }
    }
};

ControllerTV.prototype.freeSpinGame = function (deltaTime) {
    if (this.autoPlay) {
        //force stop autoPlay
        if (this.boolForceStop) {
            this.boolStop = false;
            this.boolStartTimer = false;
            this.dt = 0;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped) {
                this.g++;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    //     if (this.getTotalSum() > 0) {
                    var totalRound = this.getTotalSum();
                    this.totalRoundFreeSpin += totalRound;
                    //      }
                    this.autoPlayStart = false;
                    this.autoPlayStop = true;
                }
            }
        }

        //stop autoPlay
        if (this.boolStop) {
            this.dt1 += deltaTime;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped && this.dt1 >= 0.35) {
                this.g++;
                this.dt1 = 0;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolStop = false;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.boolStartTimer = false;
                    this.dt = 0;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    //     if (this.getTotalSum() > 0) {
                    var totalRound = this.getTotalSum();
                    this.totalRoundFreeSpin += totalRound;
                    //       }
                    this.autoPlayStart = false;
                    this.autoPlayStop = true;
                }
            }
        }
        if (!this.animationEnded) {
            if (this.boolEndAnimation && this.arrayStop.length != 0) {
                var winL = this.genArraySymb.getWinlineRound();
                if (winL[this.k] == 0) {
                    this.k++;
                    if (this.k > this.moveArray.length - 1) {
                        this.k = 0;
                        if (this.genArraySymb.numFreeSpin <= 0) {
                            this.genArraySymb.boolFreeSpin = false;
                            this.boolFreeSpin = false;
                            this.genArraySymb.numFreeSpin = 0;
                            this.autoPlay = false;
                            this.animationEnded = true;
                            var totalScore = this.getTotalScore();
                            totalScore += this.totalRoundFreeSpin;
                            this.setTotalScore(totalScore);
                            this.totalRoundFreeSpin = 0;
                        } else {
                            if (this.genArraySymb.boolPlusFreeSpin) {
                                this.animationEnded = true;
                            } else {
                                this.stopStartRotateSymbFreeSpin();
                            }
                        }
                    }
                } else {
                    if (this.boolMoveFront) {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {
                                if (this.moveArray[this.k][i][j] == 1) {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                                    this.tvArray[j][i].symbsParent.visible = true;
                                    this.tvArray[j][i].startAnimation();
                                    this.boolMoveFront = false;
                                } else {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                }
                            }
                        }

                    } else /*if (this.boolMoveBack)*/ {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {

                                if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 2) {
                                    this.tvArray[j][i].stopAnimation();
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                    this.tvArray[j][i].symbsParent.visible = false;
                                    this.boolMoveFront = true;
                                }

                                if (this.moveArray[this.k][i][j] == 1) {
                                    if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 0) {
                                        this.switchK = true;
                                    }
                                }
                            }
                        }
                    }

                    if (this.switchK) {
                        this.k++;
                        if (this.k > this.moveArray.length - 1) {
                            this.k = 0;
                            if (this.genArraySymb.numFreeSpin <= 0) {
                                this.genArraySymb.boolFreeSpin = false;
                                this.boolFreeSpin = false;
                                this.genArraySymb.numFreeSpin = 0;
                                this.autoPlay = false;
                                this.animationEnded = true;
                                var totalScore = this.getTotalScore();
                                totalScore += this.totalRoundFreeSpin;
                                this.setTotalScore(totalScore);
                                this.totalRoundFreeSpin = 0;
                            } else {
                                if (this.genArraySymb.boolPlusFreeSpin) {
                                    this.animationEnded = true;
                                } else {
                                    this.stopStartRotateSymbFreeSpin();
                                }
                            }
                        }
                        this.switchK = false;
                    }
                }
            }
        } else {
            this.animationFreeSpinSymb(deltaTime);
        }
    } else {
        //force stop
        if (this.boolForceStop) {
            this.boolStop = false;
            this.boolStartTimer = false;
            this.dt = 0;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped) {
                this.g++;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    //   if (this.getTotalSum() > 0) {
                    var totalRound = this.getTotalSum();
                    this.totalRoundFreeSpin += totalRound;
                    //    }
                }
            }
        }

        //normal stop
        if (this.boolStop) {
            this.dt1 += deltaTime;
            if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
            }
            if (this.tvArray[this.f][this.g].isStopped && this.dt1 >= 0.35) {
                this.g++;
                this.dt1 = 0;
            }
            if (this.g > 2) {
                this.g = 0;
                this.f++;
            }
            if (this.f > 2) {
                this.f = 0;
            }
            if (this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped) {
                if (sound) {
                    sound.stopButtonStart();
                }
                this.dt2 += deltaTime;
                if (this.dt2 > this.speedSwitchBetweenRounds) {
                    this.dt2 = 0;
                    this.boolStop = false;
                    this.boolForceStop = false;
                    this.boolRotate = false;
                    this.boolStartTimer = false;
                    this.dt = 0;
                    this.f = 0;
                    this.g = 0;
                    this.boolEndAnimation = true;
                    this.boolMoveFront = true;
                    // this.canStop = true;
                    this.boolChangeStopToStart = true;
                    //    if (this.getTotalSum() > 0) {
                    var totalRound = this.getTotalSum();
                    this.totalRoundFreeSpin += totalRound;

                    //   }
                }
            }
        }
        if (!this.animationEnded) {
            if (this.boolEndAnimation && this.arrayStop.length != 0) {
                var winL = this.genArraySymb.getWinlineRound();
                if (winL[this.k] == 0) {
                    this.k++;
                    if (this.k > this.moveArray.length - 1) {
                        this.k = 0;
                        if (this.genArraySymb.numFreeSpin <= 0) {
                            this.genArraySymb.boolFreeSpin = false;
                            this.boolFreeSpin = false;
                            this.genArraySymb.numFreeSpin = 0;
                            var totalScore = this.getTotalScore();
                            totalScore += this.totalRoundFreeSpin;
                            this.setTotalScore(totalScore);
                            this.totalRoundFreeSpin = 0;
                        } else {
                         //   if (this.genArraySymb.boolFreeSpin) {
                                this.animationEnded = true;
                      //      }
                        }
                    }
                } else {

                    if (this.boolMoveFront) {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {
                                if (this.moveArray[this.k][i][j] == 1) {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                                    this.tvArray[j][i].symbsParent.visible = true;
                                    this.tvArray[j][i].startAnimation();
                                    this.boolMoveFront = false;
                                } else {
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                }
                            }
                        }

                    } else /*if (this.boolMoveBack)*/ {
                        for (var i = 0; i < this.tvArray.length; i++) {
                            for (var j = 0; j < this.tvArray[0].length; j++) {

                                if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 2) {
                                    this.tvArray[j][i].stopAnimation();
                                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                                    this.tvArray[j][i].symbsParent.visible = false;
                                    this.boolMoveFront = true;
                                }

                                if (this.moveArray[this.k][i][j] == 1) {
                                    if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 0) {
                                        this.switchK = true;
                                    }
                                }
                            }
                        }
                    }

                    if (this.switchK) {
                        this.k++;
                        if (this.k > this.moveArray.length - 1) {
                            this.k = 0;
                            if (this.genArraySymb.numFreeSpin <= 0) {
                                this.genArraySymb.boolFreeSpin = false;
                                this.boolFreeSpin = false;
                                this.genArraySymb.numFreeSpin = 0;
                              //  this.animationEnded = true;
                                var totalScore = this.getTotalScore();
                                totalScore += this.totalRoundFreeSpin;
                                this.setTotalScore(totalScore);
                                this.totalRoundFreeSpin = 0;
                            } else {
                              //  if (this.genArraySymb.boolFreeSpin) {
                                    this.animationEnded = true;
                              //  }
                            }
                        }
                        this.switchK = false;
                    }
                }
            }
        } else {
            this.animationFreeSpinSymb(deltaTime);
        }
    }
};

ControllerTV.prototype.animationFreeSpinSymb = function (deltaTime) {
    if (this.boolMoveFront) {
        if (this.genArraySymb.boolPlusFreeSpin) {
            if (sound) {
                sound.playFreespin();
            }
        }
        for (var i = 0; i < this.tvArray.length; i++) {
            for (var j = 0; j < this.tvArray[0].length; j++) {
                if (this.moveArrayFreeSpinSymb[i][j] == 1) {
                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                    this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                    this.tvArray[j][i].symbsParent.visible = true;
                    this.tvArray[j][i].startAnimation();
                    this.boolMoveFront = false;
                    this.particlesArray[i].position.x = this.tvArray[j][i].position.x;
                    this.particlesArray[i].position.y = this.tvArray[j][i].position.y - 7;
                    this.particlesArray[i].position.z = this.tvArray[j][i].position.z + 30;
                    var vec3 = this.setMotionVector(this.particlesArray[i].position, this.endPosition);
                    this.particlesArray[i].setWindVector(vec3);
                    this.particlesArray[i].children[1].position.x = +vec3.x*4.5;
                    this.particlesArray[i].children[1].position.y = +vec3.y*4.5;
                    this.particlesArray[i].children[1].position.z = +vec3.z*4.5;

                    this.particlesArray[i].children[0].position.x = +vec3.x*4.5;
                    this.particlesArray[i].children[0].position.y = +vec3.y*4.5;
                    this.particlesArray[i].children[0].position.z = +vec3.z*4.5;
                } else {
                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                }
            }
        }
    } else {
        for (var i = 0; i < this.tvArray.length; i++) {
            for (var j = 0; j < this.tvArray[0].length; j++) {
                if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time >= 1.25) {
                        if (!this.particlesArray[i].scaled) {
                            this.particlesArray[i].scaled = true;
                       //     this.particlesArray[i].position.x = this.tvArray[j][i].position.x;
                       //     this.particlesArray[i].position.y = this.tvArray[j][i].position.y - 7;
                       //     this.particlesArray[i].position.z = this.tvArray[j][i].position.z + 30;

                            this.particlesArray[i].start();
                            if (sound) {
                                sound.playPlazma();
                            }
                            this.boolUpdateParticles = true;
                            this.tvArray[j][i].symbsParent.visible = false;
                        }
                        if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time >= 2.0) {
                            this.tvArray[j][i].stopAnimation();
                            this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                            this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                            this.tvArray[j][i].symbsParent.visible = false;
                        }

                    if (this.autoPlay && !this.boolUpdateParticles) {
                        this.stopStartRotateSymbFreeSpin();
                        this.animationEnded = false;
                    } else {
                        this.boolMoveFront = false;
                    }
                }
            }
        }
    }
};

ControllerTV.prototype.updateWithTime = function(deltaTimeElapsed, deltaTime) {
    //update request arrayStop
    if (this.boolUpdateArraySymb) {
        this.arrayStop = [];
        this.genArraySymb.setTotalRound(0);
        this.arrayStop = this.genArraySymb.generate();
        this.moveArray = this.genArraySymb.getMoveArray();
        this.moveArrayFreeSpinSymb = this.genArraySymb.getMoveArrayFreeSpinSymb();
        this.totalSum = this.genArraySymb.getTotalRound();

        if (this.arrayStop.length != 0) {
            this.boolUpdateArraySymb = false;
            this.setBeginSettings();
            console.log("Stop array (updateWithTime)", this.arrayStop);
        }
    }

    //start timer for stop
    if (this.boolStartTimer) {
        this.dt += deltaTime;
    }
    if (this.dt >= this.speedSwitchStop) {
        this.boolStop = true;
      //  this.boolForceStop = false;
      //  this.canStop = false;
    }

    if (!this.boolFreeSpin) {
        this.mainGame(deltaTime);
    } else {
        this.freeSpinGame(deltaTime);
    }

    if (this.boolMoveFreeSpin) {
        this.freeSpinGamePosition(deltaTime);
    }

    if (this.boolMoveBackFreeSpin) {
        this.mainGamePosition(deltaTime);
    }

    //update with time
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name == "tv") {
            this.children[i].updateWithTime(deltaTimeElapsed, deltaTime);
        } else if (this.children[i].name == "fire") {
                this.children[i].updateWithTime(deltaTimeElapsed, deltaTimeElapsed);
        }
    }

    if (this.boolUpdateParticles) {
        var numParticlesVisible = 0;
        for (var i = 0; i < this.numLineTV; i++) {
            if (this.particlesArray[i].scaled) {

                var d = this.setMotionVector(this.particlesArray[i].position, this.endPosition);
                if (Math.sqrt(this.particlesArray[i].position.x * this.particlesArray[i].position.x +
                              this.particlesArray[i].position.y * this.particlesArray[i].position.y +
                              this.particlesArray[i].position.z * this.particlesArray[i].position.z) >=
                                    Math.sqrt(this.endPosition.x * this.endPosition.x +
                                              this.endPosition.y * this.endPosition.y +
                                              this.endPosition.z * this.endPosition.z)) {
                    this.particlesArray[i].stop();
                    if (sound) {
                        sound.playExplode();
                    }
                   // console.log("!!!!!!", this.particlesArray[i].position );
                    this.switchNumFreeSpinPlus = true;
                    this.resolutionStart = true;
                    // this.particlesArray[i].scaled = false;
                } else {
                    this.particlesArray[i].position.x -= d.x * 200.0 * deltaTime;
                    this.particlesArray[i].position.y -= d.y * 200.0 * deltaTime;
                    this.particlesArray[i].position.z -= d.z * 200.0 * deltaTime;
                }
            }
            if (!this.particlesArray[i].children[2].visible) {
                numParticlesVisible++;
            }
            if (numParticlesVisible >= 3) {
                this.boolUpdateParticles = false;
            }
        }
    }
};