

export function setFlag(flag: number, mask: number): number {
    return flag | mask;
}

export function removeFlag(flag: number, mask: number): number {
    return flag & (~mask);
}

export function isFlagSet(flag: number, mask: number): boolean {
    return (flag & mask) === mask;
}