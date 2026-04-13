## ToDo
- [x] 「透徹力」による計算処理
- [ ] サイトシェア機能の実装
- [ ] 各パラメータ値の保存機能（CSV入出力）
- [ ] 物理ストラップ表現（金具、留め具、紐のデザイン、クリック時の挙動、引っ張る動作）

- [x] 入力フィールドのヘッダーを太字にする
- [x] カードの背景を画像にする
- [x] 言語セレクトに🌎マークを付ける　→　svgで探す
- [x] 言語セレクトに開閉アニメーションをつける
- [x] 言語セレクトのoptionsはフル表記の言語を表示する
- [x] フッターのリンクのカラーを変更する
- [x] キャラクター画像をホバーしたとき、Borderを表示する　→　黄色
- [x] ホバーして２秒後にツールチップを表示させる
- [x] resetBtnのホバー時のOpacityを代替する
- [ ] 計算モードにもカーソルを合わせるようにする（TabIndex）
- [x] 英語表示の時のラベルの最適化を図る　→　見切れ、不自然な空白など
- [ ] キャラのempty画像のサイズ感を合わせる

### 透徹力
- 攻撃力 30% + 最大HP 10% で求められる
  - 基礎攻撃力: 872 / HP: 7953  
    = (873 × 0.3) + (7953 × 0.1)  
    = 261.9 + 795.3  
    = 261 + 795　　// 少数切り捨て  
    = 1,056
- 攻撃力は、基礎攻撃力なのか開幕攻撃力なのかは調査中
- ダメージの計算は、透徹力のみを参照しているのか他のステータス（攻撃力）が絡んでいるのかは調査中

## ファイル構成
```
📁 root/
├── 📁 assets/
│   ├── 📁 css/
│   ├── 📁 data/
│   │   ├── 📁 languages/               # 言語データ
│   │   ├── 📁 tables/                  
│   │   │   ├── attributes.json         # 属性テーブル
│   │   │   ├── match.json              # 属性相性補正テーブル
│   │   │   ├── miasma-buff.json        # ミアズマシールド補正テーブル
│   │   │   └── range.json              # 距離減衰補正テーブル
│   │   ├── agents.json                 # エージェント情報
│   │   ├── enemies.json                # エネミー情報
│   │   ├── helpTexts.json              # ヘルプテキスト
│   │   └── languages.json              # 言語一覧
│   ├── 📁 image/                       # UI で使用する画像
│   └── 📁 js/
│       ├── 📁 calculate/
│       │   ├── compute-anomaly.js      # 状態異常モードのダメージ計算
│       │   ├── compute-handler.js      # 計算処理の中央ロジック
│       │   ├── compute-normal.js       # 通常モードのダメージ計算
│       │   ├── fmt.js                  # 数値を指定桁数でフォーマット
│       │   └── math-utils.js           # 数値処理を行うユーティリティ
│       ├── 📁 core/
│       │   ├── base-path.js            # 実行環境に応じてベースパスを返す
│       │   ├── main.js                 # アプリケーションのエントリーポイント
│       │   └── validation.js           # バリデーション / データ検証
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
│           │   └── mode.js             # モード切り替えによる UI 
│           ├── copy.js                 # 「結果カード」の値をコピーする
│           ├── custom-select.js        # Custom Select を生成する
│           ├── details-animation.js    # details要素の閉じるアニメーションを制御する
│           ├── dom-helpers.js          # DOM 操作の基盤ユーティリティ
│           ├── generate-options.js     # Custom Select の Option を取得する
│           ├── language.js             # data-i18n 系属性を使用して UI テキストを更新する
│           ├── load-css.js             # CSS を動的に読み込むユーティリティ
│           ├── mode.js                 # 計算モードの状態を取得を担当するモジュール
│           ├── popup.js                # ポップアップの表示制御
│           ├── result-fixed.js         # モバイル時の「結果パネル」を制御する
│           ├── strap-physics.js        # 物理ストラップの生成、制御を担当するモジュール
│           └── toast.js                # トースト通知の表示制御
├── 📄 CHANGELOG.md
├── 📄 README.md
└── index.html
```