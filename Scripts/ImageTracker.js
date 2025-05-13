var ImageTracker = pc.createScript('imageTracker');
//Code adapted from WebXR: AR Image Tracking tutorial https://developer.playcanvas.com/tutorials/webxr-ar-image-tracking/

ImageTracker.attributes.add('texture', {
    type: 'asset',
    assetType: 'texture',
    title: 'Texture',
});

ImageTracker.attributes.add('width', {
    type: 'number',
    placeholder: 'm',
    title: 'Width',
}); //Width in meters

ImageTracker.attributes.add('sprite', {
    type: 'entity'
})

// initialize code called once per entity
ImageTracker.prototype.initialize = function () {
    this.sprite.enabled = false;
    this.scanning = false;
    if (!this.app.xr.imageTracking)
        return;
    var image = this.texture.resource._levels[0]; //Get image from texture
    var trackedImages = this.app.xr.imageTracking.images;
    for (var i = trackedImages.length; i > 0; i--) { //Clear all previous images from being tracked
        var t = trackedImages[i - 1];
        this.app.xr.imageTracking.remove(t);
    }
    this.trackedImage = this.app.xr.imageTracking.add(image, this.width); //Add image to tracking list
    console.log(this.texture);
    // var trackedImages = this.app.xr.imageTracking.images;
    // for (var i = 0; i < trackedImages.length; i++) {
    //     var t = trackedImages[i];
    //     console.log(t)
    // }

    this.app.on('scan', this.enableScan, this); //Register event listener
    this.on('destroy', this.onDestroy, this);
};

ImageTracker.prototype.onDestroy = function () {
    this.app.off('scan', this.enableScan, this); //Destroy listeners when scene is destroyed
};

ImageTracker.prototype.enableScan = function () {
    this.scanning = true;
}

ImageTracker.prototype.enableEntity = function () {
    if (!this.sprite.enabled) {
        this.sprite.enabled = true;
        this.app.fire('scansuccess');
    }
}

ImageTracker.prototype.update = function (dt) {
    if (this.scanning) {
        if (this.trackedImage.emulated) { //Disable module if marker is lost
            this.app.fire('targetlost');
            this.scanning = false;
            this.sprite.enabled = false;
        }
        else if (this.trackedImage.tracking) { //If marker is present, display module to user
            this.entity.setPosition(this.trackedImage.getPosition());
            this.entity.setRotation(this.trackedImage.getRotation());
            this.enableEntity();
        }
        else {
            this.app.fire('scanfail');
            this.scanning = false; //Disable scan mode if target is lost or target is not found
            this.sprite.enabled = false;
        }
    }
    // else {
    //     if (!this.trackedImage.tracking || this.trackedImage.emulated) {
    //         this.sprite.enabled = false;
    //         this.scanning = false;
    //     }
    // }
};
// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ImageTracker.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/