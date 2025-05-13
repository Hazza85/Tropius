var Raycaster = pc.createScript('raycaster');
//Majority code from WebXR AR Raycasting Shapes tutorial https://developer.playcanvas.com/tutorials/webxr-ar-raycasting-shapes/

Raycaster.attributes.add('boxProperties', {
    type: 'json', schema: [{
        name: 'halfExtents',
        type: 'vec3', //Adapt this until hitbox matches
    }],
    title: 'Box Properties',
});

// initialize code called once per entity
Raycaster.prototype.initialize = function () {
    this.ray = new pc.Ray();
    this._worldTransform = new pc.Mat4().setTRS(this.entity.getPosition(), this.entity.getRotation(), pc.Vec3.ONE);
    // Reset the scale so that it doesn't affect the orientation and translation data
    this._shape = new pc.OrientedBox(this._worldTransform, this.boxProperties.halfExtents.clone());
    this.app.xr.input.on('select', this.doRayCast, this);

    this.on('destroy', function () {
        this.app.xr.input.off('select', this.doRayCast, this);
    }, this);
};

Raycaster.prototype.doRayCast = function (inputSource, event) {
    this.ray.set(inputSource.getOrigin(), inputSource.getDirection());
    var result = this._shape.intersectsRay(this.ray);
    if (result) {
        GlobalAttributes.prototype.setInsertingModule(true);
        this.app.fire('ar:request:end');
        this.app.scenes.changeScene('Navigator');
    }
};

// update code called every frame
Raycaster.prototype.update = function (dt) {
    this._worldTransform.setTRS(this.entity.getPosition(), this.entity.getRotation(), pc.Vec3.ONE);
    this._shape.worldTransform = this._worldTransform;
};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// Raycaster.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/