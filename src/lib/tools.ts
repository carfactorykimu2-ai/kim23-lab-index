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
		articles: ['misc-linkecu-8674a0', 'misc-a2b1f2'],
	},
	{
		slug: 'thermistor',
		title: 'サーミスタ B定数・温度-抵抗表',
		description: '2点の温度と抵抗からNTCサーミスタのB定数を計算し、-40〜160℃の温度-抵抗表（ECU入力電圧つき）を作るツール。',
		articles: ['misc-a2b1f2', 'misc-linkecu-8674a0'],
	},
	{
		slug: 'fuelpump',
		title: '燃料ポンプ LO/HI 切替計算',
		description: 'LINK ECU の燃料ポンプ2速制御（RPM XOver / Inj デューティ XOver）を、インジェクター流量・燃圧・LO時ポンプ流量から計算するツール。',
		articles: [
			'misc-751ad4',
			'altoworks-linkecu-step19-f71505',
			'esse-linkecu-step19-b57fa5',
			'altoworks-linkecu-e70d48',
			'altoworks-59ffdc',
			'sonica-c2d14c',
		],
	},
];

export function toolsForArticle(articleId: string): Tool[] {
	return tools.filter((t) => t.articles.includes(articleId));
}
