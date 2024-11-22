import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const TOKEN_ADDRESS = "0xCc2cd7488d8EA2bB37AA53Fb633cf91d9DFcC582";
const CONTRACT_ADDRESS = "0x84d3fc84Fca8d3Ad60E6b78d5dC4564204f5368A";
const TOKEN_URI =
  "https://green-obedient-minnow-170.mypinata.cloud/ipfs/QmSf6QQ9bf5BTC1eYZBM2Hkef7sa66Z2zhcDwBsi9o6T5i";

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_nftName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nftSymbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "Bought",
    type: "event",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "TokenAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "buyNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllContractNFTs",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getNFTDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "valor",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isListed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "listedNFTs",
    outputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_valor",
        type: "uint256",
      },
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nftContract",
    outputs: [
      {
        internalType: "contract NFTFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nftMappingList",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isListed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
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
    name: "renounceOwnership",
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
  {
    inputs: [],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [nftList, setNftList] = useState([]);

  // name of chains
  const ChainIdToName = {
    80002: "Amoy",
  };

  function getChainName(chainId) {
    return ChainIdToName[chainId] || "Unknown Chain";
  }

  // Listener de mudanças na metamask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  function handleAccountsChanged(accounts) {
    console.log("account changed", accounts[0]);
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      disconnectWallet();
    }
  }

  function handleChainChanged(chainId) {
    console.log("chainId", chainId);
    setChainId(chainId);
  }

  async function getProvider() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      return provider;
    } else {
      console.error(
        "Ethereum provider not found. Please install MetaMask or another wallet."
      );
      return null;
    }
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("Metamask is not installed. Please install it to use this app.");
        return;
      }

      // Caso a wallet esteja instalada, efetua-se a conexão
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected accounts:", accounts);
      const chainIdx16 = await window.ethereum.request({
        method: "eth_chainId",
      });
      const chainId = parseInt(chainIdx16, 16);
      console.log("Chain Id:", chainId);
      const provider = await getProvider();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider.getSigner()
      );

      setAccount(accounts[0]);
      setContract(contractInstance);
      setChainId(chainId);
      setIsConnected(true);
      // Carregando o saldo da rede
      const chainBalance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.utils.formatEther(chainBalance);
      const balanceInEthFormatted = parseFloat(balanceInEth).toFixed(4);
      console.log("chain balance:", balanceInEthFormatted);
      setBalance(balanceInEthFormatted);
      setStatusMsg("Wallet connected successfully.");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setStatusMsg(`Failed to connect ${error}`);
      // necessário reconectar, pois muitas vezes a metamask não conecta corretamente.
      connectWallet();
    }
  }

  function disconnectWallet() {
    setAccount("");
    setContract(null);
    setChainId(null);
    setIsConnected(false);
    setBalance("");
    setStatusMsg("Wallet disconnected");
    console.log("Wallet disconnected");
  }

  async function handleMintNFT() {
    if (!contract) {
      setStatusMsg("Conecte uma wallet.");
      return;
    }

    try {
      const tx = await contract.mintNFT(TOKEN_URI, 25);
      console.log("Mint NFT transaction:", tx);
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
      // setStatusMsg(
      //   `NFT minting transaction sent! Hash: <a href="https://amoy.polygonscan.com/tx/${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`
      // );
      alert(`SUCCESSO! NFT enviado tx: ${tx.hash}`);
      console.log("tx: ", tx.hash, new Date());
    } catch (error) {
      console.error("Erro ao mintar NFT:", error);
      alert(`erro ao mintar NFT: ${error.message}`);
      //setStatusMsg(`Error minting NFT: ${error.message || "Unknown error"}`);
    }
  }

  async function getMarketNFTs() {
    const provider = await getProvider();

    try {
      if (provider) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);  
        const NFTS_ADDRESSES = ["0x81e3f429E3F85B5F7bd91CE50B839911cAe49013"];  
  
        // MY-TODO: LOOP
        // const nftDetails = await contract.getNFTDetails(NFTS_ADDRESSES[0], 1);
        // console.log('nft valor:', nftDetails[0].toNumber());
        // console.log('nft isListed:', nftDetails[1]);
        const [nftAddresses, tokenIds, valores] = await contract.getAllContractNFTs();
        
        const nftListResponse = nftAddresses.map((address, index) => ({
          nftAddresses: address,
          tokenId: tokenIds[index].toString(),
          valor: ethers.utils.formatEther(valores[index])
        }));

        console.log("Listados NFTs a venda:", nftListResponse);
        setNftList(nftListResponse);
      }
    } catch(error) {
      console.error('error during load nfts: ', error.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Decentralized NFT Marketplace {isConnected}</h1>
        <div className="wallet-info">
          {isConnected == true ? (
            <>
              <span className="account">{`Account: ${account}`}</span>
              <span className="balance">{`Balance: ${balance} POL`}</span>
              <button className="btn disconnect" onClick={disconnectWallet}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn connect" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="status">
          <p>{statusMsg}</p>
        </section>

        <section className="actions">
          <button className="btn mint" onClick={handleMintNFT}>
            Mint NFT
          </button>
          {/* Add additional actions here */}
        </section>

        <section className="nft-list">
          <h2>Your NFTs</h2>
          <div className="nft-grid">
            {nftList.map((nft, index) => (
              <div key={index} className="nft-card">
                <img
                  src={nft.image || "https://via.placeholder.com/150"}
                  alt={`NFT ${index}`}
                />
                <p className="token-id">{`Token ID: ${nft.tokenId}`}</p>
                <p className="price">{`Price: ${nft.price} ETH`}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

}

export default App;
