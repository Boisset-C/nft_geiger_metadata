serverUrl = "https://kx7r9edm7kgw.usemoralis.com:2053/server"; // serverURL
appId = "PPNTAscRBx5ss3VHW8AqoVeZc3ez5G33PRRR8EwA"; // Application ID
Moralis.start({ serverUrl, appId });

// whenever a user clicks Log in button moralis will connect to metamask
//this will store the users info in the server database
let loginButton = document.getElementById("btn-login");
loginButton.addEventListener("click", initializeApp);

// fetching metadata from NFTs from given address in options
function fetchNFTMetadata(NFTs) {
  let promises = [];

  for (let i = 0; i < NFTs.length; i++) {
    let nft = NFTs[i];
    let id = nft.token_id;
    //Call moralis cloud function -> Static JSON FILE
    promises.push(
      fetch(
        "https://kx7r9edm7kgw.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=PPNTAscRBx5ss3VHW8AqoVeZc3ez5G33PRRR8EwA&nftId=" +
          id
      )
        .then(function (response) {
          if (response.status != 200) {
            console.log(response.status);
            return;
          }
        })
        .then((res) => res.json()) //parse return data in json
        .then((res) => JSON.parse(res.result)) // parse result property (target metadata) in json
        .then((res) => {
          nft.metadata = res;
        })
        .then(() => {
          return nft;
        })
    );
  }

  return Promise.all(promises);
}

//renders all the nft to the gui
function renderInventory(NFTs) {
  const parent = document.getElementById("app"); //the row which we are going to append card too
  for (let i = 0; i < NFTs.length; i++) {
    //looping through each nfts
    const nft = NFTs[i];
    let htmlString = `
    <div class="card">
    <img src=${nft.metadata.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${nft.metadata.name}</h5>
      <p class="card-text">${nft.metadata.description}</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div
    `;
    let col = document.createElement("div"); //create dive
    col.className = "col col-md-4"; // added bootstrap col
    col.innerHTML = htmlString; //fill card with meta data
    parent.appendChild(col); // append col card to row
  }
}

// define initilize function which connects your meta mask adress to this dapp
async function initializeApp() {
  let currentUser = Moralis.User.current();
  if (!currentUser) {
    currentUser = await Moralis.Web3.authenticate();
  }

  const options = {
    address: "0x82727c7b9242fd392041b3cbbcc9e0bf1b8729db",
    chain: "rinkeby",
  };
  //In the future we will be able to fetch meta data directly !!will require update
  let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
  console.log(NFTWithMetadata); // call to render each nft
}
