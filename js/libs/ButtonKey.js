function ButtonKey(posX, posY, posZ, direction, textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "ButtonKey";
    this.textureLoader = textureLoader;

    this.stringInsert = "";
    if (isMobile) {
        this.stringInsert = "mobile/";
    }
    
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;

    this.started = false;
    this.swicthed = false;

    var geometry = new THREE.PlaneGeometry(40, 40, 0, 0);
    var geometry1 = new THREE.PlaneGeometry(40, 40, 0, 0);

    var color = new THREE.Color("#1357d9");
    var materialPhong = new THREE.MeshPhongMaterial({
        color: color
    });

    var color1 = new THREE.Color("#d0d9d9");
    var materialPhong1 = new THREE.MeshPhongMaterial({
       // normalMap: this.textureLoader.textureButton[2],
       // depthWrite: false,
        alphaTest:0.5,
       // depthTest: false,
        //map: backTex,
          color: color1,
        // transparent: true
        // wireframe: true
    });

    this.startTexture = this.textureLoader.load("textures/" + this.stringInsert + "button/start.png");
    this.stopTexture = this.textureLoader.load("textures/" + this.stringInsert + "button/stop.png");
    this.fullscreenTexture = this.textureLoader.load("textures/" + this.stringInsert + "button/buttonFullScreen.png");
    this.fullscreenCancelTexture = this.textureLoader.load("textures/" + this.stringInsert + "button/buttonFullScreenCancel.png");

    if (direction == "start") {
        materialPhong1.map = this.startTexture;
    } else if (direction == "fullscreen")  {
        materialPhong1.map = this.fullscreenTexture;
    } else {
        materialPhong1.map = this.startTexture;
    }


/*    if (direction == "fullscreen")  {
        materialPhong1.map = this.textureLoader.textureButton[3];
    } else if (direction == "start") {
        materialPhong1.map = this.textureLoader.textureButton[0];
    } else if (direction == "3d") {
        materialPhong1.map = this.textureLoader.textureButton[5];
    } else if (direction == "daynight") {
        materialPhong1.map = this.textureLoader.textureButton[7];
    }*/
/*
    this.mesh = new THREE.Mesh( geometry, materialPhong );
    //  this.mesh.visible = false;
    this.mesh.position.z = this.posZ;
    this.mesh.position.y = this.posY;
    this.mesh.position.x = this.posX;

    this.mesh.scale.set(0.7, 0.7, 0.7);
    this.mesh.name = "case";
    //  this.mesh.rotation.y = 0.5;*/

    this.mesh1 = new THREE.Mesh( geometry1, materialPhong1 );
    // this.mesh1.visible = false;
    this.mesh1.position.z = this.posZ+10;
    this.mesh1.position.y = this.posY;
    this.mesh1.position.x = this.posX;
   // this.mesh1.scale.set(0.7, 0.7, 0.7);

    // this.mesh1.rotation.z = -0.5;
   // this.mesh1.rotation.x = 1.57;
   // this.mesh1.rotation.y = 1.57;
    this.mesh1.name = "button";

    //this.add( this.mesh );
    this.add( this.mesh1 );
}

ButtonKey.prototype = Object.create(THREE.Object3D.prototype);
ButtonKey.prototype.constructor = ButtonKey;

ButtonKey.prototype.start = function()
{
    //   this.mesh.visible = true;
    //  this.mesh1.visible = true;

    this.started = true;
};

ButtonKey.prototype.setTexture = function(button)
{
    if (button == "start") {
        this.mesh1.material.map = this.startTexture;
    } else if (button == "stop") {
        this.mesh1.material.map = this.stopTexture;
    } else if (button == "fullscreen") {
        this.mesh1.material.map = this.fullscreenTexture;
    } else if (button == "fullscreencancel") {
        this.mesh1.material.map = this.fullscreenCancelTexture;
    }
    this.mesh1.material.map.needsUpdate = true;
};

ButtonKey.prototype.stop = function()
{

};

ButtonKey.prototype.update = function(deltatime)
{
    if (this.started) {

        if (!this.swicthed) {
            if (this.mesh1.position.z >= 1.05 + this.posZ) {
                this.mesh1.position.z -= deltatime * 18.5;
            } else if (this.mesh1.position.z <= 1.025) {
                this.mesh1.position.z -= deltatime * 5.5 ;
            }

            if (this.mesh1.position.z <= 1.1 + this.posZ) {
                //this.mesh1.position.z = -1;
                this.swicthed = true;
            }
        } else {
            this.mesh1.position.z += deltatime * 50.5;
            if (this.mesh1.position.z >= this.posZ + 10) {
                this.mesh1.position.z = this.posZ + 10;
                //this.mesh1.position.z = -1;
                this.started = false;
                this.swicthed = false;
            }
        }
    }


};