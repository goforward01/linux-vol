'use strict';
var childProcess = require('child_process');
var toPercent = require('to-percent');
var toDecimal = require('to-decimal');
exports.get = function (cb) {
    if (process.platform !== 'linux') {
        throw new Error('Only Linux systems are supported');
    }
	
    //pactl list sinks
    childProcess.exec('amixer -D pulse sget Master', function (err, res) {
        if (err) {
            cb(err);
            return;
        }
        // var matches = res.match(/Volume: 0:\s*(\d+)%/);
        var matches = res.match(/\[(.*?)\]/);

        if (matches === null) {
            throw new Error('Could not get the volume');
        }
        cb(null, toDecimal(parseInt(matches[1], 10)));
    });
};
exports.set = function (level, cb) {
    if (process.platform !== 'linux') {
        throw new Error('Only Linux systems are supported');
    }
    if (typeof level !== 'number') {
        throw new TypeError('Expected a number');
    }
    if (level < 0 || level > 1) {
        cb(new Error('Expected a level between 0 and 1'));
        return;
    }
    //pactl set-sink-volume 0
    childProcess.exec('amixer -D pulse sset Master ' + toPercent(level) + '%', function (err, res) {
        console.error("set volume....");
        if (err) {
            cb(err);
            return;
        }
        cb();
    });
};
