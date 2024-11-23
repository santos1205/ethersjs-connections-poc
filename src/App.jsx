import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0xE9436E39D744eBc67261B34210140ac86381C430";
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
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
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
  const [message, setMessage] = useState("");
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

      getMarketNFTs();
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

  // UseEffect to clear the message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Clear the message
      }, 5000);

      // Cleanup the timer on component unmount or message change
      return () => clearTimeout(timer);
    }
  }, [message]);


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
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setMessage(`Failed to connect ${error}`);
      // necessário reconectar em caso de erro para forçar a conexão completa, pois muitas vezes a metamask não conecta corretamente.
      connectWallet();
    }
  }

  function disconnectWallet() {
    setAccount("");
    setContract(null);
    setChainId(null);
    setIsConnected(false);
    setBalance("");
    setMessage("Wallet disconnected");
    console.log("Wallet disconnected");
  }

  async function handleMintNFT() {
    if (!contract) {
      setMessage("Conecte uma wallet.");
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

  // MY-TODO: GET NFT DETAILS
  // const NFTS_ADDRESSES = ["0x81e3f429E3F85B5F7bd91CE50B839911cAe49013"];
  // const nftDetails = await contract.getNFTDetails(NFTS_ADDRESSES[0], 1);
  // console.log('nft valor:', nftDetails[0].toNumber());
  // console.log('nft isListed:', nftDetails[1]);

  async function getMarketNFTs() {
    const provider = await getProvider();

    try {
      if (provider) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        const [nftAddresses, tokenIds, valores] =
          await contract.getAllContractNFTs();

        const NFTS_ADDRESSES = ["0x40980B5f4F7609fCD5A00426B6f7716CF5395A84"];

        // Use Promise.all to wait for all promises to resolve
        const nftListResponse = await Promise.all(
          nftAddresses.map(async (address, index) => {
            const nftDetails = await contract.getNFTDetails(
              NFTS_ADDRESSES[0],
              tokenIds[index]
            );
            const isListed = nftDetails[1];

            return {
              address: address,
              tokenId: tokenIds[index].toString(),
              valor: valores[index].toNumber(),
              isListed,
            };
          })
        );

        // Filter only objects with isListed = true
        const listedNFTs = nftListResponse.filter((nft) => nft.isListed);

        console.log(listedNFTs);

        console.log("Listados NFTs a venda:", listedNFTs);
        setNftList(listedNFTs);
      }
    } catch (error) {
      console.error("error during load nfts: ", error.message);
    }
  }

  async function handleBuyNFT(nft) {
    console.log("nft address", nft.address);
    console.log("nft tokenId", nft.tokenId);
    console.log("nft valor", nft.valor);

    const provider = await getProvider();
    
    if (isConnected == false) {
      setMessage("Please connect your wallet to buy.");
      return;
    }
    debugger

    try {
      if (provider) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider.getSigner()
        );


        setMessage("processing purchase, please wait");
        const tx = await contract.buyNFT(nft.address, nft.tokenId, {
          value: nft.valor
        });
        
        console.log("transaction sent:", tx);
        await tx.wait();
        setMessage("NFT purchased successfully");
      }
    } catch (error) {
      setMessage("error during nft purchase");
      console.error("error during buy a nfts: ", error.message);
    }
  }

  return (
    <div className="app">
      {message && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
      {/* Display the message */}
      <header className="header">
        <h1>TKN Marketplace</h1>
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
          <p></p>
        </section>

        <section className="actions">
          {/* Só irá exibir o botão para mintar para uma conta em específico */}
          {account == "0x3ec80f490112ef4661c9b1e6e360ae19306201bb" && (
            <button className="btn mint" onClick={handleMintNFT}>
              Mint NFT
            </button>
          )}
          {/* Add additional actions here */}
        </section>

        <div className="nft-label">
          <h2>NFTs a Venda</h2>
        </div>

        <section className="nft-list">
          <div className="nft-list">
            {nftList.map((nft, index) => (
              <div key={index} className="nft-card">
                <img
                  src={nft.image}
                  alt={`NFT ${index}`}
                  className="nft-image"
                />
                <div className="nft-details">
                  <h3 className="nft-title">{nft.tokenId}</h3>
                  <p className="nft-price">Price: {nft.valor} POL</p>
                  <button
                    className="buy-button"
                    onClick={() => handleBuyNFT(nft)}
                  >
                    comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
