function SunLight(loadingManager, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "SunLight";

    this.stringInsert = "";
    if (isMobile) {
        this.stringInsert = "mobile/";
    }

    //Ambient light
    this.ambient = new THREE.AmbientLight( "#76796f" );
    this.add( this.ambient );
    //Hemisphere light
   /* var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.0 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 50 );
    this.add( hemiLight );*/
    //Directional light
    this.isMobile = isMobile;
    if (this.isMobile) {
        var roomPointlight = new THREE.PointLight("#fdffd5", 3.0, 250, 2);
        roomPointlight.position.set(0, 0, 150);
        this.add(roomPointlight);
       /* this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        this.dirLight.name = "this.dirLight";
        //  this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.castShadow = true;
        this.dirLight.shadowMapSoft = true;
        this.dirLight.shadow.mapSize.width = 1024;
        this.dirLight.shadow.mapSize.height = 1024;
        var d = 5;
        this.dirLight.shadow.camera.fov = 60;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 800;
        //this.dirLight.shadow.bias = -0.0001;
        this.add(this.dirLight);*/

        /* var rightPointlight = new THREE.PointLight( "#ffffff", 0.5, 350, 2 );
         rightPointlight.position.set( 50, 50, 150 );
         this.add( rightPointlight );*/

        //  var leftPointlight = new THREE.PointLight( "#ffffff", 1.5, 350, 2 );
        // leftPointlight.position.set( -50, 50, 150 );
        //  this.add( leftPointlight );
    } else {
        var roomPointlight = new THREE.PointLight("#fdffd5", 2.5, 250, 2);
        roomPointlight.position.set(0, 0, 150);
        this.add(roomPointlight);

        this.buttonStartPointlight = new THREE.PointLight("#4aff5d", 1.0, 100, 2);
        this.buttonStartPointlight.castShadow = true;
        this.buttonStartPointlight.shadow.camera.near = 1;
        this.buttonStartPointlight.shadow.camera.far = 500;
        this.buttonStartPointlight.shadow.bias = - 0.005;
        this.buttonStartPointlight.position.set(60, -25, 15);
        this.add(this.buttonStartPointlight);

        var roomPointlight = new THREE.PointLight("#fdffd5", 1.0, 100, 2);
        roomPointlight.position.set(-65, 64, -40);
        roomPointlight.castShadow = true;
        roomPointlight.shadow.camera.near = 1;
        roomPointlight.shadow.camera.far = 500;
        roomPointlight.shadow.bias = - 0.005;
        this.add(roomPointlight);

        var materialBase = new THREE.MeshStandardMaterial({
            //  color: new THREE.Color("#dddddd"),
            //  refractionRatio: 0.05,
            // envMap: cubeCamera.renderTarget.texture,
            metalness: 1.0,
            roughness: 1.0,
            map: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Base_Color.png"),
            metalnessMap: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Metallic.png"),
            roughnessMap: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Roughness.png"),
            normalMap: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Normal.png"),
            bumpMap: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Height.png"),
            aoMap: textureLoader.load("textures/" + this.stringInsert + "freespin/base_Mixed_AO.png")
            //  side: THREE.DoubleSide
        });
        var materialArc = new THREE.MeshStandardMaterial({
            //  color: new THREE.Color("#dddddd"),
            //  refractionRatio: 0.05,
            // envMap: cubeCamera.renderTarget.texture,
            metalness: 1.0,
            roughness: 1.0,
            map: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Base_Color.png"),
            metalnessMap: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Metallic.png"),
            roughnessMap: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Roughness.png"),
            normalMap: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Normal.png"),
            bumpMap: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Height.png"),
            aoMap: textureLoader.load("textures/" + this.stringInsert + "freespin/arc_Mixed_AO.png")
            //  side: THREE.DoubleSide
        });
        var materialLamp = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#f1e8d9"),
            //  emissive: new THREE.Color("#fff3e7"),
            //  emissiveIntensity: 0.25,
        });

    var OBJobject = "lamp.fbx";
    var holoParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/" + OBJobject, function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "base") {
                    child.material = materialBase;
                } else if (child.name == "arc") {
                    child.material = materialArc;
                } else if (child.name == "lamp") {
                    child.material = materialLamp;
                } else {
                    child.material.color = new THREE.Color("#303030");
                }
                holoParent.add(object);
            }
        });
    });
    holoParent.position.copy(roomPointlight.position);
    this.holoParent = holoParent;
    this.add(holoParent);
        // var geometry = new THREE.SphereBufferGeometry(3, 8, 8);
      /*  var geometry = new THREE.BoxBufferGeometry(16, 1, 24);
        var material = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#c4bab0"),
          //  emissive: new THREE.Color("#fff3e7"),
          //  emissiveIntensity: 0.25,
        });
        var lamp = new THREE.Mesh(geometry, material);
        lamp.position.copy(roomPointlight.position);
        lamp.position.y += 1.5;
        this.add(lamp);

        var geometry = new THREE.PlaneBufferGeometry(23, 36);
        geometry.rotateX(Math.PI/2.0);
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#c4bab0"),
            map: textureLoader.load("textures/" + this.stringInsert + "sprites/glow.png"),
          //  emissive: new THREE.Color("#fff3e7"),
         //   emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.8
        });
        var lamp = new THREE.Mesh(geometry, material);
        lamp.position.copy(roomPointlight.position);
      //  lamp.position.x += 0.2;
        lamp.position.y += 1.5;
        this.add(lamp);

        var geometry = new THREE.BoxBufferGeometry(16, 1, 24);
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#c4bab0"),
         //   emissive: new THREE.Color("#fff3e7"),
          //  emissiveIntensity: 1.0,
        });
        var lamp = new THREE.Mesh(geometry, material);
        lamp.position.copy(roomPointlight.position);
        lamp.position.z += 50;
        lamp.position.y += 1.75;
        this.add(lamp);

        var geometry = new THREE.PlaneBufferGeometry(23, 36);
        geometry.rotateX(Math.PI/2.0);
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#c4bab0"),
            map: textureLoader.load("textures/" + this.stringInsert + "sprites/glow.png"),
          //  emissive: new THREE.Color("#fff3e7"),
          //  emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.8
        });
        var lamp = new THREE.Mesh(geometry, material);
        lamp.position.copy(roomPointlight.position);
      //  lamp.position.x += 0.2;
        lamp.position.y += 1.5;
        lamp.position.z += 50;
        this.add(lamp);*/

        var totalRoundPointlight = new THREE.PointLight("#5dfff7", 1.5, 100, 2);
        totalRoundPointlight.position.set(0, 45, 70);
        this.add(totalRoundPointlight);

        this.totalScorePointlight = new THREE.PointLight("#ff5f58", 1.0, 100, 2);
        this.totalScorePointlight.position.set(0, -42, 70);
        this.add(this.totalScorePointlight);

        var totalBetPointlight = new THREE.PointLight("#f9adff", 1.0, 50, 2);
        totalBetPointlight.position.set(-65, -23, 10);
        this.add(totalBetPointlight);
    }

//Create a helper for the shadow camera (optional)
   /*  var helper = new THREE.CameraHelper( this.dirLight.shadow.camera );
     this.add( helper );*/
}

SunLight.prototype = Object.create( THREE.Object3D.prototype );
SunLight.prototype.constructor = SunLight;

SunLight.prototype.setStopButtonlight = function () {
    if (!this.isMobile) {
        this.buttonStartPointlight.color = new THREE.Color("#ff6e58");
    }
};

SunLight.prototype.setStartButtonlight = function () {
    if (!this.isMobile) {
        this.buttonStartPointlight.color = new THREE.Color("#4aff5d");
    }
};

SunLight.prototype.setPositionTotalScorelight = function ( position ) {
    if (!this.isMobile) {
        this.totalScorePointlight.position.copy(position);
        this.totalScorePointlight.position.z += 30;
    }
};

SunLight.prototype.updateWithTime = function ( time ) {

   /* this.dirLight.position.x = Math.sin(time) * Math.sin(70*Math.PI/180) * 100;
    this.dirLight.position.y = Math.cos(time) * 100;
    this.dirLight.position.z = Math.sin(time) * Math.cos(70*Math.PI/180) * 100;*/

};