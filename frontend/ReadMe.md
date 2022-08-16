

# ローカルのコントラクトの接続について

# コントラクトとの接続
etherjs を利用してコントラクトと接続するためには、以下が必要です

* コントラクトがデプロイされたネットワークアドレス(接続先URL)
* コントラクトのABI
* コントラクトがデプロイされたアドレス

## 環境変数の設定
env.localにコントラクトがデプロイされたアドレスを設定します。  

|項目|内容|
|---|---|
|NEXT_PUBLIC_NETWORK_ADDRESS|接続先URL|
|NEXT_PUBLIC_DAOTOKEN_CONTRACT_ADDRESS|DAOTokenのコントラクトアドレス|
|NEXT_PUBLIC_DAOTRESURY_CONTRACT_ADDRESS|DAOTresuryのコントラクトアドレス|
|NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS|ContributionPollのコントラクトアドレス|
## ABIのコピー
```
cd ./frontend
cp -rp ../artifacts/contracts/ContributionPoll.sol/ContributionPoll.json src/abi/
cp -rp ../artifacts/contracts/DAOToken.sol/DAOToken.json src/abi/
cp -rp ../artifacts/contracts/DAOTreasury.sol/DAOTreasury.json src/abi/
```

# フロントエンドのローカル立ち上げ

```
npm ci
npm run dev
```

## Metamask
コントラクトとの接続にはMetamaskを利用します。

* Metamaskをインストールしてください。
* Hardhatのアカウントをimportしてください(ownerと普通のaccountがあればOK)
* 接続先をLocalhostにしてください



# 型の自動生成

```
cd ./frontend
npx typechain --target=ethers-v5 src/abi/*.json
```

# 注意
## コントラクトの更新
コントラクト側を修正した場合は以下を再度実施する必要がある。
* コントラクトのデプロイ
* コントラクトアドレスの修正(env.local)
* 型の自動生成

## Metamaskの設定
チェインIDが適切にhardhatネットワーク(31137)と一致している必要がある。
Metamaskで設定を行う(設定方法は詳しい人に聞いてください)

## Metamaskのキャッシュクリア
不可解なエラーが出る場合は、Metamaskのキャッシュをクリアしてください。
高度な設定 > リセットから実施できます。
# 参考
https://zenn.dev/linnefromice/articles/create-simple-dapps-with-hardhat-and-react-ts