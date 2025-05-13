var NavigatorScreen = pc.createScript('navigatorScreen');

NavigatorScreen.attributes.add('textBox', {
    type: 'entity'
})

NavigatorScreen.attributes.add('module', {
    type: 'entity'
})

// initialize code called once per entity
NavigatorScreen.prototype.initialize = function () {
    this.app.on('level:accessedEarly', this.earlyLevel, this); //Register event listeners
    this.app.on('level:alreadyCompleted', this.levelCompleted, this);
    this.app.on('updatelevels', this.correctModule, this);
    this.app.on('incorrectslot', this.incorrectModule, this);
    this.app.on('dialogue:finished', this.toSpaceship, this);
    this.on('destroy', this.onDestroy, this);
    if (GlobalAttributes.prototype.getFirstNavigator()) { //Opening dialogue is only triggered on first instance of menu
        this.textBox.enabled = true;
        GlobalAttributes.prototype.disableFirstNavigator();
    }
    if (GlobalAttributes.prototype.getInsertingModule()) { //Display dialogue to tell user to slot module if at that stage
        this.displayDialogue('slottingModule' + GlobalAttributes.prototype.getCurrentType().toString());
        this.module.enabled = true;
    }
    this.moduleStart = this.module.getLocalPosition().clone(); //Returns object with x, y, z
    console.log(GlobalAttributes.prototype.getCurrentType());
};

NavigatorScreen.prototype.onDestroy = function () { //Destroy event listeners
    this.app.off('level:accessedEarly', this.earlyLevel, this);
    this.app.off('level:alreadyCompleted', this.levelCompleted, this);
    this.app.off('updatelevels', this.correctModule, this);
    this.app.off('incorrectslot', this.incorrectModule, this);
    this.app.off('dialogue:finished', this.toSpaceship, this);
}

NavigatorScreen.prototype.displayDialogue = function (dialogueName) { //Sets dialogue in text box and display it to user
    this.textBox.script.buttonDialogue.setScene(dialogueName);
    this.textBox.script.buttonDialogue.restart();
    this.textBox.enabled = true;
}

NavigatorScreen.prototype.earlyLevel = function () {
    this.displayDialogue('levelAccessedEarly');
}

NavigatorScreen.prototype.levelCompleted = function () {
    this.displayDialogue('levelAlreadyCompleted');
}

NavigatorScreen.prototype.correctModule = function () {
    if (GlobalAttributes.prototype.getEnding()) { //Trigger ending scenes if all levels have been completed
        this.displayDialogue('allModules');
    }
    else {
        this.displayDialogue('correctModule');
    }
    this.module.enabled = false;
}

NavigatorScreen.prototype.incorrectModule = function () {
    this.displayDialogue('incorrectModule');
    this.module.setLocalPosition(this.moduleStart); //Reset module position to starting position
}

NavigatorScreen.prototype.toSpaceship = function () {
    if (GlobalAttributes.prototype.getEnding()) {
        this.app.scenes.changeScene('Spaceship');
    }
}

// update code called every frame
NavigatorScreen.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// NavigatorScreen.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/