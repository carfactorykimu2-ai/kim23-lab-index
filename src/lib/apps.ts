// 公開中のアプリ一覧。Apps ページで使う。
// 計算ツール（Tools）と違い、実機（BLE / CAN 機器など）とつないで操作するスマホ向けアプリを置く。
// 各アプリは静的ページとして public/apps/<slug>/index.html に置く。

export interface App {
	slug: string;
	title: string;
	description: string;
}

export const apps: App[] = [
	{
		// Web Bluetooth を使うため https のこのサイトから開く
		slug: 'canio-vdi',
		title: 'CAN I/O 仮想DI（スマホ BLE）',
		description: 'スマホから自作 CAN I/O（CAN_IO_XIAO）や CAN_GPS_LOGGER に BLE で接続し、DI1〜8（Momentary / Toggle / Accumulator）を CAN に出すリモコン。Android は Chrome、iPhone は Bluefy で開く。',
	},
];
