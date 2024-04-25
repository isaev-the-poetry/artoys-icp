import React, { useState, useEffect } from "react";
import ic from "ic0";
import { useConnect } from "@connect2ic/react";
import { Principal } from "@dfinity/principal";

// Sample data for NFTs
const nfts = [
  {
    id: 1,
    name: "CryptoPunk",
    symbol: "CP",
    totalSupply: "10000",
    imageUrl: "https://example.com/image1.png",
  },
  {
    id: 2,
    name: "Bored Ape",
    symbol: "BA",
    totalSupply: "10000",
    imageUrl: "https://example.com/image2.png",
  },
  // Add more NFTs as needed
];

function ViewNFT() {
  const ledger = ic("rfrca-lyaaa-aaaap-ag7ka-cai");
  const [supply, setSupply] = useState([]);
  const [logo, setLogo] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [name, setName] = useState([]);
  const [symbol, setSymbol] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Actions on sign in
    },
    onDisconnect: () => {
      // Actions on sign out
    },
  });

  useEffect(() => {
    // console.log("this is the table")
    setIsLoading(true);
    const fetchData = async () => {
      console.log("Ledger =>", ledger, principal);
      let store = await ledger.call(
        "getOwnedNFTs",
        Principal.fromText(principal)
      );
      console.log("store =>", store);

      // Create an array to store token data
      const nameArray = [];
      const symbolArray = [];
      const logoArray = [];

      const principalArray = [];
      const totalSupply = [];

      // Iterate over the array of principals
      for (let i = 0; i < store.length; i++) {
        // Get the principal ID as a string
        const principalId = store[i].toText();
        if (principalId != "aaaaa-aa") {
          principalArray.push(principalId);
          // Create a ledger instance for the current principal ID
          const ledger3 = ic(principalId);
          console.log(ledger3);
          // Fetch metadata for the current principal ID and push it to tokensData
          const name = await ledger3.call("nameDip721");
          nameArray.push(name);
          const symbol = await ledger3.call("symbolDip721");
          symbolArray.push(symbol);
          const supply = await ledger3.call("totalSupplyDip721");
          totalSupply.push(supply);
          const logo = await ledger3.call("logoDip721");
          logoArray.push(logo);
          console.log("=>", i);
        }
      }

      console.log(
        "Arrays",
        nameArray,
        symbolArray,
        logoArray,
        principalArray,
        totalSupply
      );
      setLogo(logoArray);
      setName(nameArray);
      setSymbol(symbolArray);
      setPrincipals(principalArray);
      setSupply(totalSupply);
      setIsLoading(false);
    };
    // console.log("I like this is the table")
    fetchData();
  }, [principal]);

  return (
    <div>
      <h1>Your NFTs</h1>
      {isLoading ? (
        <div
          className="loader"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        ></div>
      ) : (
        <div className="nft-container">
          {name.map((nftName, index) => (
            <div key={index} className="nft-card">
              <img src={logo[index].data} alt={nftName} className="nft-image" />
              <div className="nft-info">
                <h2>{nftName}</h2>
                <p>Symbol: {symbol[index]}</p>
                <p>Total Supply: {Number(supply[index])}</p>
                <p>Principal: {principals[index]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewNFT;
