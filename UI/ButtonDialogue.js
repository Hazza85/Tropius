var ButtonDialogue = pc.createScript('buttonDialogue');

ButtonDialogue.attributes.add('data', {
    type: 'asset',
    assetType: 'json'
});
ButtonDialogue.attributes.add('scene', {
    type: 'string'
})

ButtonDialogue.attributes.add('text', {
    type: 'entity',
    title: 'TextBox'
})

// initialize code called once per entity
ButtonDialogue.prototype.initialize = function () {
    // this.entity.button['on']('click', this.onClick, this); //Register event listeners
    this.on('destroy', this.onDestroy, this);
    this.app.on('dialogue:stay', this.stay, this);
    this.app.on('nextdialogue', this.onClick, this);

    this.current = 0;
    this.end = this.data.resource[this.scene].length - 1;
    this.loadText(); //Load first dialogue line in scene
};

ButtonDialogue.prototype.onDestroy = function () { //Destroy event listeners
    // this.entity.button['off']('click', this.onClick, this);
    this.app.off('dialogue:stay', this.stay, this);
    this.app.off('nextdialogue', this.onClick, this);
};

ButtonDialogue.prototype.onClick = function () {
    if (this.current === this.end) { //No more dialogue
        this.entity.enabled = false;
        this.app.fire("dialogue:finished");
        return;
    }
    else {
        this.current += 1; //Progresses dialogue in a scene once user has clicked on the dialogue box
        this.loadText();
    }
};

ButtonDialogue.prototype.stay = function () { //Used to indicate that the dialogue box will stay for the rest of the scene
    this.entity.button.active = false;
}

ButtonDialogue.prototype.setScene = function (sc) {
    this.scene = sc;
}

ButtonDialogue.prototype.restart = function () { //Resets dialogue to the beginning
    this.current = 0;
    this.end = this.data.resource[this.scene].length - 1;
    this.loadText(); //Load first dialogue line in scene
}

ButtonDialogue.prototype.loadText = function () {
    this.text.element.text = this.data.resource[this.scene][this.current].text;
    if (this.data.resource[this.scene][this.current].flag !== undefined) { //If there are any flags in the dialogue, fire them as events
        this.app.fire(this.data.resource[this.scene][this.current].flag);
    }
}

// update code called every frame
ButtonDialogue.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ButtonDialogue.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/