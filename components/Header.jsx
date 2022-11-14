import {useMoralis} from "react-moralis"
import { useEffect } from "react"

export default function Header() {

    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    
    useEffect(()=>{
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected", "inject")){
                enableWeb3()
            }
        }

    },[isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if(account == null) {
                deactivateWeb3()
                window.localStorage.removeItem("connected")
                console.log("Null account found")
            }
        })
    })

    return(
    <div className="border-8" >
     {account ? (<div>Connected to {account}</div>) : (<div><button onClick={
        async () => {
            await enableWeb3()
            if(typeof window !== "undefined"){
                  window.localStorage.setItem("connected", "inject")
            }
          
        }} 
        disabled={isWeb3EnableLoading}
        >Connect</button></div>)}
    </div>
    )
}