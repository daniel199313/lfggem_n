import React, { useEffect, useState } from "react";
import lgf from "../../assets/images/lfggem_png3.png";
import opensea from "../../assets/images/opensea.png";
import twitter from "../../assets/images/twitter.png";
import Button from "../../components/Button";
import { BsWallet2, BsTwitter } from "react-icons/bs";
import { FaFileContract } from "react-icons/fa";
import { useMetaMask } from "metamask-react";
import clsx from "clsx";
import { checkAddress } from "../../api";
import { Abi__factory } from "../../web3/index";
import { ethers } from "ethers";
import Modal,{useModal,Loading,useLoading} from '../../components/modal'
import getConfig from '../../config'
const cfg = getConfig()

const displayAccount = (ac) => {
  return `${ac.substring(0, 7)} ...`;
};

const Main = () => {
  const { chainId, account, connect, ethereum } = useMetaMask();
  const [notETH, setNotEth] = useState(true);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState(null);
  const [signature,setSignature] = useState('')
  const {model,showMessage,close} = useModal()
  const {show,loading,closeLoading} = useLoading()


  useEffect(async () => {
    if (account) {
      const res = await checkAddress(account);
      setSignature(res.data.data)
      console.log('res',res)
    }
    if (chainId == cfg.chainId) {
      setNotEth(false);
      const p = new ethers.providers.Web3Provider(ethereum);
      setProvider(p);
    } else {
      setNotEth(true)
    }
    console.log('chainId',chainId)
  }, [account, chainId]);

  useEffect(async () => {
    if (provider) {
      const signer =  provider.getSigner()
      const c = Abi__factory.connect(cfg.contractAddress,signer);
      
      setContract(c);
      
      try {
        const _status = await c._status(account);
        setStatus(_status);
        console.log('status',_status)
      } catch (err) {
        console.error(err);
      }
    }
  }, [provider]);

  const onMint = async (num=1) => {
    if (!account) {
      return showMessage('Please connect to your wallet')
    }
    if (notETH) {
      return showMessage(cfg.chainId == '0x1' ? 'Please switch to ETH Mainnet': 'Please switch to Rinkeby Test')
    }

    if (status && contract) {
      if (status.soldout === true && signature === "0x") {
        return showMessage("Sold out");
      }
      if (status.soldout === true && signature !== "0x" && status.boosterMinted >= status.boosterSupply) {
        return showMessage('Sold out')
      }
      if (status.soldout === true && signature !== "0x" && status.boosterTimeout.toNumber() < Date.now()/1000) {
        console.log('boosterTimeout', status.boosterTimeout.toNumber())
        return showMessage('Sold out')
      }      
     
      try {   
        // 如果 已经mint大于 2 大于2的部分收费
        let payAmount;
        if (status.userMinted + num > status.walletFreeLimit) {
            payAmount = status.userMinted + num - status.walletFreeLimit;
            if (payAmount > num)  payAmount = num;
        }
        const value= payAmount * status.price //如果超过免费mint 需要付费

        // 调用mint
        const gas = await contract.estimateGas.mint(ethers.BigNumber.from(num), signature,{
          from: account,
          value
        })
        console.log('gas',gas.toNumber())
        const mintRes = await contract.mint(ethers.BigNumber.from(num), signature, {
          from: account,
          gasLimit: 720000,
          // gasPrice:gas,
          value
        });
        // 等待N个区块
        await mintRes.wait(1)
        console.log(mintRes)
        showMessage('Mint success')
      } catch (err) {
        if (err.code == 4001) {
          showMessage('User denied transaction signature','Mint fail:')
        } else {
          showMessage('Please try again later','Mint fail:')
          console.log(err)
        }
      }
    }
  };

  return (
    <div id="main" className="main relative">
      {/* 弹窗 */}
      <Modal show={model.show} title={model.title} onClose={()=>close()}>{model.children}</Modal>
      <Loading show={show}/>


      <div className="absolute top-5 right-5 flex sm:flex-row flex-col-reverse items-end sm:items-center">
        <div className="flex mt-3 sm:mt-0">
          <button
            className={clsx(
              "ml-4 text-cyan-700 hover:scale-125 transition-all"
            )}
          >
            <FaFileContract size={26} />
          </button>
          <a href="https://twitter.com/LFG_GemNFT" target='_blank' className="block ml-4 w-6 hover:scale-125 transition-all">
            <img src={twitter} alt="twitter" />
          </a>
          <button className="ml-4 w-6 hover:scale-125 transition-all">
            <img src={opensea} alt="opensea" />
          </button>
        </div>
        <Button
          className={clsx(
            "text-lg ml-6",
          )}
          onClick={async () => {
            if (account) {
              return;
            }
            const provider = await connect();
            console.log(ethereum)
          }}
        >
          <BsWallet2
            className="inline-block mr-2"
            style={{ verticalAlign: "-3px" }}
          />
          {!account? "Connect Wallet": displayAccount(account)}
        </Button>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 text-center text-blue-900 z-[1]">
        <h2 className="text-2xl sm:text-4xl mb-5 drop-shadow-md">
          <b>
            {!account
              ? "Connect First"
              : notETH
              ? "Switch to the correct network"
              : "Let's mint"}
          </b>
        </h2>
        <Button className="py-2 text-2xl sm:text-4xl shadow-md" onClick={async ()=>{
          loading()
          await onMint(1)
          closeLoading()
        }}>
          Mint your best NFT
        </Button>
      </div>
      <div className="absolute top-5 sm:top-28 left-5 sm:left-auto right-auto sm:right-28 w-1/3 max-w-[400px]">
        <img src={lgf} alt="lfggem" width="100%" />
      </div>
      <p className="left-1/2 -translate-x-1/2 absolute bottom-3 text-center w-full">
        We believe in Art and Community. <b>TALK NO SHIT AND LFG</b>.
      </p>
    </div>
  );
};

export default Main;
