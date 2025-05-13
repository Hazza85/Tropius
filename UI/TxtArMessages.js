var TxtArMessages = pc.createScript('txtArMessages');

/** Attributes */

TxtArMessages.attributes.add('scanner', {
    type: 'boolean'
})

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
TxtArMessages.prototype.initialize = function () {
    this.entity.element.enabled = false;

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
TxtArMessages.prototype._onDestroy = function () {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
TxtArMessages.prototype._registerListeners = function (onOrOff) {
    this.app[onOrOff]('ar:available', this._onArAvailable, this);
    this.app[onOrOff]('ar:onStart', this._onArStart, this);
    this.app[onOrOff]('ar:hit:start', this._onArHitStart, this);
    this.app[onOrOff]('ar:onTracking', this._onArTracking, this);
    this.app[onOrOff]('ar:positioner:place', this._onArPositionPlace, this);
    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);
    this.app[onOrOff]('scansuccess', this.scanSuccess, this);
    this.app[onOrOff]('scanfail', this.scanFail, this);
    this.app[onOrOff]('targetlost', this.targetLost, this);
    this.app[onOrOff]('wrongfound', this.wrongFound, this);
};

TxtArMessages.prototype._onArAvailable = function (value) {
    if (!value) {
        this.entity.element.enabled = true;
        this.entity.element.text = 'AR is not available on this device';
    }
};

TxtArMessages.prototype._onArStart = function () {
    this.entity.element.enabled = true;
    if (this.scanner) {
        this.entity.element.text = 'Point the camera at the cards and press scan';
    }
    else {
        this.entity.element.text = 'Slowly move your device for tracking to begin';
    }
};

TxtArMessages.prototype._onArHitStart = function () {
    this.app.once('ar:hit', this._onArHit, this);
};

TxtArMessages.prototype._onArHit = function () {
    this.entity.element.enabled = true;
    if (!this.scanner && !GlobalAttributes.prototype.getEnding()) {
        this.entity.element.text = 'Scanning area';
    }
    else if (!this.scanner && GlobalAttributes.prototype.getEnding()) {
        this.entity.element.text = 'Press the launch button to launch the spaceship'
    }
};

TxtArMessages.prototype._onArTracking = function () {
};

TxtArMessages.prototype._onArPositionPlace = function () {
    this.entity.element.enabled = false;
};

TxtArMessages.prototype._onArEnd = function () {
    this.entity.element.enabled = false;
    this.app.off('ar:hit', this._onArHit, this);
};

TxtArMessages.prototype.scanSuccess = function () {
    this.entity.element.text = 'Tap module to retrieve it';
}

TxtArMessages.prototype.scanFail = function () {
    this.entity.element.text = 'Nothing found, maybe the assembly was wrong or obscured';
}

TxtArMessages.prototype.targetLost = function () {
    this.entity.element.text = 'Target was lost, please rescan';
}

TxtArMessages.prototype.wrongFound = function () {
    this.entity.element.text = 'Module assembled correctly but it is not the one we are looking for'
}