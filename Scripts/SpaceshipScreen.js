var SpaceshipScreen = pc.createScript('spaceshipScreen');

SpaceshipScreen.attributes.add('textBox', {
    type: 'entity'
})

SpaceshipScreen.attributes.add('launchButton', {
    type: 'entity'
})

// initialize code called once per entity
SpaceshipScreen.prototype.initialize = function () {
    this.app.on('dialogue:finished', this.transition, this); //Register event listeners
    this.app.on('finisheddropping', this.foundDialogue, this)
    this.on('destroy', this.onDestroy, this);
};

SpaceshipScreen.prototype.onDestroy = function () { //Destroy event listeners
    this.app.off('dialogue:finished', this.transition, this);
    this.app.off('finisheddropping', this.foundDialogue, this)
}

SpaceshipScreen.prototype.transition = function () {
    if (!GlobalAttributes.prototype.getEnding()) { //If not ending transition to tutorial once spaceship is found
        this.app.fire('ar:request:end'); //End AR session
        this.app.scenes.changeScene("Tutorial");
    }
}

SpaceshipScreen.prototype.foundDialogue = function () {
    if (GlobalAttributes.prototype.getEnding()) {
        this.textBox.script.buttonDialogue.setScene('spaceshipLaunch');
        this.textBox.script.buttonDialogue.restart();
        this.launchButton.enabled = true;
    }
    this.textBox.enabled = true;
}

// update code called every frame
SpaceshipScreen.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// SpaceshipScreen.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/