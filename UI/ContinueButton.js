var ContinueButton = pc.createScript('continueButton');

// initialize code called once per entity
ContinueButton.prototype.initialize = function () {
    this.disabled = false;
    this.entity.button['on']('click', this.onClick, this); //Register event listeners
    this.app.on('dialogue:stay', this.stay, this);
    this.on('destroy', this.onDestroy, this);

};

ContinueButton.prototype.onDestroy = function () { //Destroy event listeners
    this.entity.button['off']('click', this.onClick, this);
    this.app.off('dialogue:stay', this.stay, this);
};

ContinueButton.prototype.stay = function () {
    this.disabled = true;
}

ContinueButton.prototype.onClick = function () {
    if (!this.disabled) {
        this.app.fire('nextdialogue');
    }
};

// update code called every frame
ContinueButton.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ContinueButton.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/