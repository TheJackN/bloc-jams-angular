(function (){
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    var currentAlbum = Fixtures.getAlbum();

    /*
    @desc Buzz object audio file
    @type {Object}
    */
    var currentBuzzObject = null;

    /*
    @function setSong
    @desc Stops currently playing song and loads new audio file as currentBuzzObject
    @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
      currentBuzzObject.setVolume(SongPlayer.volume);
    };

    /*
    @function playSong
    @desc plays currentBuzzObject and sets playing attribute to true
    @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      SongPlayer.currentSong.playing = true;
    };

    var stopSong = function(song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /*
    @desc Get song index for next and previous functionality
    @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /*
    @desc Active song object from list of songs
    @type {Object}
    */
    SongPlayer.currentSong = null;

    /*
    @desc Current playback time (in seconds) of currently playing song
    @type {Number}
    */
    SongPlayer.currentTime = null;

    /*
    @desc Current volume of currently playing song
    @type {Number}
    */
    SongPlayer.volume = 75;

    /*
    @function play
    @desc Play current or new song
    @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);

      } else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
              playSong(song);
          }
      }
    };

    /*
    @function pause
    @desc Pause current song
    @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /*
    @function previous
    @desc navigate to previous song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex >= currentAlbum.songs.length) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /*
      @function setCurrentTime
      @desc Set current time (in seconds) of currently playing song
      @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
          currentBuzzObject.setTime(time);
      }
    };

    /*
      @function setVolume
      @desc Set Volume of currently playing song
      @param {Number} volume
    */
    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
          currentBuzzObject.setVolume(volume);
          SongPlayer.volume = volume;
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
