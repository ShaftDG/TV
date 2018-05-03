function MessageBet(posX, posY, posZ, textureLoader, stringPattern, col, row, stringIn,  alignment, widthCharacter, heightCharacter,  distanceBetweenCharacters, speedSwitchNumber) {
    THREE.Object3D.apply(this);

    this.name = "MessageBet";

    this.StartStopSwitch = false;
    this.OnOffSwitch = false;

    this.col = col;
    this.row = row;

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
    this.groupNumbers.position.z = 6.5;
    this.add( this.groupNumbers );
    this.groupNumbers.position.x = this.posX + (this.arrayNumbers.length - 1) * this.widthCharacter * 0.5 + (this.arrayNumbers.length - 1) * this.distanceBetweenCharacters * 0.5;//12.8 character width; 0,7 distance between charact

///////////////////////////////////////////
    var materialCorps = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a5a5a5"),
        map: textureLoader.load("textures/holoProj/holoProj_corps_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/holoProj/holoProj_corps_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/holoProj/holoProj_corps_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/holoProj/holoProj_corps_Normal.png"),
    });
    var materialCorpsLinz = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a5a5a5"),
        map: textureLoader.load("textures/holoProj/holoProj_corpsLinz_BaseColor.png"),
        metalnessMap: textureLoader.load("textures/holoProj/holoProj_corpsLinz_Metallic.png"),
        metalness: 0.5,
        roughnessMap: textureLoader.load("textures/holoProj/holoProj_corpsLinz_Roughness.png"),
        roughness: 0.5,
        normalMap: textureLoader.load("textures/holoProj/holoProj_corpsLinz_Normal.png"),
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
    var OBJobject = "holoProjBet.obj";
    var holoParent = new THREE.Object3D;
    var loaderOBJ = new THREE.OBJLoader( loadingManager );
    loaderOBJ.load("obj/" + OBJobject, function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "corps") {
                    child.material = materialCorps;
                    //child.material.color = new THREE.Color("#111d5c");
                } else if (child.name == "linz") {
                    child.material = materialHolo;
                    //   child.material.color = new THREE.Color("#027500");
                } else if (child.name == "corpsLinz") {
                    child.material = materialCorpsLinz;
                    child.material.color = new THREE.Color("#377075");
                } else {
                    child.material.color = new THREE.Color("#ff0100");
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
    holoParent.scale.set(1.0, 1.0, 1.0);
   // holoParent.rotation.z = Math.PI / 2.0;
    holoParent.position.z = -3.75;
    //  this.holoParent = holoParent;
    this.add(holoParent);
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
        // side: THREE.DoubleSide,
        blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );
    ////////////////////////////////////////////
    var geometry = new THREE.CylinderBufferGeometry(2, 7, 10, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
  //  geometry.rotateZ(-Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = 14.5-10;
    mesh.position.z = 6.5;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(2, 10, 7, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
   // geometry.rotateZ(-Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = 14.5-8.5;
    mesh.position.z = 6.5;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(2, 12, 5, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
  //  geometry.rotateZ(-Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = 14.5-7.5;
    mesh.position.z = 6.5;
    this.add(mesh);
    ////////////////////////////////////////////
    var geometry = new THREE.CylinderBufferGeometry(2, 7, 10, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
    geometry.rotateZ(-Math.PI);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = -14.5+10;
    mesh.position.z = 6.5;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(2, 10, 7, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
    geometry.rotateZ(-Math.PI);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = -14.5+8.5;
    mesh.position.z = 6.5;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(2, 12, 5, 10, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
    geometry.rotateZ(-Math.PI);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = -14.5+7.5;
    mesh.position.z = 6.5;
    this.add(mesh);

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

MessageBet.prototype = Object.create(THREE.Object3D.prototype);
MessageBet.prototype.constructor = MessageBet;

MessageBet.prototype.setNumber = function(number) {
    this.number = number;
    var deltaNumber = Math.abs(this.number - (this.k + 1));
    this.lengthChangeNumbers = deltaNumber.toString().length;
    this.StartStopSwitch = true;
};

MessageBet.prototype.setBeginNumber = function(number) {
    this.k = number;
};

MessageBet.prototype.setString = function(number) {
    if (number > -1) {
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

MessageBet.prototype.stop = function() {
    for (var j = 0; j < this.groupNumbers.children.length; j++) {
        this.groupNumbers.children[j].visible = false;
    }
    this.StartStopSwitch = false;
    this.OnOffSwitch = false;
};

MessageBet.prototype.start = function() {
    this.OnOffSwitch = true;
    this.StartStopSwitch = true;
};

MessageBet.prototype.update = function(deltaTime) {
    this.material.uniforms.time.value += deltaTime;
    this.materialHolo.uniforms.time.value += deltaTime;
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