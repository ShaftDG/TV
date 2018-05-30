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

    var soundCoins = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/coins.mp3', function( buffer ) {
        soundCoins.setBuffer( buffer );
        soundCoins.setLoop(true);
        soundCoins.setRefDistance( 200 );
        soundCoins.setVolume(0.3);
    });
    this.soundCoins = soundCoins;
    totalFreeSpin.add(soundCoins);

    var soundEndCoins = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/endCoins.mp3', function( buffer ) {
        soundEndCoins.setBuffer( buffer );
        soundEndCoins.setLoop(false);
        soundEndCoins.setRefDistance( 200 );
        soundEndCoins.setVolume(0.3);
    });
    this.soundEndCoins = soundEndCoins;
    totalFreeSpin.add(soundEndCoins);

    var soundSwitch = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/switch.mp3', function( buffer ) {
        soundSwitch.setBuffer( buffer );
        soundSwitch.setLoop(false);
        soundSwitch.setRefDistance( 200 );
        soundSwitch.setVolume(0.7);
    });
    this.soundSwitch = soundSwitch;
    totalFreeSpin.add(soundSwitch);

    var soundIntro = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/intro.mp3', function( buffer ) {
        soundIntro.setBuffer( buffer );
        soundIntro.setLoop(false);
        soundIntro.setRefDistance( 200 );
        soundIntro.setVolume(0.5);
    });
    this.soundIntro = soundIntro;
    totalFreeSpin.add(soundIntro);
}

SoundController.prototype = Object.create(THREE.Object3D.prototype);
SoundController.prototype.constructor = SoundController;

SoundController.prototype.stopAll = function() {
    if (this.soundButtonBet.isPlaying) {
        this.soundButtonBet.stop();
    }
    if (this.soundButtonAutoplay.isPlaying) {
        this.soundButtonAutoplay.stop();
    }
    if (this.soundButtonStart.isPlaying) {
        this.soundButtonStart.stop();
    }
    if (this.soundButtonStop.isPlaying) {
        this.soundButtonStop.stop();
    }
    if (this.soundWin.isPlaying) {
        this.soundWin.stop();
    }
    if (this.soundFreespin.isPlaying) {
        this.soundFreespin.stop();
    }
    if (this.soundPlazma.isPlaying) {
        this.soundPlazma.stop();
    }
    if (this.soundExplode.isPlaying) {
        this.soundExplode.stop();
    }
    if (this.soundMove.isPlaying) {
        this.soundMove.stop();
    }
    if (this.soundCoins.isPlaying) {
        this.soundCoins.stop();
    }
    if (this.soundEndCoins.isPlaying) {
        this.soundEndCoins.stop();
    }
    if (this.soundSwitch.isPlaying) {
        this.soundSwitch.stop();
    }
    if (this.soundIntro.isPlaying) {
        this.soundIntro.stop();
    }

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
    if (this.soundButtonStart.isPlaying) {
        this.soundButtonStart.stop();
    }
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
    if (this.soundWin.isPlaying) {
        this.soundWin.stop();
    }
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

SoundController.prototype.playCoins = function() {
    if (!this.soundCoins.isPlaying) {
        this.soundCoins.play();
    }
};

SoundController.prototype.playSwitch = function() {
    if (!this.soundSwitch.isPlaying) {
        this.soundSwitch.play();
    }
};

SoundController.prototype.playEndCoins = function() {
    if (!this.soundEndCoins.isPlaying && this.soundCoins.isPlaying) {
        this.soundEndCoins.play();
    }
    if (this.soundCoins.isPlaying) {
        this.soundCoins.stop();
    }
};

SoundController.prototype.playIntro = function() {
    if (!this.soundIntro.isPlaying) {
        this.soundIntro.play();
    }
};