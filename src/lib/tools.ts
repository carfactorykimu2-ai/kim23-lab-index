// 公開中のツール一覧。Tools ページと、記事ページの「関連ツール」で使う。
// note記事の索引（content/articles/note/）はインポートで作り直されるため、
// 記事とツールの紐付けは記事側ではなくここ（articles: 記事ID）で持つ。

export interface Tool {
	slug: string;
	title: string;
	description: string;
	articles: string[];
}

export const tools: Tool[] = [
	{
		slug: 'pwm',
		title: 'PWMシミュレータ',
		description: 'PWM周波数とDutyを入力して、周期・ON時間の計算と時間波形を確認するツール。',
		articles: ['misc-624e06'],
	},
	{
		slug: 'pullup',
		title: 'プルアップ抵抗 逆算ツール',
		description: '既知の抵抗とECU入力電圧からプルアップ抵抗を、プルアップ抵抗と入力電圧からセンサ抵抗を計算するツール。',
		articles: ['pullup-resistor-from-voltage-and-resistance', 'misc-a2b1f2'],
	},
	{
		slug: 'thermistor',
		title: 'サーミスタ B定数・温度-抵抗表',
		description: '2点の温度と抵抗からNTCサーミスタのB定数を計算し、-40〜160℃の温度-抵抗表（ECU入力電圧つき）を作るツール。',
		articles: ['misc-a2b1f2', 'pullup-resistor-from-voltage-and-resistance'],
	},
];

export function toolsForArticle(articleId: string): Tool[] {
	return tools.filter((t) => t.articles.includes(articleId));
}
