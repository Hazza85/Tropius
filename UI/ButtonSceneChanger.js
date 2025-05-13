var ButtonSceneChanger = pc.createScript('buttonSceneChanger');

ButtonSceneChanger.attributes.add('scene', {
    type: 'string',
    title: 'Scene',
});

// initialize code called once per entity
ButtonSceneChanger.prototype.initialize = function () {
    this.entity.button['on']('click', this.onClick, this); //Register listeners
    this.on('destroy', this.onDestroy, this);
};

ButtonSceneChanger.prototype.onDestroy = function () { //Destroy listeners
    this.entity.button['off']('click', this.onClick, this);
};

ButtonSceneChanger.prototype.onClick = function () {
    this.app.fire('ar:request:end');
    this.app.scenes.changeScene(this.scene);
};

// update code called every frame
ButtonSceneChanger.prototype.update = function (dt) {

};

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ButtonSceneChanger.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/