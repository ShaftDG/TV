function MessagePartsTexture(posX, posY, posZ, textureLoader, stringPattern, col, row, stringIn,  alignment, widthCharacter, heightCharacter,  distanceBetweenCharacters) {
    THREE.Object3D.apply(this);

    this.name = "MessagePartsTexture";

    this.StartStopSwitch = false;
    this.OnOffSwitch = false;

    this.col = col;
    this.row = row;

    this.stringIn = stringIn;
    this.stringBuff = stringIn;
    this.stringPattern = stringPattern;

    this.arraySymb = arraySymbs(this.col, this.row);
    this.arrayNumbers = parseString(this.stringIn, this.stringPattern);
    this.arrayNumbersBuff = parseString(this.stringBuff, this.stringPattern);
    this.groupNumbers = new THREE.Object3D;

    this.dt = 0.0;
    this.dt1 = 0.0;
    this.RandElement = 0;

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
        geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry.attributes.uv.needsUpdate = true;

        var materialHolo =	new THREE.ShaderMaterial({
            defines         : {
                USE_HOLO      : true,
                USE_OFF_SYMB  : false,
                USE_SCANLINE  : true
            },
            uniforms: {
                colorBorderDisplay:     { value: new THREE.Color( "#111111" ) },
                //  colorClampColor:     { value: new THREE.Color( "#f0f8fd" ) },
                s_texture:   { value: textureLoader.load("textures/background/display.png") },
                f_texture:   { value: textureLoader.load("textures/winplane/numbers1.png") },
                noise_texture:   { value: textureLoader.load("textures/noise/noise.png") },
                time: { value: 0.0 },
                rateFactor:   { value: 1.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // blending:       THREE.AdditiveBlending,
            //depthTest:      false,
            //depthWrite:      false,
        } );

        materialHolo.uniforms.f_texture.value.wrapS = materialHolo.uniforms.f_texture.value.wrapT = THREE.RepeatWrapping;
        materialHolo.uniforms.s_texture.value.wrapS = materialHolo.uniforms.s_texture.value.wrapT = THREE.RepeatWrapping;

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
    this.add( this.groupNumbers );
    this.groupNumbers.position.x = this.posX + (this.arrayNumbers.length - 1) * this.widthCharacter * 0.5 + (this.arrayNumbers.length - 1) * this.distanceBetweenCharacters * 0.5;//12.8 character width; 0,7 distance between charact
////////////////////////////////////////////
    var geometry = new THREE.CylinderBufferGeometry(2, 7, 17, 8, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
    geometry.rotateZ(-Math.PI / 2.0);

    var vertexShader = shaders.vertexShaders.vertexShProjector;
    var fragmentShader = shaders.fragmentShaders.fragmentShProjector;
    this.material =	new THREE.ShaderMaterial({
        uniforms: {
            rayColor:           { value: new THREE.Color( "#00fff2" ) },
            time:               { value: 0.0 },
            rayAngleSpread:     { value: 0.0 },
            rayDistanceSpread:  { value: 20.0 },
            rayBrightness:      { value: 11.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        // blending:       THREE.AdditiveBlending,
        //depthTest:      false,
        //depthWrite:      false,
    } );
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.x = 35;
    this.add(mesh);

    var geometry = new THREE.CylinderBufferGeometry(2, 8, 20, 16, 1.0, true);
    //geometry.rotateX(-Math.PI / 2.0);
    geometry.rotateZ(Math.PI / 2.0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.x = -35;
    this.add(mesh);
////////////////////////////////////////////

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

MessagePartsTexture.prototype = Object.create(THREE.Object3D.prototype);
MessagePartsTexture.prototype.constructor = MessagePartsTexture;

MessagePartsTexture.prototype.setString = function(stringIn) {
    this.StartStopSwitch = true;

    if (stringIn.length > this.groupNumbers.children.length)
    {
         this.stringIn = stringIn.substr(0, stringIn.length - (stringIn.length - this.groupNumbers.children.length));
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
      //  this.groupNumbers.children[j].visible = false;
    }
};

MessagePartsTexture.prototype.stop = function() {
    for (var j = 0; j < this.groupNumbers.children.length; j++) {
        this.groupNumbers.children[j].visible = false;
    }
    this.StartStopSwitch = false;
    this.OnOffSwitch = false;
};

MessagePartsTexture.prototype.start = function() {
    this.OnOffSwitch = true;
    this.StartStopSwitch = true;
};

MessagePartsTexture.prototype.update = function(deltaTime) {
    this.material.uniforms.time.value += deltaTime;
        if (this.StartStopSwitch) {
            this.dt = this.dt + deltaTime;
            this.dt1 = this.dt1+ deltaTime*0.3;

         /*   if (Math.round(this.dt1*1000) % 3 == 0) {
                if (this.RandElement > this.arraySymb.length-2) {
                    this.RandElement = 0;
                } else {
                    this.RandElement = this.RandElement + 1;
                }
            }*/

            for (var j = 0; j < this.arrayNumbers.length; j++) {
             //   if (this.arrayNumbers[this.arrayNumbers.length - 1 - j] != this.arrayNumbersBuff[this.arrayNumbers.length - 1 - j]) {

                    this.arrayNumbersBuff[this.arrayNumbers.length - 1 - j] = this.arrayNumbers[this.arrayNumbers.length - 1 - j];

                    /* if (this.dt >= j) {

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
                     }*/

                    var uv = this.groupNumbers.children[this.arrayNumbers.length - 1 - j].geometry.attributes.uv.array;
                    for (var i = 0; i < uv.length; i++) {

                     //   if (this.dt < j + 1.0) {
                            // console.log("", this.RandElement);
                          //  uv[uv.length - 1 - i] = this.arraySymb[this.RandElement] [uv.length - 1 - i];
                       // }
                      //  else if (this.dt >= j) {
                            uv[uv.length - 1 - i] = this.arraySymb[this.arrayNumbers[this.arrayNumbers.length - 1 - j]] [uv.length - 1 - i];

                      //  }
                    }
                    this.groupNumbers.children[this.arrayNumbers.length - 1 - j].geometry.attributes.uv.needsUpdate = true;
                this.groupNumbers.children[this.arrayNumbers.length - 1 - j].material.uniforms.time.value += deltaTime;
                }
            }

            //by time
           /* if (this.dt >= this.groupNumbers.children.length+ 1.5) {
                this.stop();
            }*/

            //on switching
          //  if (!this.OnOffSwitch) {
          //     this.stop();
          //  }
       // }
};