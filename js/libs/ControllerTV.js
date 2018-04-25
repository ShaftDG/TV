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

    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;

    this.totalSum = 0;

    this.speedSwitchStop = 1.0;
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
    this.boolStart = false;
    this.boolMoveFront = false;
    this.boolMoveBack = false;
    this.boolEndAnimation = true;
    this.boolStartTimer = false;
    this.boolForceStop = false;
    this.boolShowLine = false;
    this.isStopped = true;

    this.switchK = false;

    this.boolOne = false;

    this.distanceBetweenTVX = 33;
    this.distanceBetweenTVY = 28;

  /*  var length = this.numTVperLine * (this.widthTV + this.distanceBetweenTV) - this.distanceBetweenTV;
    for (var i = 0; i < this.numTVperLine; i++) {
        var cylinder = new CylinderSlot(this.radiusCylinder, this.widthTV, this.numSymbPerCylinder, shaders, this.textureLoader, isMobile);
        cylinder.position.x =(0 - length / 2) + this.widthTV/2 + this.widthTV * i + this.distanceBetweenTV * i;
        this.add(cylinder);
    }*/

    this.tvArray = new Array(this.numLineTV);
    for (var j = 0; j < this.numTVperLine; j++ ) {
        this.tvArray[j]=[];
    }

    var lengthX = (this.numTVperLine - 1) * (this.distanceBetweenTVX);
    var lengthY = (this.numTVperLine - 1) * (this.distanceBetweenTVY);
    for (var i = 0; i < this.numLineTV; i++) {
        for (var j = 0; j < this.numTVperLine; j++) {
            if ( i == 0 ) {
                var tv = new TV(textureLoader, "up", isMobile);
                tv.position.y = (lengthY / 2) - this.distanceBetweenTVY * i;
                tv.position.x = (0 - lengthX / 2) + this.distanceBetweenTVX * j;
                tv.position.z += 6;
                tv.rotation.x = 0.35;

                if ( j == 0 ) {
                    tv.rotation.y = 0.35;
                    tv.rotation.z = -0.15;
                    tv.position.x -= 2.5;
                    tv.position.z += 6;
                } else if ( j == 2) {
                    tv.rotation.y = -0.35;
                    tv.rotation.z = 0.15;
                    tv.position.x += 2.5;
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
            this.tvArray[i][j] = tv;
        }
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

ControllerTV.prototype.setBeginSettings = function() {
    this.boolStart = true;
  //  this.boolStop = false;
    this.boolMoveFront = false;
    this.boolMoveBack = false;
    this.boolEndAnimation = false;
    this.boolStartTimer = true;
 //   this.boolForceStop = false;
    this.boolShowLine = false;
    this.k = 0;
    this.f = 0;
    this.g = 0;
    this.dt = 0;
    this.dt1 = 0;
    this.dt2 = 0;
 /*   for (var i = 0; i < this.numTVperLine; i++) {
        this.children[i].setBeginSettings();
    }
    for (var i = 0; i < this.numTVperLine; i++) {
        this.children[i].setBoolAnimateRotation(true);
    }*/
};

ControllerTV.prototype.start = function() {
  //  this.boolRotate = true;
    this.arrayStop = [];
    this.genArraySymb.setTotalScore(0);
    this.arrayStop = this.genArraySymb.generate();
    this.moveArray = this.genArraySymb.getMoveArray();
    this.totalSum = this.genArraySymb.getTotalScore();

    console.log("this.totalSum", this.totalSum);
    if (this.arrayStop.length != 0) {
        console.log("Stop array (start)", this.arrayStop);
        this.setBeginSettings();
    } else {
        this.boolUpdateArraySymb = true;
    }
};

ControllerTV.prototype.stop = function() {
    if (this.arrayStop.length != 0 && this.isStopped) {
        console.log("fggggg");
        this.isStopped = false;
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

ControllerTV.prototype.addAnimation = function() {


    for (var i = 0; i < this.numTotalTV; i++) {
        this.children[i].addAnimation();
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
        this.children[i].stopAnimation();
    }
};

ControllerTV.prototype.pausedAnimation = function () {
    for (var i = 0; i < this.numTotalTV; i++) {
        this.children[i].pausedAnimation();
    }
};

ControllerTV.prototype.pausedToTimeAnimation = function () {
    for (var i = 0; i < this.numTotalTV; i++) {
        this.children[i].pausedToTimeAnimation();
    }
};

ControllerTV.prototype.stopStartRotateSymb = function () {
    console.log(this.boolRotate);
    if ( this.boolRotate ) {
        this.stop();
    } else {
        if ( this.boolEndAnimation ) {
            for (var i = 0; i < this.numLineTV; i++) {
                for (var j = 0; j < this.numTVperLine; j++) {
                    this.tvArray[j][i].stopAnimation();
                    this.tvArray[i][j].startRotateSymb();
                    //this.tvArray[j][i].materialDisplay.defines.USE_HOLO = false;
                    this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                    this.tvArray[j][i].materialDisplay.needsUpdate = true;
                }
            }
            this.start();
            this.boolRotate = true;
            this.isStopped = true;
        }
    }
};

ControllerTV.prototype.updateWithTime = function(deltaTimeElapsed, deltaTime) {
    //update request arrayStop
    if (this.boolUpdateArraySymb) {
        this.arrayStop = [];
        this.genArraySymb.setTotalScore(0);
        this.arrayStop = this.genArraySymb.generate();
        this.moveArray = this.genArraySymb.getMoveArray();
        this.totalSum = this.genArraySymb.getTotalScore();

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
      //  this.isStopped = false;
    }

    //force stop
    if (this.boolForceStop) {
        this.boolStop = false;
        this.boolStartTimer = false;
        this.dt = 0;
        if (!this.tvArray[this.f][this.g].isStopped) {
            this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
        }
        if ( this.tvArray[this.f][this.g].isStopped ) {
            this.g ++;
        }
        if ( this.g > 2) {
            this.g = 0;
            this.f ++;
        }
        if ( this.f > 2) {
            this.f = 0;
        }
        if ( this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped ) {
            this.boolForceStop = false;
            this.boolRotate = false;
            this.f = 0;
            this.g = 0;
            this.boolEndAnimation = true;
            this.boolMoveFront = true;
           // this.isStopped = true;
        }
    }

    //normal stop
    if (this.boolStop) {
        this.dt1 += deltaTime;
        if (!this.tvArray[this.f][this.g].isStopped) {
                this.tvArray[this.f][this.g].stopRotateSymb(this.arrayStop[this.g][this.f]);
        }
        if ( this.tvArray[this.f][this.g].isStopped && this.dt1 >= 0.35) {
            this.g++;
            this.dt1 = 0;
        }
        if ( this.g > 2) {
            this.g = 0;
            this.f ++;
        }
        if ( this.f > 2) {
            this.f = 0;
        }
        if ( this.tvArray[this.tvArray[0].length - 1][this.tvArray.length - 1].isStopped ) {
            this.boolStop = false;
            this.boolForceStop = false;
            this.boolRotate = false;
            this.boolStartTimer = false;
            this.dt = 0;
            this.f = 0;
            this.g = 0;
            this.boolEndAnimation = true;
            this.boolMoveFront = true;
            // this.isStopped = true;
        }
    }

    if ( this.boolEndAnimation && this.arrayStop.length != 0 ) {
        var winL = this.genArraySymb.getWinlineScore();
        if (winL[this.k] == 0) {
            this.k ++;
            if (this.k > this.moveArray.length - 1 ) {
                this.k = 0;
            }
        } else {
          if (this.boolMoveFront) {
              for (var i = 0; i < this.tvArray.length; i++) {
                  for (var j = 0; j < this.tvArray[0].length; j++) {
                      if (this.moveArray[this.k][i][j] == 1) {
                          // this.tvArray[j][i].materialDisplay.defines.USE_GLITCH = false;
                         // this.tvArray[j][i].materialDisplay.defines.USE_OFF = false;
                          //this.tvArray[j][i].materialDisplay.defines.USE_HOLO = true;
                          this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = true;
                          this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = true;
                          //this.tvArray[j][i].materialDisplay.defines.USE_OFF_SYMB = true;
                          //this.tvArray[j][i].materialDisplay.needsUpdate = true;
                          this.tvArray[j][i].symbsParent.visible = true;
                          this.tvArray[j][i].startAnimation();
                          this.boolMoveFront = false;
                          //console.log(this.tvArray[j][i].actionSymbs[this.arrayStop[this.f][j]].time);
                      /*     if ( this.tvArray[j][i].actionSymbs[this.arrayStop[this.f][j]].time >= 1 ) {
                                this.tvArray[j][i].actionSymbs[this.arrayStop[this.f][j]].paused = true;
                           } else {
                                this.tvArray[j][i].actionSymbs[this.arrayStop[this.f][j]].paused = false;
                               // this.boolMoveFront = false;
                           }*/
                      } else {
                          // this.tvArray[j][i].materialDisplay.defines.USE_GLITCH = true;
                        //  this.tvArray[j][i].materialDisplay.defines.USE_OFF = true;
                          //this.tvArray[j][i].materialDisplay.defines.USE_HOLO = false;
                          this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                          //this.tvArray[j][i].materialDisplay.needsUpdate = true;
                      }
                  }
              }

          } else /*if (this.boolMoveBack)*/ {
              for (var i = 0; i < this.tvArray.length; i++) {
                  for (var j = 0; j < this.tvArray[0].length; j++) {

                          if (this.tvArray[j][i].actionSymbs[this.arrayStop[i][j]].time == 2) {
                              this.tvArray[j][i].stopAnimation();
                              //this.tvArray[j][i].materialDisplay.defines.USE_OFF_SYMB = false;
                              //this.tvArray[j][i].materialDisplay.defines.USE_HOLO = false;
                              this.tvArray[j][i].materialDisplay.uniforms.boolOffSymb.value = false;
                              this.tvArray[j][i].materialDisplay.uniforms.boolHolo.value = false;
                             // this.tvArray[j][i].materialDisplay.needsUpdate = true;
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

            if ( this.switchK ) {
                this.k++;
                //console.log(this.k);
                if (this.k > this.moveArray.length - 1) {
                    this.k = 0;
                }
                this.switchK = false;
            }
        }
    }

    //update with time
    for (var i = 0; i < this.numTotalTV; i++) {
        this.children[i].updateWithTime(deltaTimeElapsed, deltaTime);
    }
};