function FireParticles(fireOption, textureLoader)
{
    THREE.Object3D.apply(this);
    //////////////settings/////////
    this.flameSpeed = fireOption.flameSpeed;
    this.movementSpeed = fireOption.movementSpeed;
    this.beginR = fireOption.beginRadius;
    this.endR = fireOption.endRadius;
    this.combustion = fireOption.combustion;
    this.pulseFactor = fireOption.pulseFactor;
    this.totalParticles = fireOption.totalParticles;
    this.scaleSizeParticles = fireOption.scaleSizeParticles;
    this.windVector = fireOption.windVector;
    this.noiseTexture = fireOption.noiseTexture;
    this.distortFlame = fireOption.distortFlame;
    this.distortAlpha = fireOption.distortAlpha;
    this.boolBlending = fireOption.boolBlending;
    //  |
    //  |
    //   -----
    this.xCoord = fireOption.xCoord;
    this.yCoord = fireOption.yCoord;
    this.zCoord = fireOption.zCoord;

    //  -----
    //       |
    //       |
    /*this.xCoordRT = fireOption.rightTop.x;
    this.yCoordRT = fireOption.rightTop.y;
    this.zCoord = fireOption.zCoord;
    /////////////////////////////////
    this.xlength = Math.abs(this.xCoordRT - this.xCoord);
    this.ylength = Math.abs(this.yCoordRT - this.yCoord);*/

    this.geometry = new THREE.BufferGeometry();

    this.positionsWWWW = new Float32Array( this.totalParticles * 3 );
    this.dirs = new Float32Array( this.totalParticles * 3 );
    this.posBegin = new Float32Array( this.totalParticles * 3 );

    this.colors = new Float32Array( this.totalParticles * 3);
    this.sizes = new Float32Array( this.totalParticles);
    this.sizesBegin = new Float32Array( this.totalParticles);
    this.alpha = new Float32Array( this.totalParticles);
    this.speedFactor = new Float32Array( this.totalParticles);
    this.angleFactor = new Float32Array( this.totalParticles);
    this.distortFlameFactor = new Float32Array( this.totalParticles);
    this.distortAlphaFactor = new Float32Array( this.totalParticles);

    this.color = new THREE.Color();

    var vertexShader = shaders.vertexShaders.vertexShFireParticles;
    var fragmentShader = shaders.fragmentShaders.fragmentShFireParticles;

    this.material =	new THREE.ShaderMaterial({
        uniforms: {
            posParent: { value: new THREE.Vector3(this.xCoord, this.yCoord, this.zCoord) },
            color:     { value: new THREE.Color( "#ffffff" ) },
            //texture:   { value: textureLoader.load("textures/sprites/spark13.png") },
            // noiseTexture:   { value: textureLoader.load("textures/sprites/noise.jpg") },
            noiseTexture:   { value: this.noiseTexture },
            time: { value: 1.0 },
            started:   { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        // blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        depthWrite:      false,
    } );
    if (this.boolBlending) {
        this.material.blending = THREE.AdditiveBlending;
    }
    this.material.uniforms.noiseTexture.value.wrapS = this.material.uniforms.noiseTexture.value.wrapT = THREE.MirroredRepeatWrapping;

    this.checkNumParticles = 0;
    this.boolEnd = false;
    this.boolEndArray = [];
    for (var i = 0; i < this.totalParticles; i++) {
        this.boolEndArray[i] = false;
    }
}

FireParticles.prototype = Object.create(THREE.Object3D.prototype);
FireParticles.prototype.constructor = FireParticles;

FireParticles.prototype.addFire = function(geometry, windVector) {
    var beginGeometry = geometry;
    this.windVector = windVector;
    var beginVerts = new THREE.GeometryUtils.randomPointsInBufferGeometry(beginGeometry, this.totalParticles);
    for (var v = 0; v < beginVerts.length; v++) {
        this.sizes[ v ] = Math.random() * (this.scaleSizeParticles - this.scaleSizeParticles / 2) + this.scaleSizeParticles / 2;
        this.sizesBegin[ v ] = Math.random() * (this.scaleSizeParticles - this.scaleSizeParticles / 2) + this.scaleSizeParticles / 2;

        this.posBegin[ v * 3 + 0 ] = beginVerts[v].x + this.xCoord;
        this.posBegin[ v * 3 + 1 ] = beginVerts[v].y + this.yCoord;
        this.posBegin[ v * 3 + 2 ] = beginVerts[v].z + this.zCoord;

        this.dirs[ v * 3 + 0 ] = beginVerts[v].x + this.xCoord;
        this.dirs[ v * 3 + 1 ] = beginVerts[v].y + this.yCoord;
        this.dirs[ v * 3 + 2 ] = beginVerts[v].z + this.zCoord;

        var modA = Math.sqrt( this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y + this.windVector.z * this.windVector.z);
        var a = this.windVector.x / modA;
        var b = this.windVector.y / modA;
        var c = this.windVector.z / modA;
        var Rdelta = (Math.random() * (1.0 - 0.25) + 0.25);
        var zzD =  c * Rdelta * this.movementSpeed,
            xxD =  a * Rdelta * this.movementSpeed,
            yyD =  b * Rdelta * this.movementSpeed;

        this.positionsWWWW[ v * 3 + 0 ] = xxD;
        this.positionsWWWW[ v * 3 + 1 ] = yyD;
        this.positionsWWWW[ v * 3 + 2 ] = zzD;


        this.colors[ v * 3 + 0 ] = (Math.random() * (0.6 - 0.2) + 0.2);
        this.colors[ v * 3 + 1 ] = (Math.random() * (0.2 - 0.1) + 0.1);
        this.colors[ v * 3 + 2 ] = (Math.random() * (0.05 - 0.025) + 0.025);


        this.alpha[ v ] = 1.0;
        this.speedFactor[ v ] = Math.random() * (0.4 - 0.3) + 0.3;
        this.angleFactor[ v ] =
                Math.acos(  ( 0.0 * this.windVector.x + 1.0 * this.windVector.y ) /
                            ( 1.0 * Math.sqrt(this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y) )
        );

        if (this.windVector.x > 0) {
            this.angleFactor[ v ] *= 1.0;
        } else {
            this.angleFactor[ v ] *= -1.0;
        }

        this.distortFlameFactor[ v ] = Math.random() * (this.distortFlame - (this.distortFlame-0.5)) + (this.distortFlame-0.5);
        this.distortAlphaFactor[ v ] = Math.random() * (this.distortAlpha - (this.distortAlpha-0.5)) + (this.distortAlpha-0.5);
    }

    this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.dirs, 3 ).setDynamic( true ) );
    this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ).setDynamic( true ) );
    this.geometry.addAttribute( 'customAlpha', new THREE.BufferAttribute( this.alpha, 1 ).setDynamic( true ) );
    this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ).setDynamic( true ) );
    this.geometry.addAttribute( 'speedFactor', new THREE.BufferAttribute( this.speedFactor, 1 ).setDynamic( true ) );
    this.geometry.addAttribute( 'angleFactor', new THREE.BufferAttribute( this.angleFactor, 1 ).setDynamic( true ) );
    this.geometry.addAttribute( 'distortFlameFactor', new THREE.BufferAttribute( this.distortFlameFactor, 1 ).setDynamic( true ) );
    this.geometry.addAttribute( 'distortAlphaFactor', new THREE.BufferAttribute( this.distortAlphaFactor, 1 ).setDynamic( true ) );

    this.particleSystem = new THREE.Points( this.geometry, this.material );
    this.particleSystem.visible = false;
    this.add( this.particleSystem );
};

FireParticles.prototype.setWindVector = function(windVector)
{
    this.windVector = windVector;
   // var angleFactor = this.geometry.attributes.angleFactor.array;
    for (var v = 0; v < this.totalParticles * 3; v++) {
        var modA = Math.sqrt( this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y + this.windVector.z * this.windVector.z);
        var a = this.windVector.x / modA;
        var b = this.windVector.y / modA;
        var c = this.windVector.z / modA;
        var Rdelta = (Math.random() * (1.0 - 0.25) + 0.25);
        var zzD =  c * Rdelta * this.movementSpeed,
            xxD =  a * Rdelta * this.movementSpeed,
            yyD =  b * Rdelta * this.movementSpeed;

        this.positionsWWWW[ v * 3 + 0 ] = xxD;
        this.positionsWWWW[ v * 3 + 1 ] = yyD;
        this.positionsWWWW[ v * 3 + 2 ] = zzD;
    }
};

FireParticles.prototype.updateParticles = function(deltaTime) {

    if (this.geometry && this.particleSystem.visible) {
        this.material.uniforms.time.value = deltaTime * this.flameSpeed;
        if (this.movementSpeed > 0) {
            var sizes = this.geometry.attributes.size.array;
            var alpha = this.geometry.attributes.customAlpha.array;
            var pos = this.geometry.attributes.position.array;
            var angleFactor = this.geometry.attributes.angleFactor.array;
            for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {

                if (!this.boolEndArray[i]) {
                    pos[i3 + 0] += this.positionsWWWW[i3 + 0];
                    pos[i3 + 1] += this.positionsWWWW[i3 + 1];
                    pos[i3 + 2] += this.positionsWWWW[i3 + 2];
                    var Rend = this.endR;
                    var rPosition = Math.sqrt(Math.pow(pos[i3 + 0] + this.xCoord, 2) + Math.pow(pos[i3 + 1] + this.yCoord, 2) + Math.pow(pos[i3 + 2] + this.zCoord, 2));
                    if (rPosition > Rend) {
                        alpha[i] -= this.combustion;
                        sizes[i] -= this.combustion;
                    }

                    if (alpha[i] <= 0.0) {
                        alpha[i] = 1.0;
                        sizes[i] = this.sizesBegin[i];
                        pos[i3 + 0] = this.posBegin[i3 + 0];
                        pos[i3 + 1] = this.posBegin[i3 + 1];
                        pos[i3 + 2] = this.posBegin[i3 + 2];
                        if (this.boolEnd) {
                            this.boolEndArray[i] = true;
                        }
                    }
                    angleFactor[i] =
                        Math.acos(( 0.0 * this.windVector.x + 1.0 * this.windVector.y ) /
                            ( 1.0 * Math.sqrt(this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y) )
                        );
                    if (this.windVector.x > 0) {
                        angleFactor[i] *= 1.0;
                    } else {
                        angleFactor[i] *= -1.0;
                    }
                } else {
                    var a = this.positionsWWWW[i3 + 0];
                    var b = this.positionsWWWW[i3 + 1];
                    var c = this.positionsWWWW[i3 + 2];
                    var pulseFactorX = Math.sin(a * deltaTime ) * this.pulseFactor + 1;
                    var pulseFactorY = Math.sin(b * deltaTime ) * this.pulseFactor + 1;
                    var pulseFactorZ = Math.sin(c * deltaTime ) * this.pulseFactor + 1;
                    pos[i3 + 0] -= this.positionsWWWW[i3 + 0] * pulseFactorX;
                    pos[i3 + 1] -= this.positionsWWWW[i3 + 1] * pulseFactorY;
                    pos[i3 + 2] -= this.positionsWWWW[i3 + 2] * pulseFactorZ;
                    var Rend = this.endR*0.05;
                    var rPosition = Math.sqrt(Math.pow(pos[i3 + 0] + this.xCoord, 2) + Math.pow(pos[i3 + 1] + this.yCoord, 2) + Math.pow(pos[i3 + 2] + this.zCoord, 2));
                    if (rPosition > Rend) {
                        alpha[i] -= this.combustion * 5.0;
                        sizes[i] -= this.combustion * 5.0;
                    }

                    if (alpha[i] <= 0.0) {
                        alpha[i] = 0.0;
                        sizes[i] = this.sizesBegin[i];
                        pos[i3 + 0] = this.posBegin[i3 + 0];
                        pos[i3 + 1] = this.posBegin[i3 + 1];
                        pos[i3 + 2] = this.posBegin[i3 + 2];
                        /*this.checkNumParticles ++;
                        if (this.checkNumParticles >= this.totalParticles) {
                            this.particleSystem.visible = false;
                            this.material.uniforms['started'].value = 0;
                        }*/
                    }
                    angleFactor[i] =
                        Math.acos(( 0.0 * this.windVector.x * pulseFactorX + 1.0 * this.windVector.y * pulseFactorY ) /
                            ( 1.0 * Math.sqrt(this.windVector.x * this.windVector.x * pulseFactorX + this.windVector.y * this.windVector.y * pulseFactorY) )
                        );
                    if (this.windVector.x > 0) {
                        angleFactor[i] *= 1.0;
                    } else {
                        angleFactor[i] *= -1.0;
                    }
                }
            }
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
            this.geometry.attributes.customAlpha.needsUpdate = true;
            this.geometry.attributes.angleFactor.needsUpdate = true;
        } else {
            if (this.boolEnd) {
                var sizes = this.geometry.attributes.size.array;
                var alpha = this.geometry.attributes.customAlpha.array;
                for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {
                    alpha[i] -= this.combustion * 5.0;
                    sizes[i] -= this.combustion * 5.0;
                    if (alpha[i] <= 0.0) {
                        alpha[i] = 0.0;
                        sizes[i] = this.sizesBegin[i];
                    }
                }
                this.geometry.attributes.size.needsUpdate = true;
                this.geometry.attributes.customAlpha.needsUpdate = true;
            }
            var angleFactor = this.geometry.attributes.angleFactor.array;
            for (var i = 0; i < this.totalParticles; i++) {
                angleFactor[i] =
                    Math.acos(( 0.0 * this.windVector.x + 1.0 * this.windVector.y ) /
                        ( 1.0 * Math.sqrt(this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y) )
                    );
                if (this.windVector.x > 0) {
                    angleFactor[i] *= 1.0;
                } else {
                    angleFactor[i] *= -1.0;
                }
            }
            this.geometry.attributes.angleFactor.needsUpdate = true;
        }

     /*   var angleFactor = this.geometry.attributes.angleFactor.array;
        for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {
            angleFactor[i] =
                Math.acos(( 0.0 * this.windVector.x + 1.0 * this.windVector.y ) /
                    ( 1.0 * Math.sqrt(this.windVector.x * this.windVector.x + this.windVector.y * this.windVector.y) )
                );
            if (this.windVector.x > 0) {
                angleFactor[i] *= 1.0;
            } else {
                angleFactor[i] *= -1.0;
            }
        }
        this.geometry.attributes.angleFactor.needsUpdate = true;*/
    }
};

FireParticles.prototype.start = function()
{
    this.checkNumParticles = 0;
    this.particleSystem.visible = true;
    this.material.uniforms['started'].value = 1;
    this.boolEnd = false;
    var alpha = this.geometry.attributes.customAlpha.array;
    for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {
        alpha[i] = 1.0;
        this.boolEndArray[i] = false;
    }
    this.geometry.attributes.customAlpha.needsUpdate = true;
};

FireParticles.prototype.stop = function()
{
    this.boolEnd = true;
   /* var pos = this.geometry.attributes.position.array;
    for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {
            pos[i3 + 0] = this.posBegin[i3 + 0];
            pos[i3 + 1] = this.posBegin[i3 + 1];
            pos[i3 + 2] = this.posBegin[i3 + 2];
    }
    this.geometry.attributes.position.needsUpdate = true;*/
  //  this.particleSystem.visible = false;
  //  this.material.uniforms['started'].value = 0;
};

FireParticles.prototype.switchOff = function()
{
    this.boolEnd = true;
     var pos = this.geometry.attributes.position.array;
     for (var i = 0, i3 = 0; i < this.totalParticles; i++, i3 += 3) {
             pos[i3 + 0] = this.posBegin[i3 + 0];
             pos[i3 + 1] = this.posBegin[i3 + 1];
             pos[i3 + 2] = this.posBegin[i3 + 2];
     }
     this.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.visible = false;
    this.material.uniforms['started'].value = 0;
};