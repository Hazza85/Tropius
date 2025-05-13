var Draggable = pc.createScript('Draggable');
//Majority code by inductible's drag and drop demo https://forum.playcanvas.com/t/2d-ui-element-drag-and-drop-demo/8354

Draggable.attributes.add('handle', { type: 'entity', default: null, title: 'Handle' });

// initialize code called once per entity
Draggable.prototype.initialize = function () {
    this.disabled = true;
    this.app.on('otherButtons:disable', this.dis, this); //Register event listeners
    this.app.on('dialogue:finished', this.enable, this);
};

Draggable.prototype.postInitialize = function () {
    this.axis = 'xy';
    this.addListeners();
    this.isDragging = false;
    this.wasDragging = false;
    this.touchId = -1;
    this.mousePos = new pc.Vec3();
    this.anchorPos = this.handle.getLocalPosition().clone();
    this.screen = this.handle.element.screen.screen;;
};

Draggable.prototype.addListeners = function () {
    this.handle.element.on(pc.EVENT_MOUSEDOWN, this.onPressDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onPressUp, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onPressMove, this);
    if (this.app.touch) {
        this.handle.element.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
    }

    this.on('destroy', function () {
        this.app.off('otherButtons:disable', this.dis, this);
        this.app.off('dialogue:finished', this.enable, this);
        this.handle.element.off(pc.EVENT_MOUSEDOWN, this.onPressDown, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this.onPressUp, this);
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onPressMove, this);
        if (this.app.touch) {
            this.handle.element.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
            this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
            this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this);
            this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        }
    });
};

Draggable.prototype.onTouchStart = function (ev) {
    var touch = ev.changedTouches[0];
    this.touchId = touch.identifier;
    this.startDrag(ev.x, ev.y);
    ev.event.stopPropagation();
};

Draggable.prototype.onTouchMove = function (ev) {
    for (var i = 0; i < ev.changedTouches.length; i++) {
        var t = ev.changedTouches[i];
        if (t.id == this.touchId) {
            ev.event.stopPropagation();
            this.updateMove(t.x, t.y);
            return;
        }
    }
};

Draggable.prototype.onTouchEnd = function (ev) {
    for (var i = 0; i < ev.changedTouches.length; i++) {
        var t = ev.changedTouches[i];
        if (t.id == this.touchId) {
            ev.event.stopImmediatePropagation();
            this.touchId = -1;
            this.endDrag(t.x, t.y);
            return;
        }
    }
};

Draggable.prototype.startDrag = function (x, y) {
    this.isDragging = true;
    this.setMouseXY(x, y);
};

Draggable.prototype.endDrag = function (x, y) {
    this.isDragging = false;
    this.setMouseXY(x, y);
};

Draggable.prototype.onPressDown = function (ev) {
    ev.event.stopImmediatePropagation();
    this.startDrag(ev.x, ev.y);
};

Draggable.prototype.onPressUp = function (ev) {
    ev.event.stopImmediatePropagation();
    this.endDrag(ev.x, ev.y);
};

Draggable.prototype.onPressMove = function (ev) {
    this.updateMove(ev.x, ev.y);
    ev.event.stopImmediatePropagation();
};

Draggable.prototype.updateMove = function (x, y) {
    if (this.isDragging) {
        this.setMouseXY(x, y);
    }
};

Draggable.prototype.setMouseXY = function (x, y) {
    this.mousePos.x = x;
    this.mousePos.y = y;
};

// update code called every frame
Draggable.prototype.update = function (dt) {
    this.updateDrag();
};

Draggable.prototype.updateDrag = function () {
    if (!this.disabled) { //Prevents module from moving when dialogue is playing
        if (this.isDragging) {
            var device = this.app.graphicsDevice;
            var xOffs = this.handle.element.anchor.x * device.width;
            var yOffs = this.handle.element.anchor.y * device.height;
            var scale = 1 / this.screen.scale;
            var screenX = (this.axis == 'xy') ? (this.mousePos.x - xOffs) * scale : this.anchorPos.x;
            var screenY = (this.axis == 'xy') ? (-this.mousePos.y + yOffs) * scale : this.anchorPos.y;
            this.handle.setLocalPosition(screenX, screenY, 0);
        }
        if (this.wasDragging === true && this.isDragging === false) { //Indicate if user has stopped dragging the module
            this.app.fire('modulestop', this.handle.getLocalPosition()); //Send position in event
        }
        this.wasDragging = this.isDragging;
    }
};

Draggable.prototype.dis = function () {
    this.disabled = true;
}

Draggable.prototype.enable = function () {
    this.disabled = false;
}

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// Draggable.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/