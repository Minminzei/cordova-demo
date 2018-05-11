# Cordova Sample

#### このレポジトリについて
- 概要
  - ES2015/Vue.jsで作成したWEBを、Cordovaを使ってハイブリットアプリ化するための調査用レポジトリです
- ゴール
  - SPA/WEBをiOS/Androidで配布できるようにする
- 構成
  - build/native bridge: cordova
  - サーバー構成: AWS serverless
  - フロント: Vue.js/ Vuex
- DEMO
  - https://s3-ap-northeast-1.amazonaws.com/test.cordova.demo/index.html/

#### 事前準備
- cordovaのセットアップ
  https://cordova.apache.org/
- aws configure
  https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-getting-started.html

#### AWSセットアップ
1. AWS > dynamodbに`items`テーブルを作成
2. `api/.serverless.yml`を`api/serverless.yml`にコピーして1で取得したdynamodbのARNを`cutsom:`の該当の箇所に追記
3. `api`フォルダで`npm run deploy`を実行し、AWSに環境をデプロイする。各人のAWS環境でやってください。
4. デプロイ完了後、AWS > API Gatewayに`stage-cordova-demo`が作成されているので、ダッシュボードからAPI URLを取得
5. 取得したURLを`src/libs/api.js`の`CONFIG.apiPath`に記載。

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

#### 残タスク
- [ ] hot reload(WEB)
- [ ] hot reload(iOS/Android)
- [ ] hot code push
- [ ] push notification(AWS SNS)
- [ ] API認証(AWS Cognito)
