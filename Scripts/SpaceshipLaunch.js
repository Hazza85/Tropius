var SpaceshipLaunch = pc.createScript('spaceshipLaunch');

SpaceshipLaunch.attributes.add('icosphere', {
    type: 'entity'
})

// initialize code called once per entity
SpaceshipLaunch.prototype.initialize = function () {
    this.app.on('spaceshiplaunch', this.launch, this);
    this.app.on('spaceshipdrop', this.drop, this);
    this.on('destroy', this.onDestroy, this);
    this.startingPosition = this.entity.getLocalPosition().clone();
    this.startingScale = this.entity.getLocalScale().clone();
    this.movement = 0;
    this.isLaunching = false;
    this.dropMovement = 1;
    this.drop = false;
};

SpaceshipLaunch.prototype.onDestroy = function () { //Destroy listeners
    this.app.off('spaceshiplaunch', this.launch, this);
    this.app.off('spaceshipdrop', this.drop, this);
};

SpaceshipLaunch.prototype.launch = function () {
    this.isLaunching = true;
    this.icosphere.enabled = true;
}

SpaceshipLaunch.prototype.drop = function () {
    if (!GlobalAttributes.prototype.getEnding()) { //If not ending, drop spaceship
        this.entity.setLocalScale(0, 0, 0); //Hide model by setting scale to 0
        setTimeout(() => { //Delay drop animation
            this.drop = true;
        }, 1000);
    }
    else { //Skip drop if ending
        this.dropMovement = 0;
        this.drop = true;
    }
}

// update code called every frame
SpaceshipLaunch.prototype.update = function (dt) {
    if (this.isLaunching) { //Simulate rocket launch
        if (this.movement < 2) {
            this.entity.setLocalPosition(this.startingPosition.x, this.startingPosition.y + this.movement, this.startingPosition.z);
            this.movement = this.movement + 0.01;
        }
        else {
            this.isLaunching = false;
            this.app.fire('ar:request:end');
            this.app.scenes.changeScene('Closer');
        }
    }
    else if (this.drop) {
        this.entity.setLocalScale(this.startingScale);
        if (this.dropMovement > 0) { //Simulate dropping animation
            this.entity.setLocalPosition(this.startingPosition.x, this.startingPosition.y + this.dropMovement, this.startingPosition.z);
            this.dropMovement = this.dropMovement - 0.05;
        } else {
            this.app.fire('finisheddropping'); //Trigger event when finished dropping
            this.drop = false;
        }
    }
};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// SpaceshipLaunch.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/