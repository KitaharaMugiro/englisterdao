# 環境構築
以下を参考にhardhatを導入した。  
https://hardhat.org/hardhat-runner/docs/getting-started

このリポジトリはすでに導入済みなので、下記でパッケージをインストールする。
```
npm ci
```

# コントラクトのローカルネットワークへのデプロイ手順
scripts/deploy.tsが適切に実装されていることを確認する。

## ノードの立ち上げ
`npx hardhat node`でノードが立ち上がり、以下のようなアウトプットが出てくる。
フロントエンドはここに表示されたURL(以下の場合は http://127.0.0.1:8545/ )と疎通させる。

```
$ npx hardhat node
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: ...
Private Key: ...

...

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```

## デプロイ
以下コマンドでデプロイを行う。
```
npx hardhat run scripts/deploy.ts --network localhost
```

## デモデータの作成
### 立候補データ
複数のアカウントが現在開催されているpollに立候補します。

```
npx hardhat run scripts/demo/candidate.ts --network localhost
```

# verify
npx hardhat verify --contract contracts/DAOToken.sol:DAOToken --network goerli {0xCONTRACT_ADDRESS} Englister ENG 100

