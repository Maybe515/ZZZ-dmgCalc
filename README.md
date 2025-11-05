# ゼンレスゾーンゼロ ダメージ計算ツール (ZZZ-DmgCalc)

本ツールは、ゲーム内の数値をもとに検証を目的としたツールです。  
ゲーム内の仕様変更により、実際の数値と異なる場合がございます。
<br>

## 🚀 Features
### - For Users -
- **通常ダメージ** / **状態異常ダメージ** に計算モードを切替
- 計算結果に **通常時**、**会心時**、**期待値** を表示（状態異常ダメージは **期待値** のみ）
- **エージェント** / **エネミー** 選択時にアイコンや情報を表示
- エージェントアイコンをクリックすると、各エージェントの HoYoWiki のページを表示
- スマホやモバイルでは見やすいように縦表示（レスポンシブ対応）
- **計算結果** を画面下部に固定表示（モバイル向けUI）
- **計算結果** の数値をクリップボードへコピー可
- オプションによる小数点表示
- ヘルプテキストによる補足表示

### - For Developers -
- JSON駆動のデータ構造でエージェント・エネミー情報やヘルプテキストの新規追加に柔軟に対応。

- **UI/UX 設計**  
  - BEM命名規則 + UtilityクラスによるCSS設計
  - `data-mode` 属性による状態管理（通常・状態異常）
  - `Flex` / `Grid` レイアウトで均等幅を実現
  - `card--two-column` レイアウトで左右均等幅  
  - `kv__label` / `kv__value` の横並び表示  
  - `.text-ellipsis` による省略表示対応  
  - `result--fixed` によるモバイル下部固定表示
- **アクセシビリティ**  
  - セマンティックなHTML構造  
  - ARIA属性・キーボード操作対応  
- **レスポンシブデザイン**  
  - `Width 1000px`以上では `.result--fixed` を非表示  
  - 小画面（`Width 600px`以下）では横並びを維持（横スクロール対応）

<br>

## 🔧 Tech Stack
- HTML5 / CSS3 (BEM命名 + Utilityクラス)
- JavaScript (EM Modules)
- JSON-driven data

<br>

## 📂 Project Structure
```
📂 project-root/
├─📂 assets/
│  ├─📂 agent/      # エージェントアイコン
│  ├─📂 faction/    # 陣営アイコン
│  ├─📂 rank/       # ランク画像
│  ├─📂 specialty/  # 役割アイコン
│  └─📂stats/       # 属性アイコン
├─📂 css/
│  └─style.css
├─📂 js/
│  ├─calc.js    # 計算ロジック
│  ├─data.js    # データ（MappingData, Tables, Paths）
│  ├─lang.js    # 言語切替（作成中）
│  ├─main.js    # メインエントリー
│  └─ui.js      # UI制御
├─📂 json/
│  ├─agents.json        # エージェント情報
│  ├─enemies.json       # エネミー情報
│  ├─helpTexts.json     # ヘルプテキスト群
│  └─lvCoeffTable.json  # レベル係数テーブル
├─ index.html           # エントリーページ
├─ 📄 ChangeLog.md
└─ 📄 README.md
```
<br>

## 📐 Development Guidelines
- **CSS**
  - BEM命名規則 (`block__element--modifier`)
  - 汎用ユーティリティクラス（例: `.text-ellipsis`, `.u-fade-hover`）を活用
- **HTML**
  - `<div>` / `<span>` に統一した kv-list 構造
  - `data-mode="mode--anomaly"` による状態切替制御
- **JavaScript**
  - ES Modules 構成 (`import` / `export`)
  - JSONデータを読み込み、UIを動的生成

<br>

## 📝 Changelog
詳しくは [CHANGELOG.md](https://github.com/Maybe515/ZZZ-dmgCalc/blob/test/CHANGELOG.md) をご覧ください。

<br>

## 🔮 Roadmap / ToDo
- [ ] エネミー情報を追加する
- [ ] エネミーアイコンをエージェントのように表示する
- [ ] 更新履歴をサイト上から表示できるようにする
- [ ] 多言語対応（日本語 / 英語）
- [ ] サイトシェア機能の実装

<br>

## 📚 References / Resources
- HoYoverse公式サイト: [Zenless Zone Zero](https://zenless.hoyoverse.com/)
- HoYoWiki: [Zenless Zone Zero](https://wiki.hoyolab.com/pc/zzz/)
- MDN References: https://developer.mozilla.org/ja/docs/Web/CSS/Reference
- 崩壊インパクトレール学園3rd全レス無関係ゾーン Wiki*: [ダメージ・状態異常・混沌の計算式](https://wikiwiki.jp/mukankeizone/%E3%83%80%E3%83%A1%E3%83%BC%E3%82%B8%E3%83%BB%E7%8A%B6%E6%85%8B%E7%95%B0%E5%B8%B8%E3%83%BB%E6%B7%B7%E6%B2%8C%E3%81%AE%E8%A8%88%E7%AE%97%E5%BC%8F)
- ゼンレスゾーンゼロ Wiki*: [ダメージ計算式](https://wikiwiki.jp/zenless/%E3%83%80%E3%83%A1%E3%83%BC%E3%82%B8%E8%A8%88%E7%AE%97%E5%BC%8F)

<br>

## 🤝 Contributing
改善提案やバグ報告、ご要望等は以下よりご連絡ください。
- GitHub: [ZZZ-dmgCalc - Issues](https://github.com/Maybe515/ZZZ-dmgCalc/issues)
- HoYoLAB: [めいびぃ / Maybe515](https://www.hoyolab.com/accountCenter/postList?id=144180942)

<br>

## ⚠️ Disclaimer
本ツールは非公式のファンメイドツールであり、HoYoverse とは一切関係がありません。  
ゲーム内の仕様変更により、実際の数値とは異なる場合があります。

This is an unofficial fan-made tool for testing purposes and is not affiliated with or endorsed by HoYoverse.  
Due to possible game updates, actual values may differ.

「HoYoverse」および「ゼンレスゾーンゼロ」は HoYoverse の商標または登録商標です。  
ゲーム内のコンテンツおよびリソースの著作権はすべて HoYoverse に帰属します。

© HoYoverse. All rights reserved.  
"HoYoverse" and "Zenless Zone Zero" are trademarks or registered trademarks of HoYoverse.

<br>

## 📜 License
本プロジェクトは主に個人利用を目的としています。  
再配布または商用利用は禁止されています。

© 2025 [Maybe515](https://www.hoyolab.com/accountCenter/postList?id=144180942). All rights reserved.  
This project is for <ins>**personal/fan use only**</ins>. Redistribution or commercial use is prohibited.

<br>





