import { Creators } from "./actions";
import { default as toastr } from "Redux/toastr/operations";
import abi from "Constants/abi/SimProtector.json";
import { ethers } from "ethers";
import { ArbProvider } from "arb-provider-ethers";

// const ADDR = "0xebb10aadcfe3903a474dda106cffa597794b7a66"; // full rinkeby
const ADDR = "0x895521964D724c8362A36608AAf09A3D7d0A0445"; // arbitrum
const ROPSTEN = "0xAA92f0E922ea64912DE454048deF8D3274260f47";

// const ADDR = "0xdd03704a1d8540b12889a7837161127632c21c14"; // rollup

const init = () => async dispatch => {
  try {
    dispatch(Creators.initStart());

    let provider = new ArbProvider(
      "http://104.248.9.236:1235",
      new ethers.providers.Web3Provider(window.ethereum)
    );

    let web3Provider = new ethers.providers.Web3Provider(window.ethereum, "ropsten");
    
    const signer = provider.getSigner()
    let rink_con = new ethers.Contract(ADDR, abi.abi, signer);
    let rop_con = new ethers.Contract(ROPSTEN, abi.abi, web3Provider.getSigner());
    
    dispatch(Creators.initSuccess({
        contracts: [rink_con, rop_con],
        providers: [provider, web3Provider],
        abi: abi.abi
    }));

  } catch (e) {
    console.log(e);
  }
};

const addProvider = address => async (dispatch, getState) => {
  try {
    dispatch(Creators.working(true));
    const contr = await getState().contract.instance;
    await contr["addProvider(address)"](address);
    console.log('done')
  } catch (e) {
    console.log('add provider err', e);
    dispatch(toastr.error("Problem adding provider"));
  }
};

const registerPhoneNumber = (phoneNumber, numberOwner) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    const contr = await getState().contract.instance;
    let txn = await contr.functions.registerPhoneNumber(hashed, numberOwner);
    const r = await txn.wait(); 
    if(r) {
      let evts = r.events || [];
      let evt = evts[0];
      if(evt) {
        let vals = evt.args;
        if(vals) {
          let pn = vals.phoneNumber.toString();
          let timestamp = (vals.timestamp.toString()-0)*1000;
          let ownerAddress = (vals.ownerAddress.toString());
          dispatch(Creators.lastReceipt({
            phoneNumber: pn,
            timestamp,
            ownerAddress
          }));
        }
      }
    }
    
  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem register number"));
  }
};

const confirmShutdown = phoneNumber => async (dispatch, getState) => {
  try {
    dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    let txn = await getState().contract.instance.functions.confirmShutdown(hashed);
    const r = await txn.wait(); 
    console.log("Receipt", r);
    return r;
  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem register number"));
  }
};

const registerSimChange = phoneNumber => async (dispatch, getState) => {
  try {
    dispatch(Creators.working(true));
    let hashed = ethers.utils.id(phoneNumber);
    const contr = await getState().contract.instance;
    let txn = await contr.functions.registerSimChange(hashed);
    const r = await txn.wait(); 
    if(r) {
      let evts = r.events || [];
      let evt = evts[0];
      if(evt) {
        let vals = evt.args;
        if(vals) {
          let pn = vals.phoneNumber.toString();
          let timestamp = (vals.timestamp.toString()-0)*1000;
          
          dispatch(Creators.lastReceipt({
            phoneNumber: pn,
            timestamp
          }));
        }
      }
    }
    
  } catch (e) {
    console.log(e);
    dispatch(toastr.error("problem register number"));
  }
};


const changeNetwork = (idx) => (dispatch, getState) => {
  console.log("IDX", idx);

  let cons = getState().contract.availableContracts;
  let provs = getState().contract.availableProviders;
  dispatch(Creators.changeNetwork(cons[idx], provs[idx]));
}

export default {
  init,
  addProvider,
  registerPhoneNumber,
  confirmShutdown,
  registerSimChange,
  changeNetwork 
};
