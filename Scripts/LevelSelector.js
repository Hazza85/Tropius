var LevelSelector = pc.createScript('levelSelector');

LevelSelector.attributes.add('type', {
    type: 'number'
})

// initialize code called once per entity
LevelSelector.prototype.initialize = function () {
    this.isHovered = false;
    this.disabled = false;
    this.entity.button['on']('click', this.selected, this); //Register event listeners
    this.app.on('modulestop', this.matchCheck, this);
    this.app.on('updatelevels', this.refresh, this);
    this.app.on('otherButtons:disable', this.dis, this);
    this.app.on('dialogue:finished', this.enable, this);
    this.on('destroy', this.onDestroy, this);
    this.refresh();
};

LevelSelector.prototype.onDestroy = function () { //Destroy listeners
    this.entity.button['off']('click', this.selected, this);
    this.app.off('modulestop', this.matchCheck, this);
    this.app.off('updatelevels', this.refresh, this);
    this.app.off('otherButtons:disable', this.dis, this);
    this.app.off('dialogue:finished', this.enable, this);
};

LevelSelector.prototype.selected = function () {
    console.log("Selected - " + this.type)
    if (!GlobalAttributes.prototype.getInsertingModule() && !this.disabled) { //Disable scene switching when inserting modules and when dialogue is playing
        if (!GlobalAttributes.prototype.getTypesUnlocked(this.type)) { //Output error messages if level not unlocked or already completed
            this.app.fire("level:accessedEarly");
        }
        else if (GlobalAttributes.prototype.getTypesCompleted(this.type)) {
            this.app.fire("level:alreadyCompleted");
        }
        else { //Switch to scanning scene if level choice is valid
            GlobalAttributes.prototype.setCurrentType(this.type);
            this.app.scenes.changeScene('Scanning');
        }
    }
}

LevelSelector.prototype.matchCheck = function (position) {
    //Check if position of module is within slot bounds in both x and y axis, localPosition refers to center of entity
    var validX = (position.x >= this.entity.getLocalPosition().x - (this.entity.element.width / 2)) && (position.x <= this.entity.getLocalPosition().x + (this.entity.element.width / 2));
    var validY = (position.y >= this.entity.getLocalPosition().y - (this.entity.element.height / 2)) && (position.y <= this.entity.getLocalPosition().y + (this.entity.element.height / 2));
    if (validX && validY) { //Only trigger match check if user drops module on this slot
        console.log("Module - " + GlobalAttributes.prototype.getCurrentType().toString());
        console.log("Slot - " + this.type);
        if (this.type === GlobalAttributes.prototype.getCurrentType()) { //Feedback to user depending on if correct
            this.entity.element.color = new pc.Color(0, 1, 0);
            GlobalAttributes.prototype.setTypesCompleted(this.type);
            GlobalAttributes.prototype.updateLevelStatus();
            GlobalAttributes.prototype.setInsertingModule(false);
            this.app.fire('updatelevels');
        }
        else {
            this.app.fire('incorrectslot')
        }
    }
}

LevelSelector.prototype.refresh = function () {
    if (GlobalAttributes.prototype.getTypesCompleted(this.type)) { //Change button colour depending on level status
        this.entity.element.color = new pc.Color(0, 1, 0);
    }
    else if (GlobalAttributes.prototype.getTypesUnlocked(this.type)) {
        this.entity.element.color = new pc.Color(1, 0.82, 0);
    }
    else {
        this.entity.element.color = new pc.Color(0.5, 0.5, 0.5);
    }
}

LevelSelector.prototype.dis = function () {
    this.disabled = true;
}

LevelSelector.prototype.enable = function () {
    this.disabled = false;
}

// update code called every frame
LevelSelector.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// LevelSelector.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/