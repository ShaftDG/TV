function Button3D(textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "Button3D";
    this.textureLoader = textureLoader;

    this.mixers = [];

    this.dt = 0.0;

    var materialCorps = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#b8b5b8"),
        map: textureLoader.load("textures/button/button_corps_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/button/button_corps_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/button/button_corps_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/button/button_corps_Normal.png"),
    });
    ///////////////////////////////////////////////////////
    var  vertexShader = shaders.vertexShaders.vertexShHologram;
    var  fragmentShader = shaders.fragmentShaders.fragmentShHologram;
    this.materialHolo =	new THREE.ShaderMaterial({
        defines         : {
            USE_OFF       : true,
            USE_SCANLINE  : false
        },
        uniforms: {
            color: { value : new THREE.Color("#97ff85") },
            f_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            s_texture:   { value: textureLoader.load("textures/noise/wideScreen.png") },
            t_texture:   { value: textureLoader.load("textures/background/display.png") },
            time: { value: 0.0 },
            speedFactor:   { value: 10.0 },
            boolGlitch:  { value: false },
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
    ////////////////////////////////////////
    this.materialHoloPlane =	new THREE.ShaderMaterial({
        defines         : {
            USE_OFF       : true,
            USE_SCANLINE  : false
        },
        uniforms: {
            color: { value : new THREE.Color("#97ff85") },
            f_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            s_texture:   { value: textureLoader.load("textures/noise/wideScreen.png") },
            t_texture:   { value: textureLoader.load("textures/background/display.png") },
            time: { value: 0.0 },
            speedFactor:   { value: 10.0 },
            boolGlitch:  { value: false },
            start:   { value: 0.01 },
            end:   { value: 0.05 },
            alpha:   { value: 0.3 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        //side: THREE.DoubleSide,
        transparent: true,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        //depthWrite:      false,
    } );

    this.materialHoloPlane.uniforms.f_texture.value.wrapS = this.materialHoloPlane.uniforms.f_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHoloPlane.uniforms.s_texture.value.wrapS = this.materialHoloPlane.uniforms.s_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHoloPlane.uniforms.t_texture.value.wrapS = this.materialHoloPlane.uniforms.t_texture.value.wrapT = THREE.RepeatWrapping;
    var materialHoloPlane = this.materialHoloPlane;
    ////////////////////////////////////////
    var buttonParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/button.fbx", function (object) {

        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "corps") {
                    child.material = materialCorps;
                    child.material.side = THREE.DoubleSide;
                  //  child.material.color = new THREE.Color("#000000");
                } else if (child.name == "linz") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                } else if (child.name == "start") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                   // child.visible = false;
                } else if (child.name == "plane_start") {
                    child.material = materialHoloPlane;
                    //child.material.color = new THREE.Color("#00830d");
                    // child.visible = false;
                } else if (child.name == "stop") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                    child.visible = false;
                } else if (child.name == "plane_stop") {
                    child.material = materialHoloPlane;
                    //child.material.color = new THREE.Color("#00830d");
                    child.visible = false;
                } else {
                    child.material = materialHolo;
                  //  child.material.color = new THREE.Color("#ff1309");
                }
                buttonParent.add(object);
                object.name = "button";
            }
        });
    });

    console.log(buttonParent);
    buttonParent.name = "button";
    //  tvParent.position.y = -0.3;
    this.buttonParent = buttonParent;
    this.buttonParent.name = "button";
    this.add(buttonParent);

    var vertexShader = shaders.vertexShaders.vertexShProjector;
    var fragmentShader = shaders.fragmentShaders.fragmentShProjector;
    this.material =	new THREE.ShaderMaterial({
        uniforms: {
            rayColor:           { value: new THREE.Color( "#97ff85" ) },
            time:               { value: 0.0 },
            rayAngleSpread:     { value: 0.0 },
            rayDistanceSpread:  { value: 20.0 },
            rayBrightness:      { value: 11.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        depthWrite:      false,
    } );
    ////////////////////////////////////////////
    var geometry = new THREE.CylinderBufferGeometry(20, 50, 50, 16, 1.0, true);
    geometry.rotateX( -Math.PI );
    //geometry.rotateZ(-Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
  //  mesh.position.x = 35-12.5;
    mesh.position.y = 42;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(15, 40, 60, 16, 1.0, true);
    geometry.rotateX( -Math.PI );
    //geometry.rotateZ(-Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
    //  mesh.position.x = 35-12.5;
    mesh.position.y = 45;
    this.add(mesh);
}

Button3D.prototype = Object.create(THREE.Object3D.prototype);
Button3D.prototype.constructor = Button3D;

Button3D.prototype.addAnimation = function() {

    var child = this.buttonParent.children[0];
    child.mixer = new THREE.AnimationMixer(child);
    this.mixers.push(child.mixer);
    this.action = child.mixer.clipAction(child.animations[0]);
    // this.action.repetitions = 1;
    this.action.setDuration(0.4);
    this.action.clampWhenFinished = true;
    this.action.loop = THREE.LoopOnce;
    //  this.action.loop = THREE.LoopPingPong;    
};

Button3D.prototype.stopColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#ff6a5d" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#ff6a5d" );
    this.materialHoloPlane.uniforms.color.value =  new THREE.Color( "#ff6a5d" );
    this.buttonParent.children[0].children[1].visible = this.buttonParent.children[0].children[5].visible = false;
    this.buttonParent.children[0].children[0].visible = this.buttonParent.children[0].children[4].visible = true;
    this.materialHolo.uniforms.boolGlitch.value = true;
  //  this.action.stop();
  //  this.action.play();
};

Button3D.prototype.setTexture = function(button)
{

};

Button3D.prototype.startColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#97ff85" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#97ff85" );
    this.materialHoloPlane.uniforms.color.value =  new THREE.Color( "#97ff85" );
    this.buttonParent.children[0].children[1].visible = this.buttonParent.children[0].children[5].visible = true;
    this.buttonParent.children[0].children[0].visible = this.buttonParent.children[0].children[4].visible = false;
    this.materialHolo.uniforms.boolGlitch.value = true;
    //this.action.stop();
};

Button3D.prototype.updateWithTime = function(time, deltaTime)
{
    this.material.uniforms.time.value = time * 2.0;
    this.materialHolo.uniforms.time.value = time;
    this.materialHoloPlane.uniforms.time.value = time;

    if (this.materialHolo.uniforms.boolGlitch.value) {
        this.dt += deltaTime;
        if (this.dt > 0.25) {
            this.materialHolo.uniforms.boolGlitch.value = false;
            this.dt = 0.0;
        }
    }

    if (this.buttonParent.children[0].children[1].visible) {
        this.buttonParent.children[0].children[1].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.buttonParent.children[0].children[1].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.buttonParent.children[0].children[1].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.buttonParent.children[0].children[5].rotation.copy(this.buttonParent.children[0].children[1].rotation);
    }
    if (this.buttonParent.children[0].children[0].visible) {
        this.buttonParent.children[0].children[0].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.buttonParent.children[0].children[0].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.buttonParent.children[0].children[0].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.buttonParent.children[0].children[4].rotation.copy(this.buttonParent.children[0].children[0].rotation);
    }


    if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
    }

};