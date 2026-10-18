// プルアップ分圧回路の計算。
//   V2 = Vin × R2 / (R1 + R2)
//   R1 = Ra × (Vin − V2) / V2      … 既知抵抗 Ra を接続して R1 を逆算
//   R2 = R1 × V2 / (Vin − V2)      … R1 が分かっているときのセンサ抵抗

/** 既知抵抗 Ra を接続したときの ECU入力電圧 V2 から、プルアップ抵抗 R1 を求める */
export function pullupFromKnown(vin: number, ra: number, v2: number): number {
	return (ra * (vin - v2)) / v2;
}

/** プルアップ抵抗 R1 と ECU入力電圧 V2 から、センサ抵抗 R2 を求める */
export function sensorFromPullup(vin: number, r1: number, v2: number): number {
	return (r1 * v2) / (vin - v2);
}

/** V2 が 0 < V2 < Vin の範囲にあるか（範囲外は計算できない） */
export function isValidV2(vin: number, v2: number): boolean {
	return v2 > 0 && v2 < vin;
}

/**
 * "2.2k" "2k2" "4.7K" "1000" "1M" "470" などの抵抗値表記を Ω に変換する。
 * 解釈できなければ NaN。
 */
export function parseResistance(text: string): number {
	const s = text
		.normalize('NFKC')
		.trim()
		.replace(/[Ωω]|ohms?/gi, '')
		.replace(/[,\s]/g, '');
	const m = /^(\d*\.?\d*)([kKmMrR]?)(\d*)$/.exec(s);
	if (!m) return NaN;
	const [, head, unit, tail] = m;
	const mult = { '': 1, r: 1, k: 1e3, m: 1e6 }[unit.toLowerCase() as '' | 'r' | 'k' | 'm'];
	if (head === '' && tail === '') return NaN;
	if (tail !== '') {
		// 2k2 形式（単位文字が小数点の代わり）。単位なしで数字が続くことはない
		if (unit === '' || head.includes('.') || head === '') return NaN;
		return Number(`${head}.${tail}`) * mult;
	}
	const v = Number(head);
	return Number.isFinite(v) ? v * mult : NaN;
}

/** 抵抗値を "2.2 kΩ" のような表示用文字列にする */
export function formatResistance(ohm: number): string {
	if (!Number.isFinite(ohm)) return '–';
	const abs = Math.abs(ohm);
	const r = (v: number) => String(Number(v.toPrecision(5)));
	if (abs >= 1e6) return `${r(ohm / 1e6)} MΩ`;
	if (abs >= 1e3) return `${r(ohm / 1e3)} kΩ`;
	return `${r(ohm)} Ω`;
}
