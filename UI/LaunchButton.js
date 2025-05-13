var LaunchButton = pc.createScript('launchButton');

// initialize code called once per entity
LaunchButton.prototype.initialize = function () {
    this.entity.button['on']('click', this.onClick, this); //Register listeners
    this.on('destroy', this.onDestroy, this);
};

LaunchButton.prototype.onDestroy = function () { //Destroy listeners
    this.entity.button['off']('click', this.onClick, this);
};

LaunchButton.prototype.onClick = function () {
    this.app.fire('spaceshiplaunch');
}

// update code called every frame
LaunchButton.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// LaunchButton.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/