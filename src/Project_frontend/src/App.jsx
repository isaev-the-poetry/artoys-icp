// import { useState, useEffect } from "react";
// import { Project_backend } from "declarations/Project_backend";
// // import ic from "ic0";
// import CreateAndMintNFTForm from "./Components/FormCreate";
// import {
//   ConnectButton,
//   ConnectDialog,
//   Connect2ICProvider,
//   useConnect,
// } from "@connect2ic/react";
// // const ledger = ic.local("a3shf-5eaaa-aaaaa-qaafa-cai"); // Ledger canister

// // console.log(await ledger.call("name")); // Call the `name()` method
// function App() {
//   const [greeting, setGreeting] = useState("");
//   const [logo, setLogo] = useState({ logo_type: "", data: "x" });
//   const { isConnected, principal, activeProvider } = useConnect({
//     onConnect: () => {
//       // Signed in
//     },
//     onDisconnect: () => {
//       // Signed out
//     },
//   });
//   function handleSubmit(event) {
//     event.preventDefault();
//     const name = event.target.elements.name.value;
//     Project_backend.greet(name).then((greeting) => {
//       setGreeting(greeting);
//     });
//     return false;
//   }
//   useEffect(() => {
//     // Define an async function inside the useEffect to call the ledger
//     const fetchLogo = async () => {
//       try {
//         console.log("Data", logo.data);
//         // Assuming `ledger` is your contract instance and `call` is the method to invoke `logoDip721`
//         // This part needs to be adjusted based on your actual API or smart contract interaction library
//         // const logoData = await ledger.call("logoDip721");
//         // console.log("Logo Data", logoData);
//         // setLogo(logoData);
//       } catch (error) {
//         console.error("Error fetching logo:", error);
//       }
//     };

//     fetchLogo();
//   }, []); // E
//   return (
//     <main>
//       <img src="/logo2.svg" alt="DFINITY logo" />
//       <br />
//       <br />
//       <br />
//       <center>
//         {" "}
//         {principal}
//         <ConnectButton />
//         <ConnectDialog dark={false} />
//       </center>
//       <CreateAndMintNFTForm />
//       <section id="greeting">{greeting}</section>
//     </main>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Project_backend } from "declarations/Project_backend";
import CreateAndMintNFTForm from "./Components/FormCreate";
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";
import ViewNFT from "./Components/ViewNFT";
// Placeholder component for the "Your NFTs" page

function App() {
  const [greeting, setGreeting] = useState("");
  const [logo, setLogo] = useState({ logo_type: "", data: "x" });
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Actions on sign in
    },
    onDisconnect: () => {
      // Actions on sign out
    },
  });

  useEffect(() => {
    // Define an async function inside the useEffect to fetch necessary data
    // Your existing fetch logic remains here
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/view-nft">View Your NFTs</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <img src="/logo2.svg" alt="DFINITY logo" />
              <center>
                {principal}
                <ConnectButton />
                <ConnectDialog dark={false} />
              </center>
              <CreateAndMintNFTForm />
              <section id="greeting">{greeting}</section>
            </main>
          }
        />
        <Route path="/view-nft" element={<ViewNFT />} />
      </Routes>
    </Router>
  );
}

export default App;
