# 環境構築
以下を参考にhardhatを導入した。  
https://hardhat.org/hardhat-runner/docs/getting-started

このリポジトリはすでに導入済みなので、下記でパッケージをインストールする。
```
npm ci
```

# コントラクトのローカルネットワークへのデプロイ手順
ノードを立ち上げ、scripts/deploy.tsを実行してコントラクトをデプロイする。

## ノードの立ち上げ

```
$ npx hardhat node
```

## デプロイ

```
npx hardhat run scripts/deploy.ts --network localhost
```

## デモデータの作成
### 立候補データ
複数のアカウントが現在開催されているpollに立候補します。

```
npx hardhat run scripts/demo/candidate.ts --network localhost
```

# Guerli devへのデプロイ
.envファイルを作成して適切な値を入れたのち、以下のコマンドでデプロイを実行

```
npx hardhat run scripts/deploy.ts --network goerli 
```
# verify
npx hardhat verify --contract contracts/DAOToken.sol:DAOToken --network goerli {0xCONTRACT_ADDRESS} Englister ENG 100

