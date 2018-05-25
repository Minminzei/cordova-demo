# Cordova Sample

#### demo
https://s3-ap-northeast-1.amazonaws.com/test.cordova.demo/index.html#/

#### このレポジトリについて
- 概要
  - ES2015/Vue.jsで作成したWEBを、Cordovaを使ってハイブリットアプリ化するための調査用レポジトリです
- ゴール
  - SPA/WEBをiOS/Androidで配布できるようにする
- 構成
  - build/native bridge: cordova
  - サーバー構成: AWS serverless
  - フロント: Vue.js/ Vuex
  - UIコンポーネント: Vuetify

#### 事前準備
- cordovaのセットアップ
  https://cordova.apache.org/
- aws configure
  https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-getting-started.html

#### AWSセットアップ
1. AWS > dynamodbに`items`テーブルを作成
2. AWS > s3にbucketを作成
3. `api/.env.yml`を`api/env.yml`にコピーして1,2で取得した情報を記載
3. `api`フォルダで`npm run deploy`を実行し、AWSに環境をデプロイする。各人のAWS環境でやってください。
4. デプロイ完了後、AWS > API Gatewayに`stage-cordova-demo`が作成されているので、ダッシュボードからAPI URLを取得
5. 取得したURLを`api/env.yml`の`apigateway.endpoint`に記載。

#### build
1. `www`に静的ファイルをビルド
```
npm run build
```

2. platformの追加(iosの場合)
```
### 初回時:build結果はplatforms/iosに格納される
cordova platform add ios

### 2回目以降
cordova build ios
```

#### Document
- https://cordova.apache.org/docs/en/latest/
- https://serverless.com/
