function FlameBonfire(optionsFire, loadingManager, isMobile) {
    THREE.Object3D.apply(this);
    this.name = "FlameBonfire";

    this.tonguesOfFireParticles = new FireParticles(optionsFire.optionsTonguesOfFireParticles, textureLoader);
    this.tonguesOfFireParticles.name = "tonguesOfFireParticles";
    this.add(this.tonguesOfFireParticles);

    this.originFireParticles = new FireParticles(optionsFire.optionsOriginFireParticles, textureLoader);
    this.originFireParticles.name = "originFireParticles";
    this.add(this.originFireParticles);
}

FlameBonfire.prototype = Object.create( THREE.Object3D.prototype );
FlameBonfire.prototype.constructor = FlameBonfire;

FlameBonfire.prototype.addFlame = function ( geometryBonfire, windVector ) {
    this.originFireParticles.addFire( geometryBonfire, windVector );
    this.tonguesOfFireParticles.addFire( geometryBonfire, windVector );
    //this.tonguesOfFireParticles.start();
    //this.originFireParticles.start();
};

FlameBonfire.prototype.setWindVector = function(windVector)
{
    this.originFireParticles.setWindVector(windVector);
    this.tonguesOfFireParticles.setWindVector(windVector)
};

FlameBonfire.prototype.stop = function () {
    this.tonguesOfFireParticles.stop();
    this.originFireParticles.stop();
};

FlameBonfire.prototype.start = function () {
    this.tonguesOfFireParticles.start();
    this.originFireParticles.start();
};

FlameBonfire.prototype.updateWithTime = function ( time ) {

    this.tonguesOfFireParticles.updateParticles( time );
    this.originFireParticles.updateParticles( time );

};