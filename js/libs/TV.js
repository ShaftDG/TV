function TV(textureLoader, align, isMobile)
{
    THREE.Object3D.apply(this);
    this.name = "TV";

    this.mixers = [];

    this.boolRotate = false;
    this.boolRate = false;
    this.resolutionPaused = false;

    this.isStopped = true;

    this.speedFactor = 16.0;
    this.i = 0;
    this.dt = 0.0;
    this.arrayTexturesSymb = [
        textureLoader.load("textures/numbers/symb_1.png"),
        textureLoader.load("textures/numbers/symb_2.png"),
        textureLoader.load("textures/numbers/symb_3.png"),
        textureLoader.load("textures/numbers/symb_4.png"),
        textureLoader.load("textures/numbers/symb_5.png"),
        textureLoader.load("textures/numbers/symb_6.png"),
        textureLoader.load("textures/numbers/symb_7.png"),
        textureLoader.load("textures/numbers/symb_8.png")
    ];

    var arrayLoadFBXSymb = [
        "seven.fbx",
        "diamond.fbx",
        "dice.fbx",
        "bar.fbx",
        "bell.fbx",
        "coin.fbx",
        "horseshoe.fbx",
        "crown.fbx"
    ];
    this.arrayNameSymb = [
        "seven",
        "diamond",
        "dice",
        "bar",
        "bell",
        "coin",
        "horseshoe",
        "crown"
    ];
    this.arraySymbObjects = new Array(8);
    this.mixersSymbs = [];
    for (var i = 0; i < this.arraySymbObjects.length; i++) {
        this.mixersSymbs[i] = [];
    }
    this.actionSymbs = [];
    ///////////////////////////////////////////////////////
    var  vertexShader = shaders.vertexShaders.vertexShHologram;
    var  fragmentShader = shaders.fragmentShaders.fragmentShHologram;
    this.materialHolo =	new THREE.ShaderMaterial({
        defines         : {
            USE_HOLO      : false,
            USE_3D        : false,
            USE_OFF       : false,
            USE_GLITCH    : false,
            USE_SCANLINE  : false
        },
        uniforms: {
            color: { value : new THREE.Color("#00d3ff") },
            f_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            s_texture:   { value: textureLoader.load("textures/noise/wideScreen.png") },
            t_texture:   { value: textureLoader.load("textures/background/display.png") },
            time: { value: 0.0 },
            speedFactor:   { value: 10.0 },

            start:   { value: 0.001 },
            end:   { value: 0.75 },
            alpha:   { value: 1.0 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        //side: THREE.DoubleSide,
        transparent: true,
        // blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );

    this.materialHolo.uniforms.f_texture.value.wrapS = this.materialHolo.uniforms.f_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHolo.uniforms.s_texture.value.wrapS = this.materialHolo.uniforms.s_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHolo.uniforms.t_texture.value.wrapS = this.materialHolo.uniforms.t_texture.value.wrapT = THREE.RepeatWrapping;
    var materialHolo = this.materialHolo;
    var symbsParent = new THREE.Object3D;
 /*   var loaderOBJ = new THREE.OBJLoader( loadingManager );
    loaderOBJ.load("obj/seven.obj" , function (object) {*/
    for (var i = 0; i < arrayLoadFBXSymb.length; i++) {
        var loaderOBJ = new THREE.FBXLoader(loadingManager);
        loaderOBJ.load("obj/" + arrayLoadFBXSymb[i], function (object) {
            object.traverse(function (child) {
                if (child.isMesh) {                 
                    child.material = materialHolo;                  
                    symbsParent.add(object);
                }
            });
        });
    }

    symbsParent.position.y = -67;
   // symbsParent.position.z = 300;
    symbsParent.position.z = 70;
   // symbsParent.scale.set(1.3, 1.05, 1.3);
    this.symbsParent = symbsParent;
    this.symbsParent.visible = false;
    this.add(symbsParent);
//////////////////////////////////////////

    var vertexShader = shaders.vertexShaders.vertexShWideScreen;
    var fragmentShader = shaders.fragmentShaders.fragmentShWideScreen;

    this.materialDisplay =	new THREE.ShaderMaterial({
        defines         : {
            USE_HOLO      : false,
            USE_ROTATE    : false,
          //  USE_3D        : false,
         //   USE_OFF       : false,
            USE_OFF_SYMB  : false,
         //   USE_GLITCH    : false,
            USE_SCANLINE  : true,
            NUMSYMB       : 8,
            INDEX_TEXTURE : 3,
        },
        uniforms: {
            resolution: { value: new THREE.Vector2( 4096.0, 2160.0 ) },
            colorBorderDisplay:     { value: new THREE.Color( "#111111" ) },
          //  colorClampColor:     { value: new THREE.Color( "#f0f8fd" ) },
            arrayTexture: { value: this.arrayTexturesSymb },
            indexTexture: { value: 0 },
            f_texture:   { value: textureLoader.load("textures/background/display.png") },
            s_texture:   { value: textureLoader.load("textures/numbers/compose.png") },
            noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            time: { value: 0.0 },
            timeRotate: { value: 1.0 },
            rateFactor:   { value: 0.0 },
            speedFactor:   { value: this.speedFactor }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
     //   transparent: true,
        // blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );
    for (var i = 0; i < this.arrayTexturesSymb.length; i++) {
        this.arrayTexturesSymb[i].wrapS = this.arrayTexturesSymb[i].wrapT = THREE.RepeatWrapping;
   }

    this.materialDisplay.uniforms.f_texture.value.wrapS = this.materialDisplay.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialDisplay.uniforms.s_texture.value.wrapS = this.materialDisplay.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialDisplay.uniforms.noise_texture.value.wrapS = this.materialDisplay.uniforms.noise_texture.value.wrapT = THREE.RepeatWrapping;
    var materialDisplay = this.materialDisplay;
    var materialPanel = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a5a5a5"),
        map: textureLoader.load("textures/tv/tvCRT_monitor_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/tv/tvCRT_monitor_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/tv/tvCRT_monitor_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/tv/tvCRT_monitor_Normal.png"),
    });
    var materialHand1 = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#787878"),
        map: textureLoader.load("textures/tv/tvCRT_bracket_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/tv/tvCRT_bracket_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/tv/tvCRT_bracket_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/tv/tvCRT_bracket_Normal.png"),
    });
    var materialHand2 = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a5a5a5"),
        map: textureLoader.load("textures/tv/tv_hand2_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/tv/tv_hand2_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/tv/tv_hand2_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/tv/tv_hand2_Normal.png"),
    });
    var materialRoot = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a5a5a5"),
        map: textureLoader.load("textures/tv/tv_root_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/tv/tv_root_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/tv/tv_root_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/tv/tv_root_Normal.png"),
    });
    var tvParent = new THREE.Object3D;
/*    var FBXobject;
    if (align == "up") {
        FBXobject = "tvUp.fbx";
    } else if (align == "middle") {
        FBXobject = "tvMiddle.fbx";
    } else if (align == "down") {
        FBXobject = "tvDown.fbx";
    } else {
        FBXobject = "tvUp.fbx";
    }*/
    var FBXobject = "tvCRT.fbx";

    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/" + FBXobject, function (object) {

        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "display") {
                    child.material = materialDisplay;
                  //  child.material.color = new THREE.Color("#485675");
             //   } else if (child.name == "panel") {
                } else if (child.name == "monitor") {
                    child.material = materialPanel;
             //   } else if (child.name == "hand1") {
                } else if (child.name == "bracket") {
                    child.material = materialHand1;
               // } else if (child.name == "hand2") {
              //      child.material = materialHand2;
                } else {
                    child.material = materialRoot;
                   // child.material.color = new THREE.Color("#535353");
                }
                /*    mesh.castShadow = true;
                    //mesh.receiveShadow = true;
                    var distanceMaterial = new THREE.MeshDistanceMaterial( {
                        alphaMap: material.alphaMap,
                        alphaTest: material.alphaTest
                    } );
                    mesh.customDistanceMaterial = distanceMaterial;*/
               // console.log(object);
                tvParent.add(object);
            }
        });
    });
    //tvParent.scale.set(0.85, 0.85, 0.85);
    //  tvParent.position.y = -0.3;
    this.tvParent = tvParent;
    this.add(tvParent);

    this.setupTween ( { value: 0.0 }, 0.25, 350 );

  /*  var geometry = new THREE.PlaneBufferGeometry(200, 160);
    geometry.rotateX(-Math.PI*2.0);
    var material = new THREE.MeshPhongMaterial({
        // color: new THREE.Color("#ff0300"),
        map: textureLoader.load("textures/numbers/symb_1.png"),
        transparent: true
    });
   // material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
   // material.map.repeat.set( 3, 1 );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -67;
    mesh.position.z = 75;
   // this.add(mesh);*/
}

TV.prototype = Object.create(THREE.Object3D.prototype);
TV.prototype.constructor = TV;

TV.prototype.setupTween =  function(rotationObject, target, duration)
{
    var display = this.materialDisplay;
    var monitor = this;
    this.tween = new TWEEN.Tween (rotationObject)
        .to ( { value:  "+" + target.toString() } ,
              duration
            )
        .easing (TWEEN.Easing.Back.Out)
        //.easing (TWEEN.Easing.Elastic.Out)
        .onUpdate (
            function() {
                display.uniforms.timeRotate.value = rotationObject.value;
            })
        .onComplete(
            function() {
                monitor.isStopped = true;
                display.uniforms.timeRotate.value = 0.0;
            });
};

TV.prototype.addAnimation = function() {
    for (var j = 0; j < this.symbsParent.children.length; j++) {
        for (var i = 0; i < this.symbsParent.children.length; i++) {
            if(this.arrayNameSymb[j] == this.symbsParent.children[i].children[0].name) {
                this.arraySymbObjects[j] = this.symbsParent.children[i];
            }
        }
    }

/*    var child = this.tvParent.children[0];
    child.mixer = new THREE.AnimationMixer(child);
    this.mixers.push(child.mixer);
    this.action = child.mixer.clipAction(child.animations[0]);
   // this.action.repetitions = 1;
   // this.action.setDuration(2.5)/!*.play()*!/;
    this.action.clampWhenFinished = true;
    this.action.loop = THREE.LoopOnce;
  //  this.action.loop = THREE.LoopPingPong;*/


    for (var i = 0; i < this.arraySymbObjects.length; i++) {
     //   this.mixersSymbs[i] = [];
        this.arraySymbObjects[i].visible = false;
        var child = this.arraySymbObjects[i];
        child.mixer = new THREE.AnimationMixer(child);
        this.mixersSymbs[i].push(child.mixer);
        this.actionSymbs[i] = child.mixer.clipAction(this.arraySymbObjects[0].animations[0]);
       // this.actionSymbs[i].repetitions = 1;
        this.actionSymbs[i].setDuration(2.25)/*.play()*/;
       // this.actionSymbs[i].clampWhenFinished = true;
        this.actionSymbs[i].loop = THREE.LoopOnce;
        //  this.actionSymbs.play();
    }
};

TV.prototype.startAnimation = function () {
    this.arraySymbObjects[this.indexStopSymb].visible = true;
    this.actionSymbs[this.indexStopSymb].play();
   // this.materialDisplay.uniforms.time.value = 0.0;
    this.materialHolo.uniforms.time.value = 0.0;
    this.i = 0;
    this.boolRate = true;
};

TV.prototype.stopAnimation = function () {
    this.actionSymbs[this.indexStopSymb].stop();
    this.boolRate = false;
    this.materialDisplay.uniforms.rateFactor.value = 0.0;
};

TV.prototype.pausedAnimation = function () {
    if( this.action.paused == true ) {
        this.action.paused = false;
    } else {
        this.action.paused = true;
    }
};

TV.prototype.pausedToTimeAnimation = function () {
    if( this.resolutionPaused == true ) {
        this.resolutionPaused = false;
        this.action.paused = false;
    } else {
        this.resolutionPaused = true;
    }
};

TV.prototype.rotateSymb = function ( time, deltaTime ) {
    /*this.dt += deltaTime * this.speedFactor;

    if (this.dt >= 1.0/this.speedFactor) {
        this.i++;
        this.dt = 0.0;
        if (this.i > 7) {
            this.i = 0;
        }
    }*/

  //  this.materialDisplay.defines.INDEX_TEXTURE = this.i;
   // this.materialDisplay.defines.INDEX_TEXTURE = Math.round(Math.random() * 7.0);
    this.materialDisplay.uniforms.timeRotate.value += deltaTime;
   // this.materialDisplay.needsUpdate = true;
};

TV.prototype.stopRotateSymb = function ( indexStopSymb ) {
    this.indexStopSymb = indexStopSymb;
    this.isStopped = true;
    this.boolRotate = false;
    this.materialDisplay.uniforms.timeRotate.value = 0.0;
    this.tween.start();
   // this.materialDisplay.defines.USE_GLITCH = false;
    this.materialDisplay.defines.USE_ROTATE = false;
  //  this.materialDisplay.defines.USE_OFF = false;
    this.materialDisplay.defines.INDEX_TEXTURE = this.indexStopSymb;
    this.materialDisplay.needsUpdate = true;
};

TV.prototype.startRotateSymb = function () {
    this.arraySymbObjects[this.indexStopSymb].visible = false;
    this.isStopped = false;
    this.boolRotate = true;
    this.tween.stop();
    this.materialDisplay.uniforms.timeRotate.value = 0;
 //   this.materialDisplay.defines.INDEX_TEXTURE = Math.round(Math.random() * 7.0);
   // this.materialDisplay.defines.USE_GLITCH = true;
    this.materialDisplay.defines.USE_ROTATE = true;
   // this.materialDisplay.defines.USE_OFF = false;
    this.materialDisplay.needsUpdate = true;
};

TV.prototype.updateWithTime = function ( time, deltaTime ) {

    if (this.boolRotate) {
        this.rotateSymb( time, deltaTime );
    }

    this.materialDisplay.uniforms.time.value = time;
    this.materialHolo.uniforms.time.value = time;

   /* if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
    }*/

    if ( this.mixersSymbs[this.indexStopSymb].length > 0 ) {
        for ( var i = 0; i < this.mixersSymbs[this.indexStopSymb].length; i ++ ) {
            this.mixersSymbs[this.indexStopSymb][ i ].update( deltaTime );
        }
    }  

    if (this.boolRate) {
        this.materialDisplay.uniforms.rateFactor.value += deltaTime*(1.0 - Math.sin(time*5.0) * Math.cos(time*5.0))*2.0;
    }

    if (this.actionSymbs[this.indexStopSymb].time < 1.0 ) {

        this.symbsParent.rotation.x = this.actionSymbs[this.indexStopSymb].time * (Math.sin(time * 4.0) - Math.cos(time * 4.0)) * 0.05  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.symbsParent.rotation.y = this.actionSymbs[this.indexStopSymb].time * (Math.sin(time * 8.0) - Math.cos(time * 8.0)) * 0.1;
        this.symbsParent.rotation.z = this.actionSymbs[this.indexStopSymb].time * (Math.sin(time * 8.0) - Math.cos(time * 8.0)) * 0.1  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;

        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.x = this.actionSymbs[this.indexStopSymb].time * (Math.sin(time * 4.0) - Math.cos(time * 4.0)) * 0.25  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.y = this.actionSymbs[this.indexStopSymb].time * Math.sin(time * 8.0);
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.z = this.actionSymbs[this.indexStopSymb].time * (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;

    } else if (this.actionSymbs[this.indexStopSymb].time >= 1.0 ) {

        this.symbsParent.rotation.x = (2.0-this.actionSymbs[this.indexStopSymb].time) * (Math.sin(time * 4.0) - Math.cos(time * 4.0)) * 0.05 /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.symbsParent.rotation.y = (2.0-this.actionSymbs[this.indexStopSymb].time) * (Math.sin(time * 8.0) - Math.cos(time * 8.0)) * 0.1;
        this.symbsParent.rotation.z = (2.0-this.actionSymbs[this.indexStopSymb].time) * (Math.sin(time * 8.0) - Math.cos(time * 8.0)) * 0.1  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;

        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.x = (2.0-this.actionSymbs[this.indexStopSymb].time) * (Math.sin(time * 4.0) - Math.cos(time * 4.0)) * 0.25  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.y = (2.0-this.actionSymbs[this.indexStopSymb].time) * Math.sin(time * 8.0);
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.z = (2.0-this.actionSymbs[this.indexStopSymb].time) * (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;

    } else if (this.actionSymbs[this.indexStopSymb].time >= 2.0 ) {

        this.symbsParent.rotation.x = 0;
        this.symbsParent.rotation.y = 0;
        this.symbsParent.rotation.z = 0;

        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.x = 0;
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.y = 0;
        this.arraySymbObjects[this.indexStopSymb].children[0].rotation.z = 0;
    }


};