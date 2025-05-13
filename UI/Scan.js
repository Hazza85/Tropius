var Scan = pc.createScript('scan');

// initialize code called once per entity
Scan.prototype.initialize = function () {
    this.entity.button['on']('click', this.onClick, this); //Register listeners
    this.on('destroy', this.onDestroy, this);
};

Scan.prototype.onDestroy = function () { //Destroy listeners
    this.entity.button['off']('click', this.onClick, this);
};

Scan.prototype.onClick = function () {
    this.app.fire('scan');
};

// update code called every frame
Scan.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// Scan.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/