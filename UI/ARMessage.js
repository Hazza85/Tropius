var Armessage = pc.createScript('armessage');

// initialize code called once per entity
Armessage.prototype.initialize = function () {
    this.app.on('ar:request:start', this.hide, this);
    this.app.on('ar:request:end', this.show, this);
    this.on('destroy', this.onDestroy, this);
};

Armessage.prototype.onDestroy = function () {
    this.app.on('ar:request:start', this.hide, this);
    this.app.on('ar:request:end', this.show, this);
}

Armessage.prototype.hide = function () {
    this.entity.setLocalScale(0, 0, 0);
}

Armessage.prototype.show = function () {
    this.entity.setLocalScale(1, 1, 1);
}

// update code called every frame
Armessage.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// Armessage.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/