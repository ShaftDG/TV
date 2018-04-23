function Button3D(textureLoader, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "Button3D";
    this.textureLoader = textureLoader;

    this.mixers = [];
    var buttonParent = new THREE.Object3D;
    var loaderOBJ = new THREE.FBXLoader( loadingManager );
    loaderOBJ.load("obj/button.fbx", function (object) {

        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.name == "corps") {
                    child.material.color = new THREE.Color("#000000");
                } else if (child.name == "button") {
                    child.material.color = new THREE.Color("#00830d");
                } else {
                    child.material.color = new THREE.Color("#ff1309");
                }
                buttonParent.add(object);
            }
        });
    });
    //  tvParent.position.y = -0.3;
    this.buttonParent = buttonParent;
    this.add(buttonParent);
}

Button3D.prototype = Object.create(THREE.Object3D.prototype);
Button3D.prototype.constructor = Button3D;

Button3D.prototype.addAnimation = function() {

    var child = this.buttonParent.children[0];
    child.mixer = new THREE.AnimationMixer(child);
    this.mixers.push(child.mixer);
    this.action = child.mixer.clipAction(child.animations[0]);
    // this.action.repetitions = 1;
    this.action.setDuration(0.4);
    this.action.clampWhenFinished = true;
    this.action.loop = THREE.LoopOnce;
    //  this.action.loop = THREE.LoopPingPong;    
};

Button3D.prototype.start = function()
{
    this.action.stop();
    this.action.play();
};

Button3D.prototype.setTexture = function(button)
{

};

Button3D.prototype.stop = function()
{
    this.action.stop();
};

Button3D.prototype.updateWithTime = function(deltaTime)
{

    if ( this.mixers.length > 0 ) {
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( deltaTime );

        }
    }


};