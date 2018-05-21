function SunLight(loadingManager, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "SunLight";

    //Ambient light
    this.ambient = new THREE.AmbientLight( "#9fb5b6" , 1.0 );
    this.add( this.ambient );
    //Hemisphere light
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 50 );
    this.add( hemiLight );
    //Directional light
    this.isMobile = isMobile;
    if (this.isMobile) {
        this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
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
        this.add(this.dirLight);

        /* var rightPointlight = new THREE.PointLight( "#ffffff", 0.5, 350, 2 );
         rightPointlight.position.set( 50, 50, 150 );
         this.add( rightPointlight );*/

        //  var leftPointlight = new THREE.PointLight( "#ffffff", 1.5, 350, 2 );
        // leftPointlight.position.set( -50, 50, 150 );
        //  this.add( leftPointlight );
    } else {
        this.buttonStartPointlight = new THREE.PointLight("#8dff94", 1.5, 200, 2);
        this.buttonStartPointlight.position.set(60, -25, 15);
        this.add(this.buttonStartPointlight);

        var roomPointlight = new THREE.PointLight("#fdffd5", 1.5, 200, 2);
        roomPointlight.position.set(-65, 65, -70);
        this.add(roomPointlight);

        var totalRoundPointlight = new THREE.PointLight("#5dfff7", 1.5, 100, 2);
        totalRoundPointlight.position.set(0, 45, 70);
        this.add(totalRoundPointlight);

        this.totalScorePointlight = new THREE.PointLight("#ff5f58", 1.5, 100, 2);
        this.totalScorePointlight.position.set(0, -42, 70);
        this.add(this.totalScorePointlight);

        var totalBetPointlight = new THREE.PointLight("#f9adff", 1.5, 50, 2);
        totalBetPointlight.position.set(-65, -23, 10);
        this.add(totalBetPointlight);

      // var geometry = new THREE.SphereBufferGeometry(3, 8, 8);
        var geometry = new THREE.BoxBufferGeometry(16, 1, 24);
        var material = new THREE.MeshPhongMaterial({color: new THREE.Color("#fff3e7")});
        this.ball = new THREE.Mesh(geometry, material);
        this.ball.position.copy(roomPointlight.position);
        this.add(this.ball);
    }

//Create a helper for the shadow camera (optional)
   /*  var helper = new THREE.CameraHelper( this.dirLight.shadow.camera );
     this.add( helper );*/
}

SunLight.prototype = Object.create( THREE.Object3D.prototype );
SunLight.prototype.constructor = SunLight;

SunLight.prototype.setStopButtonlight = function () {
    if (!this.isMobile) {
        this.buttonStartPointlight.color = new THREE.Color("#ffa498");
    }
};

SunLight.prototype.setStartButtonlight = function () {
    if (!this.isMobile) {
        this.buttonStartPointlight.color = new THREE.Color("#8dff94");
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