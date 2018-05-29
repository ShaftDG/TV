function SoundController(loadingManager) {
    THREE.Object3D.apply(this);
    this.name = "SoundController";

    var listener = new THREE.AudioListener();
    camera.add( listener );
    var audioLoader = new THREE.AudioLoader(loadingManager);

   /* var soundBonfire = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/bonfire.mp3', function( buffer ) {
        soundBonfire.setBuffer( buffer );
        soundBonfire.setLoop(true);
        soundBonfire.setRefDistance( 200 );
        soundBonfire.setVolume(0.3);
        soundBonfire.play();
    });
    this.add( soundBonfire );
    var soundMusic = new THREE.Audio( listener );
    audioLoader.load( 'sounds/song.ogg', function( buffer ) {
        soundMusic.setBuffer( buffer );
        soundMusic.setLoop(true);
        soundMusic.setVolume(0.05);
        soundMusic.play();
    });*/

    var soundButtonBet = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/ama_btn.mp3', function( buffer ) {
        soundButtonBet.setBuffer( buffer );
        soundButtonBet.setLoop(false);
        soundButtonBet.setRefDistance( 200 );
        soundButtonBet.setVolume(1.0);
    });
    this.soundButtonBet = soundButtonBet;
    buttonHoloBet.add(soundButtonBet);

    var soundButtonAutoplay = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/autoplay.mp3', function( buffer ) {
        soundButtonAutoplay.setBuffer( buffer );
        soundButtonAutoplay.setLoop(false);
        soundButtonAutoplay.setRefDistance( 200 );
        soundButtonAutoplay.setVolume(1.0);
    });
    this.soundButtonAutoplay = soundButtonAutoplay;
    buttonHoloAutoPlay.add(soundButtonAutoplay);

    var soundButtonStart = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/start.mp3', function( buffer ) {
        soundButtonStart.setBuffer( buffer );
        soundButtonStart.setLoop(false);
        soundButtonStart.setRefDistance( 200 );
        soundButtonStart.setVolume(0.5);
    });
    this.soundButtonStart = soundButtonStart;
    button.add(soundButtonStart);

    var soundButtonStop = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/stop.mp3', function( buffer ) {
        soundButtonStop.setBuffer( buffer );
        soundButtonStop.setLoop(false);
        soundButtonStop.setRefDistance( 200 );
        soundButtonStop.setVolume(0.7);
    });
    this.soundButtonStop = soundButtonStop;
    button.add(soundButtonStop);

    var soundWin = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/win.mp3', function( buffer ) {
        soundWin.setBuffer( buffer );
        soundWin.setLoop(false);
        soundWin.setRefDistance( 200 );
        soundWin.setVolume(0.5);
    });
    this.soundWin = soundWin;
    totalRound2D.add(soundWin);

    var soundFreespin = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/freespin.mp3', function( buffer ) {
        soundFreespin.setBuffer( buffer );
        soundFreespin.setLoop(false);
        soundFreespin.setRefDistance( 200 );
        soundFreespin.setVolume(0.5);
    });
    this.soundFreespin = soundFreespin;
    totalRound2D.add(soundFreespin);

    var soundPlazma = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/plazma.mp3', function( buffer ) {
        soundPlazma.setBuffer( buffer );
        soundPlazma.setLoop(false);
        soundPlazma.setRefDistance( 200 );
        soundPlazma.setVolume(0.5);
    });
    this.soundPlazma = soundPlazma;
    totalRound2D.add(soundPlazma);

    var soundExplode = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/explode.mp3', function( buffer ) {
        soundExplode.setBuffer( buffer );
        soundExplode.setLoop(false);
        soundExplode.setRefDistance( 200 );
        soundExplode.setVolume(0.5);
    });
    this.soundExplode = soundExplode;
    totalRound2D.add(soundExplode);

    var soundMove = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/move.mp3', function( buffer ) {
        soundMove.setBuffer( buffer );
        soundMove.setLoop(false);
        soundMove.setRefDistance( 200 );
        soundMove.setVolume(0.5);
    });
    this.soundMove = soundMove;
    totalFreeSpin.add(soundMove);

}

SoundController.prototype = Object.create(THREE.Object3D.prototype);
SoundController.prototype.constructor = SoundController;

SoundController.prototype.stopAll = function() {

        this.soundButtonBet.stop();
        this.soundButtonAutoplay.stop();
        this.soundButtonStart.stop();
        this.soundButtonStop.stop();
        this.soundWin.stop();
        this.soundFreespin.stop();
        this.soundPlazma.stop();
        this.soundExplode.stop();

};

SoundController.prototype.playButtonBet = function() {
    if (!this.soundButtonBet.isPlaying) {
        this.soundButtonBet.play();
    }
};

SoundController.prototype.playButtonAutoplay = function() {
    if (!this.soundButtonAutoplay.isPlaying) {
        this.soundButtonAutoplay.play();
    }
};

SoundController.prototype.playButtonStart = function() {
    if (!this.soundButtonStart.isPlaying) {
        this.soundButtonStart.play();
    }
};

SoundController.prototype.stopButtonStart = function() {
    this.soundButtonStart.stop();
    if (!this.soundButtonStop.isPlaying) {
        this.soundButtonStop.play();
    }
};

SoundController.prototype.playWin = function() {
    if (!this.soundWin.isPlaying) {
        this.soundWin.play();
    }
};

SoundController.prototype.playFreespin = function() {
    if (!this.soundFreespin.isPlaying) {
        this.soundFreespin.play();
    }
};

SoundController.prototype.playPlazma = function() {
    if (!this.soundPlazma.isPlaying) {
        this.soundPlazma.play();
    }
};

SoundController.prototype.playExplode = function() {
    if (!this.soundExplode.isPlaying) {
        this.soundExplode.play();
    }
};

SoundController.prototype.playMove = function() {
    if (!this.soundMove.isPlaying) {
        this.soundMove.play();
    }
};