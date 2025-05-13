var GlobalAttributes = pc.createScript('globalAttributes');

class Checkpoint {
    constructor(id, preReqs, unlocked, completed) {
        this.id = id; //Level number
        this.preReqs = preReqs; //Array of previous levels needed to be completed to unlock this one
        this.unlocked = unlocked; //Boolean representing if level is unlocked or not
        this.completed = completed; //Boolean representing if level is completed
    }
}

window.globals = this;
window.globals.checkpoints = [new Checkpoint(0, [], true, false), new Checkpoint(1, [0, 2], false, false), new Checkpoint(2, [0], false, false), new Checkpoint(3, [1], false, false), new Checkpoint(4, [3], false, false)]; //Gravi, thermo, hydro, thigmo, photo
window.globals.currentType = 0; //Number 0-4 depending on current type being scanned, number corresponds to index of typesUnlocked above
window.globals.ending = false;
window.globals.firstNavigator = true;
window.globals.insertingModule = false;

GlobalAttributes.prototype.setTypesUnlocked = function (index) {
    window.globals.checkpoints.forEach((elem) => { //Only really need this loop in case levels are not entered into the array in order
        if (elem.id === index) {
            elem.unlocked = true;
        }
    })
}

GlobalAttributes.prototype.getTypesUnlocked = function (index) {
    var un = false;
    window.globals.checkpoints.forEach((elem) => {
        if (elem.id === index) {
            un = elem.unlocked;
        }
    })
    return un;
}

GlobalAttributes.prototype.getTypesCompleted = function (index) {
    var comp = false;
    window.globals.checkpoints.forEach((elem) => {
        if (elem.id === index) {
            comp = elem.completed;
        }
    })
    return comp;
}

GlobalAttributes.prototype.setTypesCompleted = function (index) {
    window.globals.checkpoints.forEach((elem) => {
        if (elem.id === index) {
            elem.completed = true;
        }
    })
}

GlobalAttributes.prototype.updateLevelStatus = function () {
    var comp = true; //All levels completed flag
    window.globals.checkpoints.forEach((elem) => {
        var un = true;
        elem.preReqs.forEach((e) => { //Check if all prerequisite levels have been completed
            if (window.globals.checkpoints[e].completed === false) { //Flag if any prerequisite has not been completed
                un = false;
            }
        })
        if (un === true) { //Unlock level if all prerequisites have been completed
            elem.unlocked = true;
        }
        if (elem.completed === false) { //If any level has not been completed, flag
            comp = false;
        }
    }) //Check if each level has been completed, trigger ending if so
    if (comp === true) {
        window.globals.ending = true;
    }
}

GlobalAttributes.prototype.setCurrentType = function (num) {
    window.globals.currentType = num;
}

GlobalAttributes.prototype.getCurrentType = function () {
    return window.globals.currentType;
}

GlobalAttributes.prototype.setEnding = function () {
    window.globals.ending = true;
}

GlobalAttributes.prototype.getEnding = function () {
    return window.globals.ending;
}

GlobalAttributes.prototype.disableFirstNavigator = function () {
    window.globals.firstNavigator = false;
}

GlobalAttributes.prototype.getFirstNavigator = function () {
    return window.globals.firstNavigator;
}

GlobalAttributes.prototype.setInsertingModule = function (boo) {
    window.globals.insertingModule = boo;
}

GlobalAttributes.prototype.getInsertingModule = function () {
    return window.globals.insertingModule;
}

// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// GlobalAttributes.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/