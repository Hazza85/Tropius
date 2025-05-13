var ImageTrackerAlt = pc.createScript('imageTrackerAlt');
//Alternate version of ImageTracker that uses all 5 images at once
//Code adapted from WebXR: AR Image Tracking tutorial https://developer.playcanvas.com/tutorials/webxr-ar-image-tracking/

ImageTrackerAlt.attributes.add('image0', {
    type: 'asset',
    assetType: 'texture',
});

ImageTrackerAlt.attributes.add('image1', {
    type: 'asset',
    assetType: 'texture',
});

ImageTrackerAlt.attributes.add('image2', {
    type: 'asset',
    assetType: 'texture',
});

ImageTrackerAlt.attributes.add('image3', {
    type: 'asset',
    assetType: 'texture',
});

ImageTrackerAlt.attributes.add('image4', {
    type: 'asset',
    assetType: 'texture',
});

ImageTrackerAlt.attributes.add('width', {
    type: 'number',
    placeholder: 'm',
    title: 'Width',
}); //Width in meters

ImageTrackerAlt.attributes.add('sprite', {
    type: 'entity'
})

// initialize code called once per entity
ImageTrackerAlt.prototype.initialize = function () {
    this.targetIndex = GlobalAttributes.prototype.getCurrentType();
    console.log("Seeking index:", this.targetIndex);
    this.sprite.enabled = false;
    this.scanning = false;
    if (!this.app.xr.imageTracking)
        return;

    var trackedImages = this.app.xr.imageTracking.images;
    // console.log("Num of images", trackedImages.length);
    for (var i = trackedImages.length; i > 0; i--) { //Clear all previous images from being tracked
        var t = trackedImages[i - 1];
        this.app.xr.imageTracking.remove(t);
    }
    for (var i = 0; i < 5; i++) { //Add images to tracking list, order does matter
        var image = this["image" + i].resource._levels[0]; //Get image from texture
        // console.log(i)
        var t = this.app.xr.imageTracking.add(image, this.width); //Add image to tracking list
        // console.log(image);
    }
    // var trackedImages = this.app.xr.imageTracking.images;
    // for (var i = 0; i < trackedImages.length; i++) {
    //     var t = trackedImages[i];
    //     console.log(t)
    // }

    this.app.on('scan', this.enableScan, this); //Register event listener
    this.on('destroy', this.onDestroy, this);
};

ImageTrackerAlt.prototype.onDestroy = function () {
    this.app.off('scan', this.enableScan, this); //Destroy listeners when scene is destroyed
};

ImageTrackerAlt.prototype.enableScan = function () {
    this.scanning = true;
}

ImageTrackerAlt.prototype.enableEntity = function () {
    if (!this.sprite.enabled) {
        this.sprite.enabled = true;
        // console.log("firing scan success");
        this.app.fire('scansuccess');
    }
}

// update code called every frame
ImageTrackerAlt.prototype.update = function (dt) {
    if (this.scanning) {
        var foundImage = false;
        var targetFound = false;
        var targetLost = false;
        var trackedImages = this.app.xr.imageTracking.images;
        for (var i = 0; i < trackedImages.length; i++) {
            var t = trackedImages[i];
            if (t.emulated && i === this.targetIndex) {
                targetLost = true;
                break;
            }
            else if (t.tracking) {
                foundImage = true;
                // console.log("Tracking", i, this.trackedImage == t, this.targetIndex, this.trackedIndex, this.trackedIndex == i)
                if (i === this.targetIndex) { //Check if the current image being tracked corresponds to the correct module
                    this.entity.setPosition(t.getPosition());
                    this.entity.setRotation(t.getRotation());
                    this.enableEntity();
                    targetFound = true;
                    break;
                }
                else {
                    t.tracking = false; //Not sure if this really does anything
                }
            }
        }
        if (targetLost) { //Disable module if marker is lost
            this.app.fire('targetlost');
            this.scanning = false;
            this.sprite.enabled = false;
        }
        else if (!targetFound && foundImage) { //A module was detected but is not the correct one
            this.app.fire('wrongfound');
            this.scanning = false; //Disable scan mode
            this.sprite.enabled = false;
        }
        else if (!foundImage) {
            this.app.fire('scanfail');
            this.scanning = false; //Disable scan mode if nothing found
            this.sprite.enabled = false;
        }
    }
};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ImageTrackerAlt.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/