# kim23-lab-index

ECUフルコン化・CAN解析・車両データ計測の記事を、マガジン単位で整理し、メタデータ検索できる静的サイト（Astro製）。
記事本文は [note.com「Kim23 Test Laboratory」](https://note.com/labratory_ktech) で公開し、本サイトはメタデータ索引＋横断検索を提供します。

## 🚀 プロジェクト構成

```text
/
├── content/articles/         記事Markdown（front matter管理）
│   ├── *.md                    手動で書く記事
│   └── note/*.md                note.com記事のメタデータ索引（自動生成、直接編集しない）
├── data/                     ビルドに使う非公開ソースデータ（サイトには公開されない）
│   └── note_articles_metadata.xlsx   note.com記事メタデータのエクスポート
├── public/data/samples/      Toolsページが読み込む公開用サンプルデータ置き場（拡張用）
├── scripts/
│   └── import_note_articles.py  xlsx → content/articles/note/*.md 変換スクリプト
├── src/
│   ├── content.config.ts     記事コレクションのスキーマ定義
│   ├── layouts/Base.astro    共通レイアウト（ナビ・スタイル）
│   ├── lib/slug.ts           マガジン名 → URLスラグ変換
│   └── pages/
│       ├── index.astro         Home
│       ├── magazines/          マガジン一覧・詳細
│       ├── articles/           記事一覧・詳細
│       ├── search/             全文検索＋メタデータ検索
│       ├── search-index.json.ts  検索用データのビルド時生成エンドポイント
│       ├── tools/               計算・分析ツール置き場（雛形）
│       └── data/                Dataセクション説明ページ
└── astro.config.mjs
```

## 📝 記事front matter設計

`content/articles/*.md` の front matter は [src/content.config.ts](src/content.config.ts) でスキーマ管理しています。

| フィールド | 型 | 説明 |
| :--- | :--- | :--- |
| `title` | string（必須） | 記事タイトル |
| `date` | date | 公開日 |
| `summary` | string | 概要（検索・一覧カードに使用） |
| `magazine` | string[] | 所属マガジン（複数可） |
| `tags` | string[] | タグ（`#`なし） |
| `category` | string | カテゴリ（例: STEP本編、CAN通信・周辺機器連携） |
| `step` | string | フルコン化手順のSTEP番号（例: `STEP2`） |
| `car_model` | string | 対象車種 |
| `ecu` | string[] | 対象ECU（複数可） |
| `device` | string | 使用デバイス（将来のCAN/ツール記事向け） |
| `can_id` | string | 対象CAN ID（将来のCAN解析記事向け） |
| `price` | number | note.com側の価格（0=無料） |
| `note_url` | string(url) | note.com記事へのリンク |
| `related` | string[] | 関連記事のslug（`content/articles`内のファイル名） |

## 🔍 検索機能

[src/pages/search/index.astro](src/pages/search/index.astro) が [Fuse.js](https://www.fusejs.io/) を使い、
ビルド時に生成される `search-index.json`（title/summary/tags/magazine/car_model/ecu/category）に対して全文検索を行います。
マガジン・車種・ECUのプルダウンや、タグチップによる絞り込みも同じデータに対してクライアント側で適用されます。

## 📚 note.com記事のインポート・再インポート

`data/note_articles_metadata.xlsx`（note.comからエクスポートした記事メタデータ）を編集・差し替えたら、以下で再生成できます。

```bash
python scripts/import_note_articles.py
```

（または `npm run import:note`。Python 3 + `pip install openpyxl` が必要です。）

このスクリプトは `content/articles/note/` フォルダを毎回作り直すため、このフォルダ内は直接編集しないでください。
手動で書く記事は `content/articles/` 直下（`note/` の外）に置いてください。

## 🧞 コマンド

| コマンド | 内容 |
| :--- | :--- |
| `npm install` | 依存関係のインストール |
| `npm run dev` | ローカル開発サーバー起動（`http://localhost:4321/kim23-lab-index/`） |
| `npm run build` | `./dist/` に本番ビルド |
| `npm run preview` | ビルド済みサイトをローカルでプレビュー |
| `npm run import:note` | note.comメタデータExcelから記事を再生成 |
| `preview.bat` | ビルド→プレビュー起動→ブラウザを自動オープン（Windows） |

devサーバーは [AGENTS.md](AGENTS.md) の指示通りバックグラウンドモードで起動できます。

```bash
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## 🌐 GitHub Pages公開

[astro.config.mjs](astro.config.mjs) で `site` / `base: '/kim23-lab-index/'` を設定済みです。
[.github/workflows/astro.yml](.github/workflows/astro.yml) が `main` ブランチへのpushで自動ビルド・デプロイします。

初回のみ、GitHubリポジトリの **Settings → Pages → Build and deployment → Source** を「GitHub Actions」に設定してください。

ローカルで `npm run dev` （またはビルド後 `npm run preview`）で確認し、問題なければ GitHub Desktop 等で `main` に push するだけで公開されます。

## 👀 もっと知りたい

[Astroのドキュメント](https://docs.astro.build) を参照してください。
