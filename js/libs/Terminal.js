function Terminal(textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "Terminal";
    this.textureLoader = textureLoader;

    this.mixers = [];

    var materialTerminal = new THREE.MeshStandardMaterial({
      //  color: new THREE.Color("#858385"),
        map: textureLoader.load("textures/terminal/terminal_Base_Color.png"),
        metalnessMap: textureLoader.load("textures/terminal/terminal_Metallic.png"),
        metalness: 1.0,
        roughnessMap: textureLoader.load("textures/terminal/terminal_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/terminal/terminal_Normal.png"),
        bumpMap: textureLoader.load("textures/terminal/terminal_Height.png"),
        aoMap: textureLoader.load("textures/terminal/terminal_Mixed_AO.png")
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
    var terminalParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/terminal.fbx", function (object) {

        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "terminal") {
                    child.material = materialTerminal;
                  //  child.material.side = THREE.DoubleSide;
               //       child.material.color = new THREE.Color("#0a2b12");
            /*    } else if (child.name == "linz") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                } else if (child.name == "start") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                    // child.visible = false;
                } else if (child.name == "stop") {
                    child.material = materialHolo;
                    //child.material.color = new THREE.Color("#00830d");
                    child.visible = false;*/
                } else {
                   // child.material = materialHolo;
                      child.material.color = new THREE.Color("#ff1309");
                }
                terminalParent.add(object);
                object.name = "terminal";
            }
        });
    });

    terminalParent.name = "terminal";
    //  tvParent.position.y = -0.3;
    this.terminalParent = terminalParent;
    this.terminalParent.name = "terminal";
    this.add(terminalParent);

/*    var vertexShader = shaders.vertexShaders.vertexShProjector;
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
    this.add(mesh);*/
}

Terminal.prototype = Object.create(THREE.Object3D.prototype);
Terminal.prototype.constructor = Terminal;

Terminal.prototype.addAnimation = function() {

    var child = this.terminalParent.children[0];
    child.mixer = new THREE.AnimationMixer(child);
    this.mixers.push(child.mixer);
    this.action = child.mixer.clipAction(child.animations[0]);
    // this.action.repetitions = 1;
    this.action.setDuration(0.4);
    this.action.clampWhenFinished = true;
    this.action.loop = THREE.LoopOnce;
    //  this.action.loop = THREE.LoopPingPong;    
};

Terminal.prototype.stopColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#ff6a5d" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#ff6a5d" );
    this.terminalParent.children[0].children[1].visible = false;
    this.terminalParent.children[0].children[0].visible = true;

    //  this.action.stop();
    //  this.action.play();
};

Terminal.prototype.setTexture = function(terminal)
{

};

Terminal.prototype.startColor = function()
{
    this.material.uniforms.rayColor.value = new THREE.Color( "#97ff85" );
    this.materialHolo.uniforms.color.value =  new THREE.Color( "#97ff85" );
    this.terminalParent.children[0].children[1].visible = true;
    this.terminalParent.children[0].children[0].visible = false;
    //this.action.stop();
};

Terminal.prototype.updateWithTime = function(time, deltaTime)
{
    this.material.uniforms.time.value = time * 2.0;
    this.materialHolo.uniforms.time.value = time;

    if (this.terminalParent.children[0].children[1].visible) {
        this.terminalParent.children[0].children[1].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.terminalParent.children[0].children[1].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.terminalParent.children[0].children[1].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
    }
    if (this.terminalParent.children[0].children[0].visible) {
        this.terminalParent.children[0].children[0].rotation.x = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.5  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
        this.terminalParent.children[0].children[0].rotation.y = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.2 - 0.5;
        this.terminalParent.children[0].children[0].rotation.z = (Math.sin(time * 2.0) - Math.cos(time * 2.0)) * 0.1 - 0.15  /*+ Math.random() * (0.22 - 0.2) + 0.2*/;
    }


    if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
    }


};