# APローグ v4

応用情報技術者試験の学習をテーマにした、ブラウザで遊べるローグライクRPGの v4 です。

## 起動方法

`index.html` をブラウザで開いてください。スマホでもPCでも動きます。

## v4で追加した機能

- 学習カレンダー
- 合格可能性スコア
- 今日のおすすめ学習
- ミニ模擬試験
  - 午前ミニ模試
  - 弱点集中模試
  - 午後ミニ模試
- 問題エディタ
- 称号システム
- 成績分析画面

## v3から継続している機能

- ローグ探索
- ランダム部屋選択
- 知識カード
- 因縁モンスター再戦
- 午後問題風の事件クエスト
- 証拠カードによる調査パート

## 問題について

内蔵問題は、IPA公開過去問題の頻出テーマを参考にしたオリジナル問題です。公式問題をそのまま収録していません。

過去問題をそのまま収録する場合は、IPAの利用条件に従い、年度・試験区分・問番号などの出典を明記してください。問題文を改変した場合は「一部改変」などの注記を入れる運用を推奨します。

## 保存データ

成績、追加問題、模試履歴、カレンダー記録はブラウザの localStorage に保存されます。

## ファイル構成

```text
ap_rogue_v4/
  index.html
  style.css
  game.js
  README.md
  assets/
    monsters/
      sql_slime.png
      dns_ghost.png
      deadlock_golem.png
      buffer_dragon.png
      audit_specter.png
      critical_path_worm.png
```


## v4 imagefix について

一部のスマホ環境やZIP内プレビューでは、`assets/monsters/*.png` の相対パス画像が読み込めないことがあります。  
この imagefix 版では、ゲーム内で使うモンスター画像を `data:image/png;base64` としてHTML/JSへ埋め込んでいるため、`index.html` 単体でも画像が表示されやすくなっています。

通常はこのフォルダの `index.html` を開けば動きます。GitHub Pagesなどに置く場合もそのままアップロードできます。


- 2026-05 mobile layout update: battle / case battle / mock battle screens were compacted to fit on one screen more easily on iPhone-size displays.


## v4 expanded

- 内蔵の通常4択問題を105問追加しました。
- 通常問題は合計129問、午後事件クエスト内の設問12問を含めると合計141問です。
- 追加問題はIPA公開過去問題の頻出テーマを参考にしたオリジナル問題で、公式問題の転載ではありません。
