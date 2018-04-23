function SunLight(loadingManager, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "SunLight";

    //Ambient light
    this.ambient = new THREE.AmbientLight( "#9fb5b6" , 1.0 );
    this.add( this.ambient );
    //Hemisphere light
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.25 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    this.add( hemiLight );
    //Directional light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 3.0);
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
    this.add( this.dirLight );

//Create a helper for the shadow camera (optional)
   /*  var helper = new THREE.CameraHelper( this.dirLight.shadow.camera );
     this.add( helper );*/
}

SunLight.prototype = Object.create( THREE.Object3D.prototype );
SunLight.prototype.constructor = SunLight;

SunLight.prototype.updateWithTime = function ( time ) {

   /* this.dirLight.position.x = Math.sin(time) * Math.sin(70*Math.PI/180) * 100;
    this.dirLight.position.y = Math.cos(time) * 100;
    this.dirLight.position.z = Math.sin(time) * Math.cos(70*Math.PI/180) * 100;*/

};