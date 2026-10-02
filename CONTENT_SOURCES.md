# 教材・図解の参考情報

確認日：2026-10-02。文章・練習メニュー・SVG・アイコンは本アプリ用に作成したオリジナルです。参考サイトの文章や画像を転載していません。

以下のページを取得し、初心者向けの教材構成・用語・基本の確認に使用しました。

| 関連レッスン | 参考ページ |
| --- | --- |
| 全体 | [GDO ゴルフ初心者ガイド](https://www.golfdigest.co.jp/beginner/) |
| L01 グリップ | [ゴルフクラブの握り方](https://www.golfdigest.co.jp/beginner/practice/load_grip.asp) |
| L02・L03 構え・狙い | [ゴルフクラブの構え方](https://www.golfdigest.co.jp/beginner/practice/load_address.asp) |
| L04・L05・L08 スイングと手順 | [スイングのポジション名称](https://www.golfdigest.co.jp/beginner/practice/load_swing.asp) |
| L06 パット | [ゴルフクラブの振り方・パター](https://www.golfdigest.co.jp/beginner/practice/load_putter.asp) |
| L07 アプローチ | [ゴルフクラブの振り方・アプローチ](https://www.golfdigest.co.jp/beginner/practice/load_approach.asp) |

公開教材は一般的な基本例の参考で、各ドリルの回数・時間・成功の定義は本アプリの練習記録用に定めたものです。スコア改善や身体のフォーム矯正の保証を意味しません。

## 図解の管理

`src/content.ts` の `figures` が27図のID、視点、説明、代替テキストを管理します。`src/Illustration.tsx` の各描画が対応します。左右を反転するのは図の部分だけで、見出しと説明文は反転しません。

- L01：手と指、両手、握りの比較（3図）。
- L02：正面、側面、バランスの比較（3図）。
- L03：2本の平行線、アイアン、ドライバーの位置（3図）。
- L04：準備、小さい弧、打った後の姿勢（3図）。
- L05：アドレスからフィニッシュまでの6場面（6図）。
- L06：側面の構え、ゲート、複数距離（3図）。
- L07：小さい動き、落下点と転がり、比較（3図）。
- L08：ヘッドとティー、フィニッシュ、準備手順（3図）。

作者による画面・文章の整合確認を実施。ゴルフ指導者による監修は未実施です。公開後に指導者の確認を得た場合、確認者・日付・修正内容をここに追記してください。
