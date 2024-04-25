// import React, { useState } from "react";
// import ic from "ic0";
// import { Principal } from "@dfinity/principal";

// const ledger = ic.local("bkyz2-fmaaa-aaaaa-qaaaq-cai");

// function CreateAndMintNFTForm() {
//   const [logoImage, setLogoImage] = useState("");
//   const [name, setName] = useState("");
//   const [symbol, setSymbol] = useState("");
//   const [maxL, setMaxL] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//     try {
//       const maxLimit = Number(maxL);
//       // Here, logoImage is already a base64 string
//       console.log("Data", logoImage, name, symbol, maxLimit);
//       const result = await ledger.call(
//         "createAndMintNFT",
//         logoImage,
//         name,
//         symbol,
//         maxLimit
//       );
//       console.log("Principal of NFT",result.toText()); // Handle the result as needed
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//     }
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();

//       reader.onload = function (loadEvent) {
//         setLogoImage(loadEvent.target.result); // This is the base64 image string
//       };

//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "500px",
//         margin: "20px auto",
//         padding: "20px",
//         borderRadius: "5px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "12px" }}
//       >
//         <input type="file" onChange={handleImageChange} />
//         <input
//           type="text"
//           placeholder="NFT Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Symbol"
//           value={symbol}
//           onChange={(e) => setSymbol(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Max Limit"
//           value={maxL}
//           onChange={(e) => setMaxL(e.target.value)}
//         />
//         <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
//           Create and Mint NFT
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateAndMintNFTForm;

import React, { useState } from "react";
import ic from "ic0";
import "./CreateAndMintNFTForm.css";
// Assuming this is correctly set up to point to your canister
const ledger = ic.local("bkyz2-fmaaa-aaaaa-qaaaq-cai");

function CreateAndMintNFTForm() {
  const [logoImage, setLogoImage] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxL, setMaxL] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const maxLimit = Number(maxL);
      console.log("Data", logoImage, name, symbol, maxLimit);
      const idlFactory = ({ IDL }) => {
        const List = IDL.Rec();
        List.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List)));
        return IDL.Service({
          createAndMintNFT: IDL.Func(
            [IDL.Text, IDL.Text, IDL.Text, IDL.Nat16],
            [IDL.Principal],
            []
          ),
          getNFTValues: IDL.Func([], [IDL.Vec(List)], []),
          getNFTsOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
          getOwnedNFTs: IDL.Func(
            [IDL.Principal],
            [IDL.Vec(IDL.Principal)],
            ["query"]
          ),
          msgCaller: IDL.Func([], [IDL.Principal], []),
        });
      };
      const authenticatedCanisterBackend = await window.ic.plug.createActor({
        canisterId: "rfrca-lyaaa-aaaap-ag7ka-cai",
        interfaceFactory: idlFactory,
      });
      console.log("auth canister", authenticatedCanisterBackend);

      const resultMsgValue = await authenticatedCanisterBackend.msgCaller();
      const result = await authenticatedCanisterBackend.createAndMintNFT(
        logoImage,
        name,
        symbol,
        maxLimit
      );
      console.log("1", resultMsgValue.toText());
      console.log("Canister Return", result.toText());
      const canisterId = result.toText();
      //   const result = await ledger.call(
      //     "createAndMintNFT",
      //     logoImage,
      //     name,
      //     symbol,
      //     maxLimit
      //   );
      //   console.log("Principal of NFT", result.toText());
      alert("Success ", canisterId);
    } catch (error) {
      alert("Failed");

      console.error("Error minting NFT:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (loadEvent) {
        setLogoImage(loadEvent.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="NFT Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Limit"
          value={maxL}
          onChange={(e) => setMaxL(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create and Mint NFT"}
        </button>
      </form>
    </div>
  );
}

export default CreateAndMintNFTForm;
