var Toggle = pc.createScript('toggle');

Toggle.attributes.add('eventName', {
    type: 'string'
})

// initialize code called once per entity
Toggle.prototype.initialize = function () {
    this.entity.enabled = false
    this.app.on(this.eventName, this.enable, this); //Register event listener
    this.on('destroy', this.destroy);
};

Toggle.prototype.destroy = function () {
    this.app.off(this.eventName, this.enable) //Destroy event listener
}

Toggle.prototype.enable = function () {
    this.entity.enabled = true
}

// update code called every frame
Toggle.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// Toggle.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/