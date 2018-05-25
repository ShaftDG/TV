function ExplodeParticles(explodeOption, textureProvider)
{
    THREE.Object3D.apply(this);
    //////////////settings/////////
    this.movementSpeed = explodeOption.movementSpeed;
    this.beginR = explodeOption.beginRadius;
    this.endR = explodeOption.endRadius;
    this.combustion = explodeOption.combustion;
    this.pulseFactor = explodeOption.pulseFactor;
    this.totalParticles = explodeOption.totalParticles;
    this.sccaleSizeParticles = explodeOption.sccaleSizeParticles;
    //  |
    //  |
    //   -----
    this.xCoordLB = explodeOption.leftBottom.x;
    this.yCoordLB = explodeOption.leftBottom.y;

    //  -----
    //       |
    //       |
    this.xCoordRT = explodeOption.rightTop.x;
    this.yCoordRT = explodeOption.rightTop.y;
    this.zCoord = explodeOption.zCoord;
    /////////////////////////////////
    this.xlength = Math.abs(this.xCoordRT - this.xCoordLB);
    this.ylength = Math.abs(this.yCoordRT - this.yCoordLB);

    this.textureProvider = textureProvider;

    this.stringInsert = "";
    if (isMobile) {
        this.stringInsert = "mobile/";
    }
    
    this.geometry = new THREE.BufferGeometry();

    this.positionsWWWW = new Float32Array( this.totalParticles * 3 );
    this.dirs = new Float32Array( this.totalParticles * 3 );
    this.posBegin = new Float32Array( this.totalParticles * 3 );

    this.colors = new Float32Array( this.totalParticles * 3);
    this.sizes = new Float32Array( this.totalParticles);
    this.alpha = new Float32Array( this.totalParticles);

    this.color = new THREE.Color();

    var rectOutShader = ExplodeParticlesShader.getShader();
    var vertexShader = rectOutShader.vertexShader;
    var fragmentShader = rectOutShader.fragmentShader;

    this.uniforms = rectOutShader.uniforms;
    this.uniforms.color.value = new THREE.Color( "#7866ff" );
    this.uniforms.texture.value = new THREE.TextureLoader().load("textures/" + this.stringInsert + "sprites/spark13.png");

   // this.uniforms.texture.value = this.textureProvider.getTexture("spark1.png");
    //this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.MirroredRepeatWrapping;
    this.material =	new THREE.ShaderMaterial({ uniforms: this.uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending:       THREE.AdditiveBlending,
        depthWrite:      false,
    } );

    for ( var i = 0, i3 = 0; i < this.totalParticles; i ++, i3 += 3 ) {

        var Rbegin = ((Math.random() * Math.tan(((this.beginR + 10) - this.beginR)) + this.beginR));
        var T = Math.random() * 2 * Math.PI;
        var F = Math.random() * 2 * Math.PI;

        var xx0 = this.xCoordLB,
            yy0 = this.yCoordLB,
            zz0 = 0;
        //Sphere
    /*    var xx = xx0 + Math.cos(T) * Math.cos(F) * Rbegin,
            yy = yy0 + Math.cos(T) * Math.sin(F) * Rbegin,
            zz = zz0 + Math.sin(F) * Rbegin;*/

        //Circle
        var xx = xx0 + Math.cos(F) * Rbegin,
            yy = yy0 + Math.sin(F) * Rbegin,
            zz = zz0;
        this.posBegin[ i3 + 0 ] = xx;
        this.posBegin[ i3 + 1 ] = yy;
        this.posBegin[ i3 + 2 ] = zz;

        this.dirs[ i3 + 0 ] = xx;
        this.dirs[ i3 + 1 ] = yy;
        this.dirs[ i3 + 2 ] = zz;

        var Rdelta = Math.random();
        //Sphere
       /* var xxD =  Math.cos(T) * Math.cos(F) * Rdelta,
            yyD =  Math.cos(T) * Math.sin(F) * Rdelta,
            zzD =  Math.sin(F) * Rdelta;*/
        //Circle
        var xxD =  Math.cos(F) * Rdelta * this.movementSpeed,
            yyD =  Math.sin(F) * Rdelta * this.movementSpeed,
            zzD =  0;

        this.positionsWWWW[ i3 + 0 ] = xxD ;
        this.positionsWWWW[ i3 + 1 ] = yyD ;
        this.positionsWWWW[ i3 + 2 ] = zzD ;
       // this.color.setHSL( i / this.totalParticles, 1.0, 0.5 );
        this.color.setHSL( (Math.random() * (0.2 - 0.1) + 0.1), 0.7, (Math.random() * (0.8 - 0.6) + 0.6) );

        this.colors[ i3 + 0 ] = this.color.r;
        this.colors[ i3 + 1 ] = this.color.g;
        this.colors[ i3 + 2 ] = this.color.b;

        //this.sizes[ i ] = Math.random() * (this.sccaleSizeParticles - this.sccaleSizeParticles/2) + this.sccaleSizeParticles/2;
        this.sizes[ i ] = Math.random() * this.sccaleSizeParticles;
        this.alpha[ i ] = 1.0;

    }

    this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.dirs, 3 ) );
    this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
    this.geometry.addAttribute( 'customAlpha', new THREE.BufferAttribute( this.alpha, 1 ) );
    this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );


    this.particleSystem = new THREE.Points( this.geometry, this.material );
    this.particleSystem.visible = false;
    this.add( this.particleSystem );
}

ExplodeParticles.prototype = Object.create(THREE.Object3D.prototype);
ExplodeParticles.prototype.constructor = ExplodeParticles;

/*
 * set value [0..1]
 */

ExplodeParticles.prototype.updateParticles = function(time, deltaTime)
{
    this.uniforms.deltatime.value += deltaTime;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.customAlpha.needsUpdate = true;

 //   var sizes = this.geometry.attributes.size.array;
    var alpha = this.geometry.attributes.customAlpha.array;
    var pos = this.geometry.attributes.position.array;
    var totalParticles = 0;
    for ( var i = 0, i3 = 0; i < this.totalParticles; i ++, i3 += 3 )  {

        var a = this.positionsWWWW[i3 + 0] + 1 ;
        var b = this.positionsWWWW[i3 + 1] + 1 ;
        var c = this.positionsWWWW[i3 + 2] + 1 ;
        var pulseFactorX = Math.sin(a * time) * this.pulseFactor + 1;
        var pulseFactorY = Math.sin(b * time) * this.pulseFactor + 1;
        var pulseFactorZ = Math.sin(c * time) * this.pulseFactor + 1;
      //  sizes[ i ] = pulseFactorX * ( 1 + Math.sin( 0.5 * i + time ) );
        //sizes[ i ] = this.sccaleSizeParticles * ( 1 + Math.sin( 0.5 * i + time ) );
        pos[i3 + 0] += this.positionsWWWW[i3 + 0]* pulseFactorX;
        pos[i3 + 1] += this.positionsWWWW[i3 + 1]* pulseFactorY;
        pos[i3 + 2] += this.positionsWWWW[i3 + 2]* pulseFactorZ;

        var Rend = (Math.random() * ((this.endR + 10) - this.endR ) + this.endR);
        var rPosition = Math.sqrt(Math.pow(pos[i3 + 0]-this.xCoordLB, 2) + Math.pow(pos[i3 + 1]-this.yCoordLB, 2));
        if(rPosition > Rend)
            alpha[ i ] -= this.combustion;
        else
            alpha[ i ] -= this.combustion * 0.08;
        if (alpha[i] <= 0){
            pos[i3 + 0] = this.posBegin[ i3 + 0 ];
            pos[i3 + 1] = this.posBegin[ i3 + 1 ];
            pos[i3 + 2] = this.posBegin[ i3 + 2 ];
            totalParticles++;
            if (totalParticles >= this.totalParticles) {
                this.stop();
            }
        }
    }
    this.geometry.attributes.position.needsUpdate = true;
  //  this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.customAlpha.needsUpdate = true;
};

ExplodeParticles.prototype.start = function()
{
    this.particleSystem.visible = true;
    var alpha = this.geometry.attributes.customAlpha.array;
    for ( var i = 0, i3 = 0; i < this.totalParticles; i ++, i3 += 3 )  {
            alpha[ i ] = 1.0;
    }
    this.geometry.attributes.customAlpha.needsUpdate = true;
    this.uniforms['started'].value = 1;
};

ExplodeParticles.prototype.stop = function()
{
    this.uniforms['started'].value = 0;
    this.particleSystem.visible = false;
};