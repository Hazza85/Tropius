var CubeMovement = pc.createScript('cubeMovement');

// initialize code called once per entity
CubeMovement.prototype.initialize = function () {
    this.startingPosition = this.entity.getLocalPosition().clone();
    this.angle = 0;
};

// update code called every frame
CubeMovement.prototype.update = function (dt) {
    if (this.angle >= 360) { //Use unit circle to simulate movement
        this.angle = 0;
    }
    var rad = this.angle * Math.PI / 180;
    var cos = Math.cos(rad) * 0.1; //Multiply by 0.1 to get correct scale
    var sin = Math.sin(rad) * 0.1;
    this.entity.setLocalPosition(this.startingPosition.x + cos, this.startingPosition.y + sin, 0);
    this.angle = this.angle + 1;
};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// CubeMovement.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/