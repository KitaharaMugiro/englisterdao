

# ローカルのコントラクトの接続について

# フロントエンドのローカル立ち上げ

```
npm ci
npm run dev
```

# コントラクトとの接続
etherjs を利用してコントラクトと接続するためには、以下が必要です

* コントラクトがデプロイされたアドレス
    * 実際にローカルネットワークにコントラクトをデプロイして確認します
* コントラクトのABI
    * コントラクトをコンパイルして生成したアーティファクトを持ってきて利用します
* "コントラクトがデプロイされたアドレス"を取得

## ABIのコピー
```
cd ./frontend
cp -rp ../artifacts/contracts/ContributionPoll.sol/ContributionPoll.json src/ContributionPollAbi.json
cp -rp ../artifacts/contracts/DAOToken.sol/DAOToken.json src/DAOTokenAbi.json
cp -rp ../artifacts/contracts/DAOTreasury.sol/DAOTreasury.json src/DAOTreasuryAbi.json
```

# 参考
https://zenn.dev/linnefromice/articles/create-simple-dapps-with-hardhat-and-react-ts