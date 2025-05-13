var TutorialScreen = pc.createScript('tutorialScreen');

// initialize code called once per entity
TutorialScreen.prototype.initialize = function () {
    this.app.on('dialogue:finished', this.transition, this); //Register listeners
    this.on('destroy', this.onDestroy, this);
};

TutorialScreen.prototype.onDestroy = function () { //Destroy listeners
    this.app.off('dialogue:finished', this.transition, this);
}

TutorialScreen.prototype.transition = function () {
    this.app.scenes.changeScene("Navigator");
}

// update code called every frame
TutorialScreen.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// TutorialScreen.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/