/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  DAONFTCrowdSale,
  DAONFTCrowdSaleInterface,
} from "../DAONFTCrowdSale";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "addWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "removeWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setDAONftAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setDAOTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002d61002261003260201b60201c565b61003a60201b60201c565b6100fe565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b610c4a8061010d6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806391b7f5ed1161007157806391b7f5ed1461013e578063a035b1fe1461015a578063a2fa6fc514610178578063a6f2ae3a14610194578063f2fde38b1461019e578063f80f5dd5146101ba576100a9565b80633af32abf146100ae578063715018a6146100de57806378c8cda7146100e85780638da5cb5b146101045780638e39a05014610122575b600080fd5b6100c860048036038101906100c391906108a8565b6101d6565b6040516100d591906108f0565b60405180910390f35b6100e661022c565b005b61010260048036038101906100fd91906108a8565b610240565b005b61010c6102a3565b604051610119919061091a565b60405180910390f35b61013c600480360381019061013791906108a8565b6102cc565b005b6101586004803603810190610153919061096b565b610318565b005b61016261032a565b60405161016f91906109a7565b60405180910390f35b610192600480360381019061018d91906108a8565b610330565b005b61019c61037c565b005b6101b860048036038101906101b391906108a8565b610615565b005b6101d460048036038101906101cf91906108a8565b610699565b005b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6102346106fb565b61023e6000610779565b565b6102486106fb565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6102d46106fb565b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6103206106fb565b8060048190555050565b60045481565b6103386106fb565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610385336101d6565b6103c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103bb90610a1f565b60405180910390fd5b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506004548273ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161044e919061091a565b60206040518083038186803b15801561046657600080fd5b505afa15801561047a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061049e9190610a54565b10156104df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d690610acd565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff16639dc29fac336004546040518363ffffffff1660e01b815260040161051c929190610aed565b600060405180830381600087803b15801561053657600080fd5b505af115801561054a573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff166340d097c3336040518263ffffffff1660e01b8152600401610587919061091a565b600060405180830381600087803b1580156105a157600080fd5b505af11580156105b5573d6000803e3d6000fd5b505050506000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b61061d6106fb565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561068d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068490610b88565b60405180910390fd5b61069681610779565b50565b6106a16106fb565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b61070361083d565b73ffffffffffffffffffffffffffffffffffffffff166107216102a3565b73ffffffffffffffffffffffffffffffffffffffff1614610777576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076e90610bf4565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108758261084a565b9050919050565b6108858161086a565b811461089057600080fd5b50565b6000813590506108a28161087c565b92915050565b6000602082840312156108be576108bd610845565b5b60006108cc84828501610893565b91505092915050565b60008115159050919050565b6108ea816108d5565b82525050565b600060208201905061090560008301846108e1565b92915050565b6109148161086a565b82525050565b600060208201905061092f600083018461090b565b92915050565b6000819050919050565b61094881610935565b811461095357600080fd5b50565b6000813590506109658161093f565b92915050565b60006020828403121561098157610980610845565b5b600061098f84828501610956565b91505092915050565b6109a181610935565b82525050565b60006020820190506109bc6000830184610998565b92915050565b600082825260208201905092915050565b7f596f7520617265206e6f7420696e207468652077686974656c69737400000000600082015250565b6000610a09601c836109c2565b9150610a14826109d3565b602082019050919050565b60006020820190508181036000830152610a38816109fc565b9050919050565b600081519050610a4e8161093f565b92915050565b600060208284031215610a6a57610a69610845565b5b6000610a7884828501610a3f565b91505092915050565b7f596f7520646f6e2774206861766520656e6f7567682064616f20746f6b656e73600082015250565b6000610ab76020836109c2565b9150610ac282610a81565b602082019050919050565b60006020820190508181036000830152610ae681610aaa565b9050919050565b6000604082019050610b02600083018561090b565b610b0f6020830184610998565b9392505050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000610b726026836109c2565b9150610b7d82610b16565b604082019050919050565b60006020820190508181036000830152610ba181610b65565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000610bde6020836109c2565b9150610be982610ba8565b602082019050919050565b60006020820190508181036000830152610c0d81610bd1565b905091905056fea264697066735822122022f70e617bdf9e8bc33f177befc7c1d5506631fd5e83221ab6fa6cfe71cddfff64736f6c63430008090033";

type DAONFTCrowdSaleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DAONFTCrowdSaleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DAONFTCrowdSale__factory extends ContractFactory {
  constructor(...args: DAONFTCrowdSaleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DAONFTCrowdSale> {
    return super.deploy(overrides || {}) as Promise<DAONFTCrowdSale>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DAONFTCrowdSale {
    return super.attach(address) as DAONFTCrowdSale;
  }
  override connect(signer: Signer): DAONFTCrowdSale__factory {
    return super.connect(signer) as DAONFTCrowdSale__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DAONFTCrowdSaleInterface {
    return new utils.Interface(_abi) as DAONFTCrowdSaleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DAONFTCrowdSale {
    return new Contract(address, _abi, signerOrProvider) as DAONFTCrowdSale;
  }
}
