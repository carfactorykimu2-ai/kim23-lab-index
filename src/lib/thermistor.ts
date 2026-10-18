// NTCサーミスタの B定数と温度-抵抗特性の計算。
//   B    = ln(Ra / Rb) / (1/Ta − 1/Tb)        … 2点（Ta, Ra）（Tb, Rb）から B定数
//   R(T) = R0 × exp(B × (1/T − 1/T0))          … 基準点（T0, R0）と B定数から各温度の抵抗
//   V2   = Vin × R / (Rpu + R)                 … プルアップ Rpu で分圧したときの ECU入力電圧
// 温度は [°C] で受け取り、内部で絶対温度 [K] に変換する。

const KELVIN = 273.15;

/** 2点の温度 [°C] と抵抗 [Ω] から B定数 [K] を求める */
export function bConstant(ta: number, ra: number, tb: number, rb: number): number {
	return Math.log(ra / rb) / (1 / (ta + KELVIN) - 1 / (tb + KELVIN));
}

/** 基準温度 t0 [°C] の抵抗 r0 [Ω] と B定数から、温度 t [°C] の抵抗 [Ω] を求める */
export function resistanceAt(t: number, t0: number, r0: number, b: number): number {
	return r0 * Math.exp(b * (1 / (t + KELVIN) - 1 / (t0 + KELVIN)));
}

/** プルアップ抵抗 rpu で分圧したときの ECU入力電圧 [V] */
export function dividerVoltage(vin: number, rpu: number, r: number): number {
	return (vin * r) / (rpu + r);
}

/** start から end まで step 刻みの温度リスト（end を含む）。浮動小数の誤差は丸める */
export function temperatureSteps(start: number, end: number, step: number): number[] {
	const n = Math.floor((end - start) / step + 1e-9);
	return Array.from({ length: n + 1 }, (_, i) => Number((start + i * step).toFixed(6)));
}
