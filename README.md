# はじめてゴルフ

初心者のための、日本語ゴルフ学習・練習アプリ。iPhoneのSafariで使い、「ホーム画面に追加」すると独立したアプリ画面で開けます。

- **学ぶ**：8レッスン、27点のオリジナルSVG図解、左右打ち切替、拡大、6段階スイング、読了と自己確認。
- **練習**：12ドリル、場所×時間の9メニュー、道具に応じた代替、途中再開、休憩タイマー、10回まとめ入力。
- **記録**：IndexedDB保存、成功数の未計測対応、任意の自己評価とメモ、編集・削除、JSON書出し・取込み。
- **PWA**：教材一式をオフライン保存。外部フォント・画像CDN・ログイン・APIキーは不要です。

## 開発・確認

Node.js 22以上を使用します。

```sh
npm ci
npm run dev
```

ブラウザで `http://localhost:5173/golf/` を開きます。

```sh
npm run build
npm test
npx playwright install --with-deps chromium
npm run test:e2e
```

`npm run preview` はビルド済みサイトを配信します。PWAの動作確認は開発サーバーではなく、ビルド後のプレビューまたはHTTPS公開先で行ってください。教材の保存完了を確認してから通信を切ります。

## GitHub Pagesへの公開

1. この実装ブランチを `main` に取り込みます。
2. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
3. **Actions → Deploy golf to GitHub Pages** を実行します。以後は `main` 更新時に自動でビルド・公開します。
4. デプロイ成功後、`https://eternitybios-dot.github.io/golf/` をiPhoneのSafariで開きます。

上記URLは公開設定とデプロイが成功した場合のURLです。公開状況はActionsで確認してください。配信パスは `/golf/`、画面はハッシュ方式なので詳細画面の再読み込みにも対応します。

別のホスティング先でルートに配信する場合は、`BASE_PATH=/ npm run build` を使います。配信パスを変更すると、ブラウザの保存領域も異なる場合があります。

## iPhoneでの使い方

Safariの共有ボタン → **ホーム画面に追加** → **追加**。ホーム画面のアイコンから開き、オンラインで教材の保存完了を待ちます。設定画面にも操作図解があります。

Safariとホーム画面で記録が引き継がれない場合は、設定からJSONを書き出し、追加済みアプリで取り込んでください。ブラウザのデータ削除や端末変更の前にも書出しをおすすめします。

## 保存と更新

保存は `hajimete-golf` IndexedDBの1つのスナップショットをトランザクションで更新します。保存成功後に画面を進め、失敗時は入力を保持して再試行します。実行中の練習と結果入力の有効な値も保存します。練習中の強制更新は行いません。

バックアップの `schemaVersion` は1。初回版のため、版0以前の既存データはありません。同じIDは既存データを優先して追加し、全置換には確認が必要です。不正な値・未対応の版は書込み前に拒否します。将来、版を変更する際は `src/storage.ts` に旧版からの変換を追加してください。現在の版1で追加した実行中メモ・自己評価は、欠けているデータを既定値で補うため、記録を消す移行は不要です。

## 構成

| ファイル | 内容 |
| --- | --- |
| `src/content.ts` | 教材・図の説明・ドリル・メニュー・代替条件 |
| `src/Illustration.tsx` | 編集できるオリジナルSVG図解とホームのイラスト |
| `src/Learning.tsx` | ホーム、教材一覧・詳細、追加案内 |
| `src/Practice.tsx` | 練習の選択・実行・結果・記録 |
| `src/Settings.tsx` | 条件設定、JSON、端末内データの削除 |
| `src/storage.ts` | 保存、データ検証、バックアップ、経過時間 |
| `vite.config.ts` | 配信パス、Manifest、教材のキャッシュ |

要件は [REQUIREMENTS.md](REQUIREMENTS.md)、確認結果と残る確認は [VALIDATION.md](VALIDATION.md)、教材の参考情報は [CONTENT_SOURCES.md](CONTENT_SOURCES.md) を参照してください。

## 確認の範囲

ブラウザ自動確認と画面確認を実施しています。iPhone実機でのSafari・ホーム画面追加・VoiceOver、初心者による操作確認、指導者による教材監修は未実施です。要件書の受入基準では、その部分を未確認として扱います。
