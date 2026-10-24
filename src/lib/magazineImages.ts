/**
 * マガジンのカードに出すサムネイルを決める。
 * - note のマガジンカバー: public/images/note-mag/ (scripts/fetch_note_magazine_covers.py で取得)
 * - 手元の写真: public/images/mag/ (scripts/build_site_images.py で生成)
 */
import noteCovers from './noteMagazineCovers.json';

/** マガジン名の完全一致で指定するもの。記事数の多いマガジンで同じ写真が並ばないようにする。 */
const BY_NAME: Record<string, string> = {
	'アルトワークス フルコン化 HA22S事例': 'altoworks',
	'ECUフルコン化への道': 'ecu-case',
	'LINKECU 関連': 'link-g4',
	'ソニカ KF-DET フルコン化': 'sonica',
	'エッセ ESSE LINKECU フルコン化 への道': 'esse',
	'新規格 K6A フルコン化情報': 'k6a-engine',
	'HA22S 部品関連情報': 'k6a-engine',
	'CAN 設定への道': 'motec-dash',
	'データ': 'afr-gauge',
};

/** 名前に含まれる語で決めるもの。上から順に最初に当たったものを使う。 */
const BY_KEYWORD: [RegExp, string][] = [
	[/アルト|ワークス/, 'altoworks'],
	[/ソニカ/, 'sonica'],
	[/エッセ|ESSE/i, 'esse'],
	[/maxx/i, 'maxxecu'],
	[/PMU|ADU|ECUmaster|PDM/i, 'ecumaster-pmu'],
	[/MOTEC|AIM|Dash|CAN/i, 'motec-dash'],
	[/インジェクター|燃料/, 'injector'],
	[/コイル|点火|Dwell/i, 'coil'],
	[/センサ|圧力|温度/, 'sensor'],
	[/計測|空燃比|lambda/i, 'afr-gauge'],
	[/LINK/i, 'link-g4'],
	[/配線|ハーネス|コネクタ/, 'harness'],
	[/フルコン|ECU/i, 'ecu-case'],
];

/** 空白の違いを無視して note 側のマガジン名と突き合わせる */
const normalize = (name: string) => name.replace(/\s+/g, '');
const NOTE_COVER = new Map(Object.entries(noteCovers).map(([name, key]) => [normalize(name), key]));

/**
 * サムネイルの URL。note のマガジンカバー → 手元の写真 の順に探し、
 * どちらもなければ undefined (カード側で模様を出す)。
 */
export function magazineImage(name: string, base: string): string | undefined {
	const cover = NOTE_COVER.get(normalize(name));
	if (cover) return `${base}images/note-mag/${cover}.webp`;
	const key = BY_NAME[name] ?? BY_KEYWORD.find(([re]) => re.test(name))?.[1];
	return key && `${base}images/mag/${key}.webp`;
}
