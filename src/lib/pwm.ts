// PWM.xlsx (シート "PWM") の計算式をそのまま移植したもの。
//   C4 = 1/C3            … 周期 [s]
//   D4 = D3/100*C4       … ON時間 [s]
//   C列 = B/$C$4         … PWMCYCLE (経過周期数)
//   D列 = MOD(B,$C$4)    … 周期内の経過時間
//   E列 = IF(D<($C$4/100),2,0) … PWM Cycle (周期の先頭マーカー)
//   F列 = IF(D<$D$4,1,0)       … PWM ON

/** Excel の B列 (Time) の刻み。0.1ms = 10000 サンプル/秒 */
export const EXCEL_SAMPLES_PER_SEC = 10000;

/** 浮動小数の誤差で周期境界の判定がぶれないようにするための許容値（周期に対する比） */
const EPS = 1e-9;

export interface PwmParams {
	/** 周期 [s] */
	period: number;
	/** ON時間 [s] */
	onTime: number;
	/** OFF時間 [s] */
	offTime: number;
}

export interface PwmSample {
	/** PWMCYCLE: 経過周期数 (t / 周期) */
	cycle: number;
	/** 周期内の経過時間 [s] (MOD(t, 周期)) */
	mod: number;
	/** PWM Cycle: 周期の先頭 1% の間だけ 2 */
	marker: 0 | 2;
	/** PWM ON: ON時間の間だけ 1 */
	on: 0 | 1;
}

export function pwmParams(frequencyHz: number, dutyPercent: number): PwmParams {
	const period = 1 / frequencyHz;
	const onTime = (dutyPercent / 100) * period;
	return { period, onTime, offTime: period - onTime };
}

export function pwmSample(t: number, frequencyHz: number, dutyPercent: number): PwmSample {
	const period = 1 / frequencyHz;
	const cycle = t / period;
	// 周期内の位置 (0以上1未満)。境界のすぐ手前は次の周期の先頭として扱う
	const phase = Math.max(0, cycle - Math.floor(cycle + EPS));
	return {
		cycle,
		mod: phase * period,
		marker: phase < 0.01 - EPS ? 2 : 0,
		on: phase < dutyPercent / 100 - EPS ? 1 : 0,
	};
}
