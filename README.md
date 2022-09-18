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

# GuerliもしくはMumbaiへのデプロイ
.envファイルを作成して適切な値を入れたのち、以下のコマンドでデプロイを実行

```
export PRIVATE_KEY=<ウォレットの秘密鍵を入れる>

# Goerliへのデプロイ
npx hardhat run scripts/deploy.ts --network goerli 

# Mumbaiへのデプロイ
npx hardhat run scripts/deploy.ts --network maticmum

# Polygon Mainnetへのデプロイ
npx hardhat run scripts/deploy.ts --network polygon
```
# EtherscanでVerifyする
Etherscan上でソースコードを確認できるようになる

例(ネットワーク名、コントラクトアドレス、初期値は適切に変更すること)
```
npx hardhat verify --contract contracts/DAOToken.sol:DAOToken --network polygon 0x5427aC1c36c560D602D41dD0F2609DB296dd3CF9 Englister ENG 0

npx hardhat verify --contract contracts/DAOTreasury.sol:DAOTreasury --network polygon 0x80CF3dEdf0F03441bd47037Dfa8640eF9f35626a 

npx hardhat verify --contract contracts/ContributionPoll.sol:ContributionPoll --network polygon 0x7674214b5daedb9069D55e6F6C47F2c936E47d1B 

npx hardhat verify --contract contracts/TokenSupplySystem.sol:TokenSupplySystem --network polygon 0x77F78729699342EdB653553525570aE2c4F6B98B 

npx hardhat verify --contract contracts/DAONFT.sol:DAONFT --network polygon 0x77F78729699342EdB653553525570aE2c4F6B98B EnglisterDAOMembership EDM

npx hardhat verify --contract contracts/DAONFTCrowdSale.sol:DAONFTCrowdSale --network polygon 0x77F78729699342EdB653553525570aE2c4F6B98B 
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