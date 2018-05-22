function FlameBonfire(optionsFire, loadingManager, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "FlameBonfire";

    this.tonguesOfFireParticles = new FireParticles(optionsFire.optionsTonguesOfFireParticles, textureLoader);
    this.tonguesOfFireParticles.name = "tonguesOfFireParticles";
    this.add(this.tonguesOfFireParticles);

    this.originFireParticles = new FireParticles(optionsFire.optionsOriginFireParticles, textureLoader);
    this.originFireParticles.name = "originFireParticles";
    this.add(this.originFireParticles);

    var  vertexShader = shaders.vertexShaders.vertexShHologram;
    var  fragmentShader = shaders.fragmentShaders.fragmentShHologram;
    this.materialHolo =	new THREE.ShaderMaterial({
        defines         : {
            USE_OFF       : true,
            USE_SCANLINE  : false
        },
        uniforms: {
            color: { value : new THREE.Color("#a8a1ff") },
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
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );

    this.materialHolo.uniforms.f_texture.value.wrapS = this.materialHolo.uniforms.f_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHolo.uniforms.s_texture.value.wrapS = this.materialHolo.uniforms.s_texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.materialHolo.uniforms.t_texture.value.wrapS = this.materialHolo.uniforms.t_texture.value.wrapT = THREE.RepeatWrapping;
    var geometry = new THREE.SphereBufferGeometry(3, 8, 8);
    //  var material = new THREE.MeshPhongMaterial({color: new THREE.Color("#ff000f")});
    this.ball = new THREE.Mesh(geometry, this.materialHolo);
   // this.ball.position.x = 2.5;
  //  this.ball.position.y = 2.5;
    this.ball.visible = false;
    //  mesh.position.copy(this.flameParticlesFreeSpin.position);
    this.add(this.ball);
////////////////////////////////////////
    var explodeOption = {
        leftBottom: {
            x: 0,
            y: 0
        },
        rightTop: {
            x: 20,
            y: 20
        },
        zCoord: 0,
        totalParticles: 250,
        sccaleSizeParticles: 20,
        beginRadius: 1,
        endRadius: 10,
        combustion: 0.25,
        movementSpeed: 4.2,
        pulseFactor: 0.8
    };
    this.explodeParticles = new ExplodeParticles(explodeOption);
    // this.explodeParticles.start();
    this.explodeParticles.name = "explodeParticles";
    this.add(this.explodeParticles);
}

FlameBonfire.prototype = Object.create( THREE.Object3D.prototype );
FlameBonfire.prototype.constructor = FlameBonfire;

FlameBonfire.prototype.addFlame = function ( geometryBonfire, windVector ) {
    this.originFireParticles.addFire( geometryBonfire, windVector );
    this.tonguesOfFireParticles.addFire( geometryBonfire, windVector );
    //this.tonguesOfFireParticles.start();
    //this.originFireParticles.start();
};

FlameBonfire.prototype.setWindVector = function(windVector)
{
    this.originFireParticles.setWindVector(windVector);
    this.tonguesOfFireParticles.setWindVector(windVector)
};

FlameBonfire.prototype.stop = function () {
    this.ball.visible = false;
    this.tonguesOfFireParticles.stop();
    this.originFireParticles.stop();

    this.explodeParticles.start();
};

FlameBonfire.prototype.start = function () {
    this.explodeParticles.stop();

    this.tonguesOfFireParticles.start();
    this.originFireParticles.start();
    this.ball.visible = true;
};

FlameBonfire.prototype.switchOff = function () {
    this.ball.visible = false;
    this.tonguesOfFireParticles.switchOff();
    this.originFireParticles.switchOff();

    this.explodeParticles.stop();
};

FlameBonfire.prototype.updateWithTime = function (time, deltaTime ) {
    this.materialHolo.uniforms.time.value = deltaTime;
    this.tonguesOfFireParticles.updateParticles( deltaTime );
    this.originFireParticles.updateParticles( deltaTime );

    this.explodeParticles.updateParticles(time, deltaTime);

};