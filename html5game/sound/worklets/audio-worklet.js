AudioWorkletProcessor.prototype._Z1 = function() {
    this.__1 = true;
    this.port.onmessage = (_02) => {
        if (_02.data === "kill")
            this.__1 = false;
    }
    ;
}
;
class _12 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }];
    }
    constructor() {
        super();
        this._Z1();
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            for (let _62 = 0; _62 < _52.length; ++_62)
                _32[parameters.bypass[_62] ?? parameters.bypass[0]][c][_62] = _52[_62];
        }
        return this.__1;
    }
}
class _72 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1,
            minValue: 0
        }];
    }
    constructor() {
        super();
        this._Z1();
    }
    process(_22, _32, parameters) {
        const _82 = _22[0];
        const _92 = _22[1];
        const _a2 = _32[0];
        const gain = parameters.gain;
        for (let c = 0; c < _92.length; ++c) {
            const _52 = _92[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62)
                _b2[_62] = _52[_62];
        }
        for (let c = 0; c < _82.length; ++c) {
            const _52 = _82[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62)
                _b2[_62] += _52[_62] * (gain[_62] ?? gain[0]);
        }
        return this.__1;
    }
}
registerProcessor("audio-bus-input", _12);
registerProcessor("audio-bus-output", _72);
class _c2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 0.0
        }, {
            name: "factor",
            automationRate: "a-rate",
            defaultValue: 20,
            minValue: 1,
            maxValue: 100
        }, {
            name: "resolution",
            automationRate: "a-rate",
            defaultValue: 8,
            minValue: 2,
            maxValue: 16
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.8,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    static _d2 = [undefined, undefined, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        this._g2 = new Float32Array(_f2);
        this._h2 = new Uint32Array(_f2);
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const gain = parameters.gain;
        const factor = parameters.factor;
        const resolution = parameters.resolution;
        const mix = parameters.mix;
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                _b2[_62] = _52[_62];
                if (this._h2[c] === 0)
                    this._g2[c] = _52[_62];
                ++this._h2[c];
                this._h2[c] %= (factor[_62] ?? factor[0]);
                if (bypass[_62] ?? bypass[0])
                    continue;
                let _i2 = this._g2[c];
                const _j2 = (gain[_62] ?? gain[0]);
                _i2 *= _j2;
                _i2 = Math.max(Math.min(_i2, 1.0), -1.0);
                const _k2 = resolution[_62] ?? resolution[0];
                const max = (_i2 > 0.0) ? _c2._d2[_k2] - 1 : _c2._d2[_k2];
                _i2 = Math.round(_i2 * max) / max;
                const _l2 = (mix[_62] ?? mix[0]);
                _b2[_62] *= (1.0 - _l2);
                _b2[_62] += (_i2 * _l2);
            }
        }
        return this.__1;
    }
}
registerProcessor("bitcrusher-processor", _c2);
class _m2 extends AudioWorkletProcessor {
    static _n2 = 5.0;
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "time",
            automationRate: "a-rate",
            defaultValue: 0.2,
            minValue: 0.0,
            maxValue: _m2._n2
        }, {
            name: "feedback",
            automationRate: "a-rate",
            defaultValue: 0.5,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.35,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        const _o2 = (_m2._n2 * sampleRate) + 1;
        this.buffer = new Array(_f2);
        this._p2 = new Uint32Array(_f2);
        for (let c = 0; c < _f2; ++c)
            this.buffer[c] = new Float32Array(_o2);
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const time = parameters.time;
        const feedback = parameters.feedback;
        const mix = parameters.mix;
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                _b2[_62] = _52[_62];
                const _q2 = this._r2(c, (time[_62] ?? time[0]));
                const _s2 = _52[_62] + (_q2 * (feedback[_62] ?? feedback[0]));
                this.write(c, _s2);
                if ((bypass[_62] ?? bypass[0]))
                    continue;
                const _l2 = (mix[_62] ?? mix[0]);
                _b2[_62] *= (1 - _l2);
                _b2[_62] += (_q2 * _l2);
            }
        }
        return this.__1;
    }
    _r2(_t2, _u2) {
        const _v2 = _u2 * sampleRate;
        let _w2 = (this._p2[_t2] - ~~_v2);
        let _x2 = (_w2 - 1);
        while (_w2 < 0)
            _w2 += this.buffer[_t2].length;
        while (_x2 < 0)
            _x2 += this.buffer[_t2].length;
        const frac = _v2 - ~~_v2;
        const _y2 = this.buffer[_t2][_w2];
        const _z2 = this.buffer[_t2][_x2];
        return _y2 + (_z2 - _y2) * frac;
    }
    write(_t2, _A2) {
        ++this._p2[_t2];
        this._p2[_t2] %= this.buffer[_t2].length;
        this.buffer[_t2][this._p2[_t2]] = _A2;
    }
}
registerProcessor("delay-processor", _m2);
class _B2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "gain",
            automationRate: "a-rate",
            defaultValue: 0.5,
            minValue: 0.0
        }];
    }
    constructor() {
        super();
        this._Z1();
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const gain = parameters.gain;
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                _b2[_62] = _52[_62];
                if (bypass[_62] ?? bypass[0])
                    continue;
                _b2[_62] *= (gain[_62] ?? gain[0]);
            }
        }
        return this.__1;
    }
}
registerProcessor("gain-processor", _B2);
class _C2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _D2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "cutoff",
            automationRate: "a-rate",
            defaultValue: Math.min(1500.0, _D2),
            minValue: 10.0,
            maxValue: _D2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.5,
            minValue: 1.0,
            maxValue: 100.0
        }];
    }
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        this._E2 = 0;
        this._F2 = 0;
        this._G2 = 0;
        this._H2 = 0;
        this._I2 = 0;
        this._J2 = new Float32Array(_f2);
        this._K2 = new Float32Array(_f2);
        this._L2 = new Float32Array(_f2);
        this._M2 = new Float32Array(_f2);
        this._N2 = -1;
        this._O2 = -1;
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const cutoff = parameters.cutoff;
        const q = parameters.q;
        const _P2 = (cutoff.length === 1 && q.length === 1);
        if (_P2)
            this._Q2(cutoff[0], q[0]);
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                if (!_P2)
                    this._Q2(cutoff[_62] ?? cutoff[0], q[_62] ?? q[0]);
                const _R2 = this._G2 * _52[_62] + this._H2 * this._J2[c] + this._I2 * this._K2[c] - this._E2 * this._L2[c] - this._F2 * this._M2[c];
                this._K2[c] = this._J2[c];
                this._J2[c] = _52[_62];
                this._M2[c] = this._L2[c];
                this._L2[c] = _R2;
                _b2[_62] = (bypass[_62] ?? bypass[0]) ? _52[_62] : _R2;
            }
        }
        return this.__1;
    }
    _Q2(_S2, _T2) {
        if (_S2 === this._N2 && _T2 === this._O2)
            return;
        const _U2 = 2 * Math.PI * _S2 / sampleRate;
        const alpha = Math.sin(_U2) / (2 * _T2);
        const _V2 = Math.cos(_U2);
        const _W2 = 1 + alpha;
        const _E2 = -2 * _V2;
        const _F2 = 1 - alpha;
        const _G2 = (1 + _V2) / 2;
        const _H2 = -1 - _V2;
        const _I2 = (1 + _V2) / 2;
        this._E2 = _E2 / _W2;
        this._F2 = _F2 / _W2;
        this._G2 = _G2 / _W2;
        this._H2 = _H2 / _W2;
        this._I2 = _I2 / _W2;
        this._N2 = _S2;
        this._O2 = _T2;
    }
}
registerProcessor("hpf2-processor", _C2);
class _X2 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        const _D2 = Math.min(sampleRate / 2.0, 20000.0);
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "cutoff",
            automationRate: "a-rate",
            defaultValue: Math.min(500.0, _D2),
            minValue: 10.0,
            maxValue: _D2
        }, {
            name: "q",
            automationRate: "a-rate",
            defaultValue: 1.5,
            minValue: 1.0,
            maxValue: 100.0
        }];
    }
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        this._E2 = 0;
        this._F2 = 0;
        this._G2 = 0;
        this._H2 = 0;
        this._I2 = 0;
        this._J2 = new Float32Array(_f2);
        this._K2 = new Float32Array(_f2);
        this._L2 = new Float32Array(_f2);
        this._M2 = new Float32Array(_f2);
        this._N2 = -1;
        this._O2 = -1;
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const cutoff = parameters.cutoff;
        const q = parameters.q;
        const _P2 = (cutoff.length === 1 && q.length === 1);
        if (_P2)
            this._Q2(cutoff[0], q[0]);
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                if (!_P2)
                    this._Q2(cutoff[_62] ?? cutoff[0], q[_62] ?? q[0]);
                const _R2 = this._G2 * _52[_62] + this._H2 * this._J2[c] + this._I2 * this._K2[c] - this._E2 * this._L2[c] - this._F2 * this._M2[c];
                this._K2[c] = this._J2[c];
                this._J2[c] = _52[_62];
                this._M2[c] = this._L2[c];
                this._L2[c] = _R2;
                _b2[_62] = (bypass[_62] ?? bypass[0]) ? _52[_62] : _R2;
            }
        }
        return this.__1;
    }
    _Q2(_S2, _T2) {
        if (_S2 === this._N2 && _T2 === this._O2)
            return;
        const _U2 = 2 * Math.PI * _S2 / sampleRate;
        const alpha = Math.sin(_U2) / (2 * _T2);
        const _V2 = Math.cos(_U2);
        const _W2 = 1 + alpha;
        const _E2 = -2 * _V2;
        const _F2 = 1 - alpha;
        const _G2 = (1 - _V2) / 2;
        const _H2 = 1 - _V2;
        const _I2 = (1 - _V2) / 2;
        this._E2 = _E2 / _W2;
        this._F2 = _F2 / _W2;
        this._G2 = _G2 / _W2;
        this._H2 = _H2 / _W2;
        this._I2 = _I2 / _W2;
        this._N2 = _S2;
        this._O2 = _T2;
    }
}
registerProcessor("lpf2-processor", _X2);
class _Y2 {
    constructor(_Z2) {
        this.__2 = 0;
        this._03 = 0;
        this.feedback = 0;
        this._13 = 0;
        this.buffer = new Float32Array(_Z2);
        this._23 = 0;
    }
    process(_A2) {
        const out = this.buffer[this._23];
        this._13 = (this._13 * this.__2) + (out * this._03);
        this.buffer[this._23] = _A2 + (this._13 * this.feedback);
        ++this._23;
        this._23 %= this.buffer.length;
        return out;
    }
    _33(_43) {
        this.feedback = Math.min(Math.max(0, _43), 1);
    }
    _53(_63) {
        this.__2 = Math.min(Math.max(0, _63), 1);
        this._03 = 1 - this.__2;
    }
}
class _73 {
    constructor(_Z2) {
        this.feedback = 0;
        this.buffer = new Float32Array(_Z2);
        this._23 = 0;
    }
    process(_A2) {
        const out = this.buffer[this._23];
        this.buffer[this._23] = _A2 + (out * this.feedback);
        ++this._23;
        this._23 %= this.buffer.length;
        return (out - _A2);
    }
    _33(_43) {
        this.feedback = Math.min(Math.max(0, _43), 1);
    }
}
class _83 extends AudioWorkletProcessor {
    static _93 = 8;
    static _a3 = 4;
    static _b3 = 0.015;
    static _c3 = 0.4;
    static _d3 = 0.28;
    static _e3 = 0.7;
    static _f3 = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
    static _g3 = [1139, 1211, 1300, 1379, 1445, 1514, 1580, 1640];
    static _h3 = [556, 441, 341, 225];
    static _i3 = [579, 464, 364, 248];
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "size",
            automationRate: "a-rate",
            defaultValue: 0.7,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "damp",
            automationRate: "a-rate",
            defaultValue: 0.1,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "mix",
            automationRate: "a-rate",
            defaultValue: 0.35,
            minValue: 0.0,
            maxValue: 1.0
        }];
    }
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        this._j3 = -1;
        this._k3 = -1;
        this._l3 = new Array(_f2);
        this._m3 = new Array(_f2);
        const _n3 = [_83._f3, _83._g3];
        const _o3 = [_83._h3, _83._i3];
        for (let c = 0; c < _f2; ++c) {
            this._l3[c] = new Array(_83._93);
            this._m3[c] = new Array(_83._a3);
            for (let i = 0; i < _83._93; ++i)
                this._l3[c][i] = new _Y2(_n3[c % _n3.length][i]);
            for (let i = 0; i < _83._a3; ++i)
                this._m3[c][i] = new _73(_o3[c % _o3.length][i]);
        }
        this._p3(0.5);
        this._53(0.5);
        for (let c = 0; c < _f2; ++c)
            for (let i = 0; i < _83._a3; ++i)
                this._m3[c][i]._33(0.5);
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const size = parameters.size;
        const damp = parameters.damp;
        const mix = parameters.mix;
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                this._p3(size[_62] ?? size[0]);
                this._53(damp[_62] ?? damp[0]);
                _b2[_62] = _52[_62];
                let out = 0;
                const _i2 = _52[_62] * _83._b3;
                for (let i = 0; i < _83._93; ++i)
                    out += this._l3[c][i].process(_i2);
                for (let i = 0; i < _83._a3; ++i)
                    out = this._m3[c][i].process(out);
                if (bypass[_62] ?? bypass[0])
                    continue;
                const _l2 = (mix[_62] ?? mix[0]);
                _b2[_62] *= (1 - _l2);
                _b2[_62] += (out * _l2);
            }
        }
        return this.__1;
    }
    _p3(_Z2) {
        if (_Z2 === this._j3)
            return;
        const size = (_Z2 * _83._d3) + _83._e3;
        for (let c = 0; c < this._l3.length; ++c)
            for (let i = 0; i < _83._93; ++i)
                this._l3[c][i]._33(size);
        this._j3 = _Z2;
    }
    _53(_63) {
        if (_63 === this._k3)
            return;
        const damp = _63 * _83._c3;
        for (let c = 0; c < this._l3.length; ++c)
            for (let i = 0; i < _83._93; ++i)
                this._l3[c][i]._53(damp);
        this._k3 = _63;
    }
}
registerProcessor("reverb1-processor", _83);
class _q3 extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: "bypass",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 1
        }, {
            name: "rate",
            automationRate: "a-rate",
            defaultValue: 5.0,
            minValue: 0.0,
            maxValue: 20.0
        }, {
            name: "intensity",
            automationRate: "a-rate",
            defaultValue: 1.0,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "offset",
            automationRate: "a-rate",
            defaultValue: 0.0,
            minValue: 0.0,
            maxValue: 1.0
        }, {
            name: "shape",
            automationRate: "a-rate",
            defaultValue: 0,
            minValue: 0,
            maxValue: 4
        }];
    }
    constructor(_e2) {
        super();
        this._Z1();
        const _f2 = _e2.outputChannelCount[0];
        this._r3 = new Array(_f2).fill(1.0);
        this._s3 = new Array(_f2).fill(0.0);
        this._t3 = new Array(_f2).fill(_u3._v3._w3);
        this._x3 = new Array(_f2);
        for (let c = 0; c < _f2; ++c) {
            this._x3[c] = new _y3();
            this._x3[c]._z3(sampleRate);
            this._x3[c]._A3(this._r3[c]);
            this._x3[c]._B3(this._t3[c]);
            if (c % 2 === 1) {
                this._x3[c]._C3(this._s3[c]);
            }
        }
    }
    process(_22, _32, parameters) {
        const _42 = _22[0];
        const _a2 = _32[0];
        const bypass = parameters.bypass;
        const rate = parameters.rate;
        const intensity = parameters.intensity;
        const offset = parameters.offset;
        const shape = parameters.shape;
        for (let c = 0; c < _42.length; ++c) {
            const _52 = _42[c];
            const _b2 = _a2[c];
            for (let _62 = 0; _62 < _52.length; ++_62) {
                _b2[_62] = _52[_62];
                const _k2 = rate[_62] ?? rate[0];
                const _D3 = offset[_62] ?? offset[0];
                const _E3 = shape[_62] ?? shape[0];
                this._F3(c, _k2, _D3, _E3);
                const _G3 = this._x3[c]._r2();
                if ((bypass[_62] ?? bypass[0]) > 0.0) {
                    continue;
                }
                const i = intensity[_62] ?? intensity[0];
                const out = _52[_62] * _G3 * i;
                _b2[_62] *= (1.0 - i);
                _b2[_62] += out;
            }
        }
        return this.__1;
    }
    _F3(_t2, _H3, _I3, _J3) {
        if (_H3 !== this._r3[_t2]) {
            this._x3[_t2]._A3(_H3);
            this._r3[_t2] = _H3;
        }
        if (_I3 !== this._s3[_t2]) {
            if (_t2 % 2 === 1) {
                this._x3[_t2]._C3(_I3);
            }
            this._s3[_t2] = _I3;
        }
        if (_J3 !== this._t3[_t2]) {
            this._x3[_t2]._B3(_J3);
            this._t3[_t2] = _J3;
        }
    }
}
registerProcessor("tremolo-processor", _q3);
function _u3() {}
_u3._v3 = {
    _w3: 0,
    _K3: 1,
    _L3: 2,
    _M3: 3,
    _N3: 4,
    _O3: 5
};
_u3._P3 = function(_Q3) {
    return 1.0 - _Q3;
}
;
_u3._R3 = function(_Q3) {
    return _Q3;
}
;
_u3._S3 = function(_Q3) {
    return 0.5 * (Math.sin((_Q3 * 2.0 * Math.PI) - (Math.PI / 2.0)) + 1.0);
}
;
_u3._T3 = function(_Q3) {
    if (_Q3 < 0.5) {
        return 0.0;
    }
    return 1.0;
}
;
_u3._U3 = function(_Q3) {
    if (_Q3 < 0.5) {
        return 2.0 * _Q3;
    }
    return 2.0 - (2.0 * _Q3);
}
;
_u3._V3 = [_u3._P3, _u3._R3, _u3._S3, _u3._T3, _u3._U3];
_W3._X3 = 512;
_W3._Y3 = 1.0 / _W3._X3;
function _W3(_Z3) {
    this.data = new Float32Array(_W3._X3);
    for (let i = 0; i < _W3._X3; ++i) {
        this.data[i] = _Z3(i * _W3._Y3);
    }
}
_W3.prototype._r2 = function(_Q3) {
    _Q3 = Math.max(0.0, _Q3);
    _Q3 = Math.min(_Q3, 1.0);
    const __3 = _Q3 * _W3._X3;
    const _04 = ~~__3;
    const _14 = __3 - _04;
    let _w2 = _04;
    let _x2 = _w2 + 1;
    if (_w2 >= _W3._X3) {
        _w2 -= _W3._X3;
    }
    if (_x2 >= _W3._X3) {
        _x2 -= _W3._X3;
    }
    const _y2 = this.data[_w2];
    const _z2 = this.data[_x2];
    return _y2 + (_z2 - _y2) * _14;
}
;
_y3._24 = [];
_y3._34 = false;
_y3._44 = 0.0;
_y3._54 = 20.0;
function _y3() {
    this._64 = 48000;
    this.shape = _u3._v3._L3;
    this._74 = 1.0;
    this._84 = 0.0;
    this._Y3 = 0.0;
    this._94 = 0.0;
    if (_y3._34 == true) {
        return;
    }
    for (let i = 0; i < _u3._v3._O3; ++i) {
        _y3._24[i] = new _W3(_u3._V3[i]);
    }
    _y3._34 = true;
}
_y3._a4 = function() {
    return (_y3._34 == true);
}
;
_y3.prototype._z3 = function(_b4) {
    this._64 = _b4;
    this._c4();
}
;
_y3.prototype._A3 = function(_d4) {
    _d4 = Math.max(_y3._44, _d4);
    _d4 = Math.min(_d4, _y3._54);
    this._74 = _d4;
    this._c4();
}
;
_y3.prototype._C3 = function(_I3) {
    _I3 = Math.max(0.0, _I3);
    _I3 = Math.min(_I3, 1.0);
    const _e4 = _I3 - this._94;
    this._94 = _I3;
    this._84 += _e4;
    while (this._84 >= 1.0) {
        this._84 -= 1.0;
    }
    while (this._84 < 0.0) {
        this._84 += 1.0;
    }
}
;
_y3.prototype._B3 = function(_J3) {
    _J3 = Math.max(0, _J3);
    _J3 = Math.min(_J3, _u3._v3._O3 - 1);
    this.shape = _J3;
}
;
_y3.prototype._r2 = function() {
    const result = _y3._24[this.shape]._r2(this._84);
    this._84 += this._Y3;
    while (this._84 >= 1.0) {
        this._84 -= 1.0;
    }
    return result;
}
;
_y3.prototype._c4 = function() {
    this._Y3 = this._74 / this._64;
}
;
