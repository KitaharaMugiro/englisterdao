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
# EtherscanでVerifyする(goerli)
これにより、Etherscan上でソースコードを確認できるようになる

```
npx hardhat verify --contract contracts/DAOToken.sol:DAOToken --network goerli 0x4966f4b22AA708905ddc7c040777647698f72FfE Englister ENG 100000000000000000000

npx hardhat verify --contract contracts/DAOTreasury.sol:DAOTreasury --network goerli 0x280BCD89619D3Cd34EAaB7Cda5b7869D9eE4402c 

npx hardhat verify --contract contracts/ContributionPoll.sol:ContributionPoll --network goerli 0x09b2a61a3492846116eb2f6D1Ba2d02EA6292c62 
```


# Polygonへのデプロイ
https://docs.polygon.technology/docs/develop/hardhat/
を参考にテストネットにデプロイを行なった

## mumbai testnetをmetamaskに追加
https://rpc-mumbai.maticvigil.com/
をメタマスクに追加する。

## mumbai testnetのMATICを取得
https://mumbaifaucet.com/

## デプロイ

```
npx hardhat run scripts/deploy.ts --network matic
```