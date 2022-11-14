import { useMoralis, useWeb3Contract, useApiContract, useNativeBalance, useERC20Balances  } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"
import {ethers} from "ethers"

export default function LotteryEntrance() {
  

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)

    const [entranceFee, setEntranceFee] = useState("0")
  

    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId] : null

    const {runContractFunction: getEntranceFee } = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: "getEntranceFee",
      params: {},
    })

     const {runContractFunction: enterRaffle} = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: "enterRaffle",
      params: {},
      msgValue: ethers.utils.parseEther(entranceFee),
    })

    // const { getBalances, data: balance, nativeToken} =  useNativeBalance({ address : "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" })
    const { fetchERC20Balances,data: balance, isLoading, isFetching, error } = useERC20Balances();

    useEffect(()=>{
      if(isWeb3Enabled){
        async function updateUI(){
          const entranceFeeFromCall = (await getEntranceFee())
          if(entranceFeeFromCall ){
            setEntranceFee(ethers.utils.formatEther(entranceFeeFromCall.toString()))
          }
        }
    
        updateUI()
      }


    },[isWeb3Enabled])
    
  
    return( <div>
      {raffleAddress ? 
      (<div>
        <button onClick={async ()=> {await enterRaffle()}}>Enter Raffle</button>
       

      </div>)
      : (<div>
        No Raffle Address Detched
      </div>)
      }

      {error && <>{JSON.stringify(error)}</>}
      <button onClick={() => fetchERC20Balances({ params: {chain: "0x1"} })}>raffle balance</button>
      <pre>{JSON.stringify(balance, null, 2)}</pre>
    </div>)
}