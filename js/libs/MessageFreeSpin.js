function MessageFreeSpin(posX, posY, posZ, textureLoader, stringPattern, col, row, stringIn,  alignment, widthCharacter, heightCharacter,  distanceBetweenCharacters, speedSwitchNumber) {
    THREE.Object3D.apply(this);

    this.name = "MessageFreeSpin";

    this.StartStopSwitch = false;
    this.OnOffSwitch = false;
    this.resolutionPaused = false;
    this.resolutionStop = false;

    this.col = col;
    this.row = row;

    this.mixers = [];

    this.withoutSwitchNumber = false;
    this.speedSwitchNumber = speedSwitchNumber;
    if (speedSwitchNumber == 0.0) {
        this.withoutSwitchNumber = true;
    }

    this.stringIn = stringIn;
    this.stringBuff = stringIn;
    this.stringPattern = stringPattern;

    this.arraySymb = arraySymbs(this.col, this.row);
    this.arrayNumbers = parseString(this.stringIn, this.stringPattern);
    this.arrayNumbersBuff = parseString(stringIn, this.stringPattern);
    this.groupNumbers = new THREE.Object3D;

    this.deltaLenthString = 0;

    this.dt = 0.0;
    this.dt1 = 0.0;

    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;

    this.alignment = alignment;

    this.widthCharacter =widthCharacter;
    this.heightCharacter = heightCharacter;

    this.distanceBetweenCharacters = distanceBetweenCharacters;

    var vertexShader = shaders.vertexShaders.vertexShTotalHologram;
    var fragmentShader = shaders.fragmentShaders.fragmentShTotalHologram;

    for (var j = 0; j < this.arrayNumbers.length; j++ ) {
        var uv = new Float32Array( 8 );
        for (var i = 0; i < uv.length; i++) {
            uv[i] = this.arraySymb[ this.arrayNumbers[j] ] [i];
        }
        var geometry = new THREE.PlaneBufferGeometry(this.widthCharacter, this.heightCharacter);
        //   geometry.rotateX(Math.PI / 2.0);
        geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry.attributes.uv.needsUpdate = true;

        var materialHolo =	new THREE.ShaderMaterial({
            defines         : {
                USE_HOLO      : true,
                USE_OFF_SYMB  : false,
                USE_SCANLINE  : true
            },
            uniforms: {
                color: { value : new THREE.Vector3(4, 3, 2) },
                s_texture:   { value: textureLoader.load("textures/background/display.png") },
                f_texture:   { value: textureLoader.load("textures/winplane/numbers1.png") },
                noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
                time: { value: 0.0 },
                rateFactor:   { value: 1.0 },
                boolGlitch:  { value: false },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending:       THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            //depthTest:      false,
            //depthWrite:      false,
        } );

        materialHolo.uniforms.f_texture.value.wrapS = materialHolo.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
        materialHolo.uniforms.s_texture.value.wrapS = materialHolo.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;
        materialHolo.uniforms.noise_texture.value.wrapS = materialHolo.uniforms.noise_texture.value.wrapT = THREE.RepeatWrapping;

        /*  var material = new THREE.MeshBasicMaterial({
              color: "#f9eba0",
              map: textureLoader.load('textures/winplane/numbers1.png'),
              //normalMap: textureLoader.load('textures/winplane/numbers1_normal.jpg'),
              //normalScale: new THREE.Vector2(0.4, 0.4),
             // emissive: "#0e0b0b",
             // specular: "#14160f",
            //  shininess: 30
             // transparent: true,
            //  blending:       THREE.AdditiveBlending,
           //   depthWrite:      false,
             // depthTest:       false,
             // alphaTest: 0.5
          });
         // if (!isMobile) {
           //   material.normalMap = textureLoader.load('textures/winplane/numbers1_normal.jpg');
            //  material.normalScale = new THREE.Vector2(0.4, 0.4);
        //  }*/
        var mesh = new THREE.Mesh(geometry, materialHolo);
        //mesh.visible = false;
        mesh.name = "meshPlane";
        this.groupNumbers.add(mesh);
    }
    //this.groupNumbers.position.z = 123;

    this.add( this.groupNumbers );
    this.groupNumbers.position.x = this.posX + (this.arrayNumbers.length - 1) * this.widthCharacter * 0.5 + (this.arrayNumbers.length - 1) * this.distanceBetweenCharacters * 0.5;//12.8 character width; 0,7 distance between charact

///////////////////////////////////////////
    var materialCorps = new THREE.MeshStandardMaterial({
    //    color: new THREE.Color("#a5a5a5"),
      //  refractionRatio: 0.5,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_corps_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_corps_Roughness.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_corps_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_corps_Normal.png"),
        side: THREE.DoubleSide
    });
    var materialRootHand = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4f4f4f"),
        //  refractionRatio: 0.5,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Roughness.png"),
        metalness: 1.0,
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialHand1 = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4f4f4f"),
      //  refractionRatio: 0.5,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Roughness.png"),
        metalness: 1.0,
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand1_Normal.png"),
      //  side: THREE.DoubleSide
    });
    var materialHand2 = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4f4f4f"),
      //  refractionRatio: 0.05,
       // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_hand2_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand2_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand2_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hand2_Normal.png"),
      //  side: THREE.DoubleSide
    });
    var materialDisc = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4f4f4f"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_disc_1_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_disc_1_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_disc_1_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_disc_1_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialHole = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#707070"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_hole_wall_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hole_wall_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hole_wall_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_hole_wall_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialPanel = new THREE.MeshStandardMaterial({
     //   color: new THREE.Color("#7b7b7b"),
        map: textureLoader.load("textures/tv/tvCRT_monitor_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/tv/tvCRT_monitor_Roughness.png"),
        metalness: 1.0,
        roughnessMap: textureLoader.load("textures/tv/tvCRT_monitor_Roughness.png"),
        roughness: 1.0,
        normalMap: textureLoader.load("textures/tv/tvCRT_monitor_Normal.png"),
    });
/*ceiling
  left_right_walls
      column
       diagonal
       back_wall1
      back_wall2
       floor*/
    var materialCeiling = new THREE.MeshStandardMaterial({
      //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_ceiling_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_ceiling_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_ceiling_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_ceiling_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialSideWalls = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_side_walls_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_side_walls_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_side_walls_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_side_walls_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialColumn = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_column_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_column_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_column_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_column_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialDiagonal = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_diagonal_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_diagonal_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_diagonal_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_diagonal_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialBackWall1 = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall1_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall1_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall1_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall1_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialBackWall2 = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall2_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall2_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall2_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_back_wall2_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialFloor = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_floor_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_floor_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_floor_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_floor_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialTubes = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_tubes_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_tubes_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_tubes_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_tubes_Normal.png"),
        //  side: THREE.DoubleSide
    });
    var materialTable = new THREE.MeshStandardMaterial({
        //  color: new THREE.Color("#dddddd"),
        //  refractionRatio: 0.05,
        // envMap: cubeCamera.renderTarget.texture,
        metalness: 1.0,
        roughness: 1.0,
        map: textureLoader.load("textures/freespin/holoProjFreeSpin_table_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_table_Roughness.png"),
        roughnessMap: textureLoader.load("textures/freespin/holoProjFreeSpin_table_Roughness.png"),
        normalMap: textureLoader.load("textures/freespin/holoProjFreeSpin_table_Normal.png"),
        //  side: THREE.DoubleSide
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
            color: { value : new THREE.Color("#a392ff") },
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
    /////////////////////////////////////////
    var vertexShader = shaders.vertexShaders.vertexShTotalHologram;
    var fragmentShader = shaders.fragmentShaders.fragmentShTotalHologram;
    this.materialHoloFreeSpin =	new THREE.ShaderMaterial({
        defines         : {
            USE_HOLO      : true,
            USE_OFF_SYMB  : false,
            USE_SCANLINE  : true
        },
        uniforms: {
            color: { value : new THREE.Vector3(10, 3, 3) },
            s_texture:   { value: textureLoader.load("textures/background/display.png") },
            f_texture:   { value: textureLoader.load("textures/winplane/freespin.png") },
            noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            time: { value: 0.0 },
            rateFactor:   { value: 1.0 },
            boolGlitch:  { value: true },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );
    this.materialHoloFreeSpin.uniforms.f_texture.value.wrapS =  this.materialHoloFreeSpin.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialHoloFreeSpin.uniforms.s_texture.value.wrapS =  this.materialHoloFreeSpin.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;
    this.materialHoloFreeSpin.uniforms.noise_texture.value.wrapS =  this.materialHoloFreeSpin.uniforms.noise_texture.value.wrapT = THREE.RepeatWrapping;
    var materialHoloFreeSpin = this.materialHoloFreeSpin;
    ////////////////////////////////////////////
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
    var vertexShader = shaders.vertexShaders.vertexShWideScreenBackground;
    var fragmentShader = shaders.fragmentShaders.fragmentShWideScreenBackground;
    this.materialDisplay =	new THREE.ShaderMaterial({
        defines         : {
            //   USE_OFF       : false,
            //   USE_GLITCH    : false,
            USE_SCANLINE  : true,
            NUMSYMB       : 8,
            INDEX_TEXTURE : 3,
        },
        uniforms: {
            colorBorderDisplay:     { value: new THREE.Color( "#111111" ) },
            //  colorClampColor:     { value: new THREE.Color( "#f0f8fd" ) },
            arrayTexture: { value: this.arrayTexturesSymb },
            f_texture:   { value: textureLoader.load("textures/background/display.png") },
            s_texture:   { value: textureLoader.load("textures/numbers/compose.png") },
            noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
            time: { value: 0.0 },
            timeRotate: { value: 0.0 },
            rateFactor:   { value: 0.8 },
            speedFactor:   { value: 0.5 },
            boolRotate: { value: true },
            boolHolo: { value: true },
            boolOffSymb: { value: false },
            textureIndex: { value: 1.0 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // transparent: true,
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
    ///////////////////////////////////////////
    var vertexShader = shaders.vertexShaders.vertexShProjector;
    var fragmentShader = shaders.fragmentShaders.fragmentShProjector;
    this.material =	new THREE.ShaderMaterial({
        uniforms: {
            rayColor:           { value: new THREE.Color( "#0ec0ff" ) },
            time:               { value: 0.0 },
            rayAngleSpread:     { value: 0.0 },
            rayDistanceSpread:  { value: 20.0 },
            rayBrightness:      { value: 10.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );
    var material = this.material;
    var OBJobject = "holoProjFreeSpin.fbx";
    var holoParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/" + OBJobject, function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "corps") {
                    child.material = materialCorps;
                    //child.material.color = new THREE.Color("#111d5c");
                  //  child.children[0].material = material;
                } else if (child.name == "linz") {
                    child.material = materialHolo;
               //     child.visible = false;
                    //   child.material.color = new THREE.Color("#027500");
                } else if (child.name == "disc") {
                    child.material = materialHoloFreeSpin;
                 //   child.visible = false;
                    //   child.material.color = new THREE.Color("#027500");
                } else if (child.name == "disc_light") {
                    child.material = material;
                  //  child.visible = false;
                    //   child.material.color = new THREE.Color("#027500");
                } else if (child.name == "disc_inner") {
                    child.material = material;
                    //child.material.color = new THREE.Color("#ff0100");
                } else if (child.name == "root_hand") {
                    child.material = materialRootHand;
                    //child.material.color = new THREE.Color("#111013");
                } else if (child.name == "hand1") {
                    child.material = materialHand1;
                    //child.material.color = new THREE.Color("#111013");
                } else if (child.name == "hand2") {
                    child.material = materialHand2;
                  //  child.add( cubeCamera );
                   // child.material.color = new THREE.Color("#111013");
                } else if (child.name == "hole_wall") {
                    child.material = materialHole;
                   // child.material.color = new THREE.Color("#111013");
                } else if (child.name == "rotator") {
                    //child.material = material;
                    child.material.color = new THREE.Color("#111013");
                } else if (child.name == "ceiling") {
                    child.material = materialCeiling;
                } else if (child.name == "side_walls") {
                    child.material = materialSideWalls;
                } else if (child.name == "column") {
                    child.material = materialColumn;
                } else if (child.name == "diagonal") {
                    child.material = materialDiagonal;
                } else if (child.name == "back_wall1") {
                    child.material = materialBackWall1;
                } else if (child.name == "back_wall2") {
                    child.material = materialBackWall2;
                } else if (child.name == "floor") {
                    child.material = materialFloor;
                } else if (child.name == "tubes") {
                    child.material = materialTubes;
                } else if (child.name == "table") {
                    child.material = materialTable;
                } else if ( child.name == "disc0" ||
                            child.name == "disc1" ||
                            child.name == "disc2" ||
                            child.name == "disc3" ||
                            child.name == "disc4" ||
                            child.name == "disc5" ||
                            child.name == "disc6" ||
                            child.name == "disc7" ) {
                    child.material = materialDisc;
                    //child.material.color = new THREE.Color("#2e2e2e");
                } else if (child.name == "monitor" ||
                    child.name == "monitor1" ||
                    child.name == "monitor2" ||
                    child.name == "monitor3" ||
                    child.name == "monitor4" ||
                    child.name == "monitor5"
                          ) {
                    child.material = materialPanel;
                    //  child.add( cubeCamera );
                    // child.material.color = new THREE.Color("#111013");
                } else if (child.name == "display" ||
                    child.name == "display1" ||
                    child.name == "display2" ||
                    child.name == "display3" ||
                    child.name == "display4" ||
                    child.name == "display5"
                ) {
                    child.material = materialDisplay;
                    //  child.add( cubeCamera );
                    //child.material.color = new THREE.Color("#ff1400");
                } else {
                    //child.material = materialCorps;
                    child.material.color = new THREE.Color("#303030");
                }
                /*    mesh.castShadow = true;
                    //mesh.receiveShadow = true;
                    var distanceMaterial = new THREE.MeshDistanceMaterial( {
                        alphaMap: material.alphaMap,
                        alphaTest: material.alphaTest
                    } );
                    mesh.customDistanceMaterial = distanceMaterial;*/
                // console.log(object);
                holoParent.add(object);
            }
        });
    });
   // holoParent.scale.set(0.0125, 0.0125, 0.0125);
    holoParent.rotation.y = Math.PI;
  //  holoParent.position.z = -3.75;
    this.holoParent = holoParent;
    this.add(holoParent);
}

function parseString(stringIn, stringPattern) {
    var str = stringIn;
    var strPattern = stringPattern;
    var arrayPattern = [];
    var array = [];

    for (var i = 0; i < strPattern.length; i++){
        arrayPattern[i] = strPattern[i];
    }

    for (var j = 0; j < str.length; j++){
        for (var i = 0; i < strPattern.length; i++){
            if (str[j] == strPattern[i]) {
                array[j] = i;
            }
        }
    }
    return array;
}

function arraySymbs(col, row) {
    /* var arraySymb = [
        ------>-----
        |          -|
        |         - |
        |      <-   |
        |     -     |
        |  <-       |
        | -         |
        |-          |
        ------>------
        [0.0, 1.0, 0.2, 1.0, 0.0, 0.5, 0.2, 0.5],
          ...................................
    ];*/
    var Col = col;
    var Row = row;

    var RowCount = Row * Col;
    var ColCount = 8; //для развертки Plane

    var arraySymb = [];
    for (var j = 0; j < RowCount; j++ ) {
        arraySymb[j]=[];
    }
    //  console.log("arraySymb", arraySymb);
    var  x = 0.0;
    var  y = 1.0;
    /*
    [x, y,     x + 1 / Col, y,     x, y - 1/Row,     x + 1 / Row, y - 1/Row ]

        x = x + 1 / Col; //x == 0.2
        y = 1;                 //y == 1.0
    [x, y,     x + 1 / Col, y,     x, y - 1/Row,     x + 1 / Row, y - 1/Row ]

        x = x + 1 / Col; //x == 0.4
        y = 1;                 //y == 1.0
    [x, y,     x + 1 / Col, y,     x, y - 1/Row,     x + 1 / Row, y - 1/Row ]*/

    for (var j = 0; j < ColCount; j++ ) {
        ///////////////////// Col
        x = 0.0;
        y = 1.0;
        if (j % 2 == 0) {
            if ((j / 2) % 2 == 0) {
                for (var i = 0; i < RowCount; i++) {

                    // if (x >= 1.0 - 1.0 / Col) {
                    if (x >= 0.9) {
                        x = 0.0;
                    }
                    arraySymb[i] [j] = Math.round(x * 100) / 100;
                    x = x + 1.0 / Col;
                }

            } else {

                for (var i = 0; i < RowCount; i++) {

                    x = x + 1.0 / Col;

                    //if (x >= 1.0) {
                    if (x > 1.0) {
                        x = 1.0 / Col;
                    }
                    arraySymb[i] [j] = Math.round(x * 100) / 100;
                }
                // x = 1.0 / Col;
            }
            ///////////////////// Row 
        } else {

            if (j == 5 || j == 7) {
                y = y - 1 / Row;
            }
            for (var k = 0; k < RowCount; k = k + Col) {

                for (var i = 0; i < Col; i++) {

                    arraySymb[i + k] [j] = Math.round(y * 100) / 100;

                    if (i >= Col - 1.0) {

                        y = y - 1.0 / Row;

                    }
                    if (y < 0.0) {
                        y = 0.0;
                    }

                }

            }
        }
    }
    return arraySymb;
}

MessageFreeSpin.prototype = Object.create(THREE.Object3D.prototype);
MessageFreeSpin.prototype.constructor = MessageFreeSpin;

MessageFreeSpin.prototype.addAnimation = function() {

        var child = this.holoParent.children[0];
        child.mixer = new THREE.AnimationMixer(child);
        this.mixers.push(child.mixer);
        this.action = child.mixer.clipAction(child.animations[0]);
       // this.action.repetitions = 1;
        this.action.setDuration(3.5)/*.play()*/;
       // this.action.clampWhenFinished = true;
        this.action.loop = THREE.LoopOnce;
      //  this.action.loop = THREE.LoopPingPong;
    //this.action.loop = THREE.LoopRepeat;
  //  this.action.play();
};

MessageFreeSpin.prototype.startAnimation = function () {
    this.action.play();
    this.resolutionPaused = true;
};

MessageFreeSpin.prototype.stopAnimation = function () {
    this.action.stop();
    this.resolutionPaused = false;
};

MessageFreeSpin.prototype.startAnimationAfterPause = function () {
    this.action.paused = false;
    this.resolutionStop = true;
};

MessageFreeSpin.prototype.setNumber = function(number) {
    this.number = number;
    var deltaNumber = Math.abs(this.number - (this.k + 1));
    this.lengthChangeNumbers = deltaNumber.toString().length;
    this.StartStopSwitch = true;
};

MessageFreeSpin.prototype.setBeginNumber = function(number) {
    this.k = number;
};

MessageFreeSpin.prototype.setString = function(number) {
    if (number > -1) {
        this.start();
        var stringIn = number.toString();
        if (stringIn.length > this.groupNumbers.children.length) {
            var vertexShader = shaders.vertexShaders.vertexShTotalHologram;
            var fragmentShader = shaders.fragmentShaders.fragmentShTotalHologram;
            this.deltaLenthString = this.groupNumbers.children.length - stringIn.length;
            for (var j = 0; j < stringIn.length - this.groupNumbers.children.length; j++ ) {
                var uv = new Float32Array( 8 );
                for (var i = 0; i < uv.length; i++) {
                    uv[i] = this.arraySymb[ this.arrayNumbers[j] ] [i];
                }
                var geometry = new THREE.PlaneBufferGeometry(this.widthCharacter, this.heightCharacter);
                geometry.rotateX(Math.PI / 2.0);
                geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
                geometry.attributes.uv.needsUpdate = true;

                var materialHolo =	new THREE.ShaderMaterial({
                    defines         : {
                        USE_HOLO      : true,
                        USE_OFF_SYMB  : false,
                        USE_SCANLINE  : true
                    },
                    uniforms: {
                        color: { value : new THREE.Vector3(3, 4, 4) },
                        s_texture:   { value: textureLoader.load("textures/background/display.png") },
                        f_texture:   { value: textureLoader.load("textures/winplane/numbers1.png") },
                        noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
                        time: { value: 0.0 },
                        rateFactor:   { value: 1.0 }
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    transparent: true,
                    blending:       THREE.AdditiveBlending,
                    //depthTest:      false,
                    //depthWrite:      false,
                } );

                materialHolo.uniforms.f_texture.value.wrapS = materialHolo.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
                materialHolo.uniforms.s_texture.value.wrapS = materialHolo.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;
                materialHolo.uniforms.noise_texture.value.wrapS = materialHolo.uniforms.noise_texture.value.wrapT = THREE.RepeatWrapping;

                var mesh = new THREE.Mesh(geometry, materialHolo);
                mesh.name = "meshPlane";
                this.groupNumbers.add(mesh);
            }
            this.groupNumbers.position.x = this.posX + (this.arrayNumbers.length - 1) * this.widthCharacter * 0.5 +
                (this.arrayNumbers.length - 1) * this.distanceBetweenCharacters * 0.5;//12.8 character width; 0,7 distance between charact

        } else if (stringIn.length < this.groupNumbers.children.length) {
            this.stringIn = "";
            this.deltaLenthString = this.groupNumbers.children.length - stringIn.length;
            for (var i = 0; i < this.deltaLenthString; i++) {
                this.stringIn += "0";
            }
            this.stringIn += stringIn;

        } else {
            this.stringIn = stringIn;
        }

        this.arrayNumbers = parseString(this.stringIn, this.stringPattern);
        this.dt = 0.0;
        for (var j = 0; j < this.arrayNumbers.length; j++) {
            var lengthPlaneX = (this.arrayNumbers.length) * this.widthCharacter + (this.arrayNumbers.length - 1) * this.distanceBetweenCharacters;
            this.groupNumbers.children[j].position.z = this.posZ;
            this.groupNumbers.children[j].position.y = this.posY;
            this.groupNumbers.children[j].position.x = this.posX - lengthPlaneX + this.widthCharacter + (this.widthCharacter + this.distanceBetweenCharacters) * j;
            this.groupNumbers.children[j].visible = false;
        }
    }
};

MessageFreeSpin.prototype.stop = function() {
    for (var j = 0; j < this.groupNumbers.children.length; j++) {
        this.groupNumbers.children[j].visible = false;
    }
  //  for (var j = 0; j < this.rayParent.children.length; j++) {
  //      this.rayParent.children[j].visible = false;
 //   }
    this.holoParent.traverse(function (child) {
        if (child.isMesh) {
            if (child.name == "corps") {
                child.visible = true;
            } else if (child.name == "linz") {
                child.visible = true;
            } else if (child.name == "disc") {
                child.visible = false;
            } else if (child.name == "disc_light") {
                child.visible = true;
            }
        }
    });
    this.StartStopSwitch = false;
    this.OnOffSwitch = false;

};

MessageFreeSpin.prototype.start = function() {
    this.OnOffSwitch = true;
    this.StartStopSwitch = true;
   // for (var j = 0; j < this.rayParent.children.length; j++) {
   //     this.rayParent.children[j].visible = true;
   // }
    this.holoParent.traverse(function (child) {
        if (child.isMesh) {
            if (child.name == "corps") {
                child.visible = true;
            } else if (child.name == "linz") {
                child.visible = true;
            } else if (child.name == "disc") {
                child.visible = true;
            } else if (child.name == "disc_light") {
                child.visible = true;
            }
        }
    });
};

MessageFreeSpin.prototype.update = function(time, deltaTime) {
    this.material.uniforms.time.value += deltaTime;
    this.materialHolo.uniforms.time.value += deltaTime;
    this.materialHoloFreeSpin.uniforms.time.value += deltaTime;
    this.materialDisplay.uniforms.time.value = time;
    this.materialDisplay.uniforms.timeRotate.value = time;
     if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
     }

        if (this.action.time >= 1.0 && this.resolutionPaused) {
            this.action.paused = true;
            this.resolutionPaused = false;
        }

        if (this.action.time >= 2.0 && this.resolutionStop) {
            this.action.stop();
            this.resolutionStop = false;
        }

    if (this.StartStopSwitch) {

        this.setString(this.k);

        for (var j = 0; j < this.arrayNumbers.length - this.deltaLenthString; j++) {
            this.groupNumbers.children[this.arrayNumbers.length - 1 - j].visible = true;
            if (this.alignment == "centre") {
                ///CENTRE
                this.groupNumbers.position.x = this.posX + j * this.widthCharacter * 0.5 + (j) * this.distanceBetweenCharacters * 0.5;//12.8 character width; 0,7 distance between characters
            } else if (this.alignment == "left") {
                ///LEFT
                this.groupNumbers.position.x = this.posX + j * this.widthCharacter + (j) * this.distanceBetweenCharacters;//12.8 character width; 0,7 distance between characters
            } else if (this.alignment == "right") {
                ///RIGHT
                this.groupNumbers.position.x = this.posX;//12.8 character width; 0,7 distance between characters
            }
            var uv = this.groupNumbers.children[this.arrayNumbers.length - 1 - j].geometry.attributes.uv.array;
            for (var i = 0; i < uv.length; i++) {
                uv[uv.length - 1 - i] = this.arraySymb[this.arrayNumbers[this.arrayNumbers.length - 1 - j]] [uv.length - 1 - i];
            }
            this.groupNumbers.children[this.arrayNumbers.length - 1 - j].geometry.attributes.uv.needsUpdate = true;

            if (j < this.lengthChangeNumbers) {
                this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.boolGlitch.value = true;
                this.dt1 = 0.0;
            }
        }

        if (!this.withoutSwitchNumber) {
            this.dt += deltaTime;
            if (this.dt > this.speedSwitchNumber) {
                if (this.k < this.number) {
                    if (/*this.k.toString().length > 5 ||*/ this.lengthChangeNumbers > 3) {
                        this.k += 1111;
                    } else if (/*this.k.toString().length > 4 ||*/ this.lengthChangeNumbers > 2) {
                        this.k += 111;
                    } else if (/*this.k.toString().length > 2 ||*/ this.lengthChangeNumbers > 1) {
                        this.k += 11;
                    } else {
                        this.k++;
                    }
                    this.dt = 0;
                    if (this.k > this.number) {
                        this.k = this.number;
                    }
                } else if (this.k > this.number) {
                    if (/*this.k.toString().length > 5 ||*/ this.lengthChangeNumbers > 3) {
                        this.k -= 1111;
                    } else if (/*this.k.toString().length > 4 ||*/ this.lengthChangeNumbers > 2) {
                        this.k -= 111;
                    } else if (/*this.k.toString().length > 2 ||*/ this.lengthChangeNumbers > 1) {
                        this.k -= 11;
                    } else {
                        this.k--;
                    }
                    this.dt = 0;
                    if (this.k < this.number) {
                        this.k = this.number;
                    }
                } else if (this.k == this.number) {
                    this.StartStopSwitch = false;
                }
            }

        } else {
            this.k = this.number;
            for (var j = 0; j < this.arrayNumbers.length - this.deltaLenthString; j++) {
                this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.boolGlitch.value = false;
            }
        }
    }
    for (var j = 0; j < this.arrayNumbers.length - this.deltaLenthString; j++) {
        this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.time.value += deltaTime;
        if (this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.boolGlitch.value) {
            this.dt1 += deltaTime;
            if (this.dt1 > 0.5) {
                this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.boolGlitch.value = false;
                this.dt1 = 0.0;
            }
        }
    }

};