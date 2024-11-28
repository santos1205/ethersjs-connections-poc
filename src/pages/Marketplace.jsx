import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

// Import pages or components for each route
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const NFT_ADDRESS = import.meta.env.VITE_NFT_ADDRESS;
const TOKEN_URI =
  "https://green-obedient-minnow-170.mypinata.cloud/ipfs/QmecaAa9MGY4QnVEtsEVvmLmszZcZGrFvSTiGg8eLxCzF3/eletric_suv.json";

const CONTRACT_ABI = [
  "constructor(string _nftName, string _nftSymbol, string _contractURI)",
  "function mintNFT(string memory _tokenURI, uint256 _valor) external",
  "function buyNFT(address nftAddress, uint256 tokenId) external payable",
  "function withdrawFunds() external",
  "function getAllContractNFTs() external view returns (address[] memory, uint256[] memory, uint256[] memory, string[] memory)",
  "function getNFTDetails(address nftAddress, uint256 tokenId) external view returns (uint256 valor, bool isListed)",
  "function updateTokenURI(uint256 tokenId, string memory newURI) external",
  "function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4)",
  "event TokenAdded(address indexed nftAddress, uint256 indexed tokenId, uint256 price)",
  "event Bought(address indexed nftAddress, uint256 indexed tokenId, address buyer, uint256 price)",
];


export default function Marketplace() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [nftList, setNftList] = useState([]);
  const [marketPlaceVisible, setMarketPlaceVisible] = useState(true);

  // name of chains
  const ChainIdToName = {
    80002: "Amoy",
  };

  const ownerAddress = import.meta.env.VITE_OWNER_ADDRESS; // Access the variable

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

  async function fetchMetadata(tokenURI) {
    try {
      const response = await axios.get(tokenURI);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metadata from ${tokenURI}:`, error);
      throw error;
    }
  }

  // Helper function to parse price from metadata
  function parsePrice(metadata) {
    const attributes = metadata.attributes || [];
    const priceAttribute = attributes.find(
      (attr) => attr.trait_type === "Price"
    );
    return priceAttribute ? priceAttribute.value : "Unknown";
  }

  async function getMarketNFTs() {
    const provider = await getProvider();

    try {
      if (provider) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        const [nftAddresses, tokenIds, valores, tokenURIs] =
          await contract.getAllContractNFTs();

        // Use Promise.all to wait for all promises to resolve
        const nftListResponse = await Promise.all(
          nftAddresses.map(async (address, index) => {
            const nftDetails = await contract.getNFTDetails(
              NFT_ADDRESS,
              tokenIds[index]
            );
            const isListed = nftDetails[1];
            // pegando os dados do tokenURI
            // Fetch the metadata JSON from tokenURI
            const metadata = await fetchMetadata(tokenURIs[index]);
            const price = parsePrice(metadata);

            return {
              address: address,
              name: metadata?.name,
              description: metadata?.description,
              image: metadata?.image,
              tokenId: tokenIds[index].toString(),
              tokenURI: tokenURIs[index].toString(),
              valor: price,
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

    try {
      if (provider) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider.getSigner()
        );

        setMessage("processing purchase, please wait");
        const tx = await contract.buyNFT(nft.address, nft.tokenId, {
          value: nft.valor,
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

  function handleGoToMarketplace() {
    setMarketPlaceVisible(true);
  }

  function handleGoToMyPurchases() {
    setMarketPlaceVisible(false);
  }

  return (
    <div>
      <main className="main-content">
        <section className="status">
          <p></p>
        </section>

        {/* Marketplace section */}
        {marketPlaceVisible && (
          <section>
            <section className="actions">
              {/* Só irá exibir o botão para mintar para uma conta em específico */}
              {account?.toLowerCase() == ownerAddress?.toLowerCase() && (
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
                      alt={`NFT #${nft.tokenId}`}
                      className="nft-image"
                    />
                    <div className="nft-details">
                      <h3 className="nft-title">{nft.name}</h3>
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
          </section>
        )}

        {/* My purchases section */}
        {!marketPlaceVisible && (
          <section>
            <div className="nft-label">
              <h2>My Purchases</h2>
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
          </section>
        )}
      </main>
    </div>
  );
}
