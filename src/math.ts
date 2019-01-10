import {Vector3} from "babylonjs"

export function sign(value: number): number {
    return value > 0 ? 1 : value === 0 ? 0 : -1;
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number) {
    return value < min ? min : (value > max ? max : value);
}

export function intersect(a1: Vector3, a2: Vector3, b1: Vector3, b2: Vector3): Vector3 {
    let slopeA = (a2.z - a1.z) / (a2.x - a1.x);
    let slopeB = (b2.z - b1.z) / (b2.x - b1.x);

    if (Math.abs(slopeA - slopeB) < 1e-8) {
        return new Vector3(NaN, NaN, NaN);
    }

    let result: Vector3 = new Vector3();

    result.x = (slopeA * a1.x - slopeB * b1.x + b1.z - a1.z) / (slopeA - slopeB);

    result.z = slopeB * (result.x - b1.x) + b1.z;

    return result;
}
