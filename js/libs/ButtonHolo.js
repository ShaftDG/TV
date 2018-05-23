function ButtonHolo(textureButton, textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "ButtonHolo";
    this.textureLoader = textureLoader;

    this.mixers = [];

    this.dt = 0.0;

    this.boolOnOffSwitch = false;

    var materialCorps = new THREE.MeshStandardMaterial({
        // color: new THREE.Color("#b8b5b8"),
        map: textureLoader.load("textures/button/holo_corps_Base_Color.png"),
        metalnessMap: textureLoader.load("textures/button/holo_corps_Metallic.png"),
        metalness: 1.0,
        roughnessMap: textureLoader.load("textures/button/holo_corps_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/button/holo_corps_Normal.png"),
        aoMap: textureLoader.load("textures/button/holo_corps_Mixed_AO.png"),
        bumpMap: textureLoader.load("textures/button/holo_corps_Height.png"),
    });
    ///////////////////////////////////////////////////////
    var vertexShader = shaders.vertexShaders.vertexShTotalHologram;
    var fragmentShader = shaders.fragmentShaders.fragmentShTotalHologram;
    this.materialHolo =	new THREE.ShaderMaterial({
        defines         : {
            USE_GLITCH    : true,
            USE_HOLO      : true,
            USE_OFF_SYMB  : false,
            USE_SCANLINE  : true
        },
        uniforms: {
            color: { value : new THREE.Vector3(10, 3, 3) },
            s_texture:   { value: textureLoader.load("textures/background/display.png") },
            f_texture:   { value: textureButton },
            noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            time: { value: 0.0 },
            rateFactor:   { value: 1.0 },
            boolGlitch:  { value: false },
            boolOn:  { value: false },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );

    this.materialHolo.uniforms.f_texture.value.wrapS = this.materialHolo.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialHolo.uniforms.s_texture.value.wrapS = this.materialHolo.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialHolo.uniforms.noise_texture.value.wrapS = this.materialHolo.uniforms.noise_texture.value.wrapT = THREE.RepeatWrapping;
    var materialHolo = this.materialHolo;
    ////////////////////////////////////////
    var buttonParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/buttonHolo.fbx", function (object) {

        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "corps") {
                    child.material = materialCorps;
                    child.material.side = THREE.DoubleSide;
                    //  child.material.color = new THREE.Color("#000000");
                } else if (child.name == "holo") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                } else {
                    //child.material = materialHolo;
                    child.material.color = new THREE.Color("#ff1309");
                }
                buttonParent.add(object);
                object.name = "buttonHolo";
            }
        });
    });

    buttonParent.name = "buttonHolo";
    //  tvParent.position.y = -0.3;
    this.buttonParent = buttonParent;
    this.buttonParent.name = "buttonHolo";
    this.add(buttonParent);
}

ButtonHolo.prototype = Object.create(THREE.Object3D.prototype);
ButtonHolo.prototype.constructor = ButtonHolo;

ButtonHolo.prototype.addAnimation = function() {

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

ButtonHolo.prototype.stopColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#ff6a5d" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#ff6a5d" );
    this.buttonParent.children[0].children[1].visible = false;
    this.buttonParent.children[0].children[0].visible = true;

    //  this.action.stop();
    //  this.action.play();
};

ButtonHolo.prototype.startGlitch = function()
{
    this.materialHolo.uniforms.boolGlitch.value = true;
};

ButtonHolo.prototype.OnOff = function()
{
    if (this.boolOnOffSwitch) {
        this.materialHolo.uniforms.boolOn.value = false;
        this.boolOnOffSwitch = false;
    } else {
        this.materialHolo.uniforms.boolOn.value = true;
        this.boolOnOffSwitch = true;
    }
};

ButtonHolo.prototype.setTexture = function(texture)
{
    this.materialHolo.uniforms.f_texture.value = texture;
    this.materialHolo.needsUpdate = true;
};

ButtonHolo.prototype.startColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#97ff85" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#97ff85" );
    this.buttonParent.children[0].children[1].visible = true;
    this.buttonParent.children[0].children[0].visible = false;
    //this.action.stop();
};

ButtonHolo.prototype.updateWithTime = function(time, deltaTime)
{

    this.materialHolo.uniforms.time.value = time;

    if (this.materialHolo.uniforms.boolGlitch.value) {
        this.dt += deltaTime;
        if (this.dt > 0.5) {
            this.materialHolo.uniforms.boolGlitch.value = false;
            this.dt = 0.0;
        }
    }

    /*if (this.buttonParent.children[0].children[1].visible) {
        this.buttonParent.children[0].children[1].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /!*+ Math.random() * (0.22 - 0.2) + 0.2*!/;
        this.buttonParent.children[0].children[1].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.buttonParent.children[0].children[1].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /!*+ Math.random() * (0.22 - 0.2) + 0.2*!/;
    }
    if (this.buttonParent.children[0].children[0].visible) {
        this.buttonParent.children[0].children[0].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /!*+ Math.random() * (0.22 - 0.2) + 0.2*!/;
        this.buttonParent.children[0].children[0].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.buttonParent.children[0].children[0].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /!*+ Math.random() * (0.22 - 0.2) + 0.2*!/;
    }


    if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
    }*/


};