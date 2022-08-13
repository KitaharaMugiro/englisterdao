# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# 環境構築
以下を参考にhardhatを導入した。  
https://hardhat.org/hardhat-runner/docs/getting-started

このリポジトリはすでに導入済みなので、下記でパッケージをインストールする。
```
npm ci
```

テストを実行する。
```
npx hardhat test
```

# verify
npx hardhat verify --contract contracts/DAOToken.sol:DAOToken --network goerli {0xCONTRACT_ADDRESS} Englister ENG 100

# compile
EVMで動かすためのbyte codeおよびABIをartifactsディレクトリに生成する。

```
npx hardhat compile
```

# コントラクトのローカルデプロイ
scripts/deploy.tsが実装されていることを確認する。

```
npx hardhat node
```

以下のようなアウトプットが出てくるため、フロントエンドはここと疎通させる。

```
> Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

以下コマンドでデプロイを行う。
```
npx hardhat run scripts/deploy.ts --network localhost
```