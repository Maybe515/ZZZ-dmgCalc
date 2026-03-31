```
📁 root/
├── 📁 assets/
│   ├── 📁 css/
│   ├── 📁 data/
│   │   ├── 📁 languages/               # 言語データ
│   │   ├── 📁 tables/                  
│   │   │   ├── match.json              # 属性相性補正テーブル
│   │   │   └── range.json              # 距離減衰補正テーブル
│   │   ├── agents.json                 # エージェント情報
│   │   ├── attributes.json             # 属性情報
│   │   ├── enemies.json                # エネミー情報
│   │   └── helpTexts.json              # ヘルプテキスト
│   ├── 📁 image/                       # UI で使用する画像
│   └── 📁 js/
│       ├── 📁 calc/
│       │   ├── compute-anomaly.js      # 状態異常モードのダメージ計算
│       │   ├── compute-handler.js      # 計算処理の中央ロジック
│       │   ├── compute-normal.js       # 通常モードのダメージ計算
│       │   ├── fmt.js                  # 数値を指定桁数でフォーマット
│       │   └── math-utils.js           # 数値処理を行うユーティリティ
│       ├── 📁 core/
│       │   ├── base-path.js            # 実行環境に応じてベースパスを返す
│       │   └── main.js                 # アプリケーションのエントリーポイント
│       ├── 📁 data/
│       │   ├── data-loader.js          # JSON データのロードとセレクト生成を担当するモジュール
│       │   ├── default.js              # 入力フィールドおよびセレクト要素のデフォルト値
│       │   ├── form-config.js          # UI フィールド構成と、保存・復元に使うマッピング定義
│       │   ├── lv-coefficient-table.js # レベル係数テーブル
│       │   ├── paths.js                # 画像パスおよび外部リンクの定義
│       │   └── state.js                # JSON ロード後に内容が書き込まれる「アプリ内データストア」
│       ├── 📁 events/
│       │   ├── bind-events.js          # UI のイベントバインドを担当するモジュール
│       │   └── init.js                 # UI 初期化とデフォルト適用を担当するモジュール
│       ├── 📁 i18n/
│       │   └── i18n-helpers.js         # i18n(国際化) 関連のヘルパー関数
│       ├── 📁 storage/
│       │   └── local-storage.js        # UI 状態の保存・復元を担当するモジュール
│       └── 📁 ui/
│           ├── 📁 updates/
│           │   ├── agent.js            # エージェントUI 更新
│           │   ├── break.js            # ブレイクUI 更新
│           │   ├── derived.js          # 派生フィールド更新
│           │   ├── enemy.js            # エネミーUI 更新
│           │   ├── helpers.js          # UI 更新の基礎関数
│           │   ├── match.js            # 属性相性の自動判定
│           │   └── mode.js             # モード切り替えによる UI 更新
│           ├── copy.js                 # 「結果カード」の値をコピーする
│           ├── details-animation.js    # details要素の閉じるアニメーションを制御する
│           ├── dom-helpers.ja          # DOM 操作の基盤ユーティリティ
│           ├── generate-select.ja      # Select 要素を自動生成する
│           ├── language.js             # data-i18n 系属性を使用して UI テキストを更新する
│           ├── load-css.js             # CSS を動的に読み込むユーティリティ
│           ├── mode.js                 # 計算モードの状態を取得を担当するモジュール
│           ├── popup.js                # ポップアップの表示制御
│           ├── result-fixed.js         # モバイル時の「結果パネル」を制御する
│           └── toast.js                # トースト通知の表示制御
├── 📄 CHANGELOG.md
├── 📄 README.md
└── index.html
```