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
  // 合约地址
  const Address = "0xe8c2d81c82bb768ca2dc4ada1c6407732b809966";

  useEffect(async () => {
    if (account) {
      const res = await checkAddress(account);
      setSignature(res.data.data)
      console.log('res',res)
    }
    if (chainId == "0x1" || chainId == "0x4") {
      setNotEth(false);
      const p = new ethers.providers.Web3Provider(ethereum);
      setProvider(p);
    } 
    console.log('chainId',chainId)
  }, [account, chainId]);

  useEffect(async () => {
    if (provider) {
      const signer =  provider.getSigner()
      const c = Abi__factory.connect(Address,signer);
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

  const onMint = async () => {
    if (status && contract) {
      if (status.soldout === true && signature === "0x") {
        return alert("已售光");
      }
      if (status.soldout === true && signature !== "0x" && status.boosterMinted > status.boosterSupply) {
        return alert('超过最大可mint数量')
      }
      if (status.soldout === true && signature !== "0x" && status.boosterTimeout.toNumber() < Date.now()/1000) {
        console.log('boosterTimeout', status.boosterTimeout.toNumber())
        return alert('超过白名单时间')
      }      
     
      try {
        const signer =  provider.getSigner()
       
        // 链接合约
        const c = Abi__factory.connect(Address,signer);        
        const value= status.userMinted >= 2 ? status.price: undefined //如果超过免费mint 需要付费

        // 调用mint
        const mintRes = await c.mint(ethers.BigNumber.from(1), signature, {
          from: account,
          gasLimit: 720000,
          value
        });
        // 等待N个区块
        await mintRes.wait(1)
        console.log(mintRes)
        alert('mint 成功')
      } catch (err) {
        alert('mint 失败 ' + err.message)
      }
    }
  };

  return (
    <div id="main" className="main relative">
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
            notETH ? "bg-red-200 text-red-700" : ""
          )}
          onClick={async () => {
            if (account) {
              return;
            }

            const provider = await connect();
            // const web3 = new Web3(provider);
            // if (web3) {
            //   connect();
            // }
          }}
        >
          <BsWallet2
            className="inline-block mr-2"
            style={{ verticalAlign: "-3px" }}
          />
          {!account
            ? "Connect Wallet"
            : notETH
            ? "Switch to ETH"
            : displayAccount(account)}
        </Button>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 text-center text-blue-900 z-[1]">
        <h2 className="text-2xl sm:text-4xl mb-5 ">
          <b>
            {!account
              ? "Connect First"
              : notETH
              ? "Switch to the correct network"
              : "Let's mint"}
          </b>
        </h2>
        <Button className="py-2 text-2xl sm:text-4xl" onClick={onMint}>
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
