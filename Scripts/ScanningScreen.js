var ScanningScreen = pc.createScript('scanningScreen');

ScanningScreen.attributes.add('scanButton', {
    type: 'entity'
})

// initialize code called once per entity
ScanningScreen.prototype.initialize = function () {
    this.app.on('ar:request:start', this.enableScan, this); //Register listeners
    this.app.on('ar:request:end', this.disableScan, this);
    this.on('destroy', this.onDestroy, this);
    //var image = this.entity.findByTag(GlobalAttributes.prototype.getCurrentType().toString()); //Set correct image tracker to active
    // image[0].enabled = true;
};

ScanningScreen.prototype.onDestroy = function () {
    this.app.off('ar:request:start', this.enableScan, this); //Disable lisetners
    this.app.off('ar:request:end', this.disableScan, this);
};

ScanningScreen.prototype.enableScan = function () {
    this.scanButton.enabled = true; //Scan button is only enabled when in AR mode
}

ScanningScreen.prototype.disableScan = function () {
    this.scanButton.enabled = false;
}

// update code called every frame
ScanningScreen.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ScanningScreen.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/