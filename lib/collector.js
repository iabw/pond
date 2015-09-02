"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _generator = require("./generator");

var _generator2 = _interopRequireDefault(_generator);

var Collector = (function () {
    function Collector(size, observer) {
        _classCallCheck(this, Collector);

        this._generator = new _generator2["default"](size);
        this._bucket = null;

        // Callback
        this._observer = observer;
    }

    /**
     * Gets the current bucket or returns a new one.
     *
     * If a new bucket is generated the result of the old bucket is emitted
     * automatically.
     */

    _createClass(Collector, [{
        key: "bucket",
        value: function bucket(d) {
            var _this = this;

            var newBucketIndex = this._generator.bucketIndex(d);
            var bucketIndex = this._bucket ? this._bucket.index().asString() : "";
            if (newBucketIndex !== bucketIndex) {
                if (this._bucket) {
                    this._bucket.collect(function (series) {
                        if (_this._observer) {
                            _this._observer(series);
                        }
                    });
                }
                this._bucket = this._generator.bucket(d);
            }
            return this._bucket;
        }

        /**
         * Forces the current bucket to emit
         */
    }, {
        key: "done",
        value: function done() {
            var _this2 = this;

            if (this._bucket) {
                this._bucket.collect(function (series) {
                    if (_this2._observer) {
                        _this2._observer(series);
                    }
                    _this2._bucket = null;
                });
            }
        }

        /**
         * Add an event, which will be assigned to a bucket
         */
    }, {
        key: "addEvent",
        value: function addEvent(event, cb) {
            var t = event.timestamp();
            var bucket = this.bucket(t);
            bucket.addEvent(event, function (err) {
                if (err) {
                    console.error("Could not add value to bucket:", err);
                }
                if (cb) {
                    cb(err);
                }
            });
        }
    }, {
        key: "onEmit",
        value: function onEmit(cb) {
            this._observer = cb;
        }
    }]);

    return Collector;
})();

exports["default"] = Collector;
module.exports = exports["default"];