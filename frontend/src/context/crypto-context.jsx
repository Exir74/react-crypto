import {createContext, useContext, useEffect, useState} from "react";
import {fakeFetchCrypto, fetchAssets} from "../components/api.js";
import {percentDifference} from "../utils.js";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
})

export function CryptoContextProvider({children}) {
  const [loading, setLoading] = useState(false)
  const [crypto, setCrypto] = useState([])
  const [assets, setAssets] = useState([])

  //запрос к псевдо апи, 1 раз при инициализации

  function mapAssets(assets, result) {
    return (assets.map(asset => {
      // const coin = result.find(c => c.id === asset.id) // ищем есть ли наша крипта в общем списке катировок для получения цены и тд
      const coin = result.find((item) => {
        return item.id === asset.id
      }) // тоже самое что и выше только по тупому))
      return {
        grow: asset.price < coin.price, // bool
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        // выше мы записываем в объект нашей крипты определенные показатели,
        // тем самым не создаем лишних функций (удобно)
        name:coin.name,
        ...asset // возвращаем в массив все элементы которые были там ранее, чтобы не потерять
      }
    }))
  }

  useEffect(() => {
    async function preload() {
      setLoading(true)
      const {result} = await fakeFetchCrypto() // в фейк апи приходит объект с поолем result, вот тут мы его и записываем сразу
      const assets = await fetchAssets()

      setAssets(mapAssets(assets, result))
      setCrypto(result)
      setLoading(false)
      console.log(assets)
    }

    preload()
  }, []);

  function addAsset(newAsset) {
    // setAssets(prevState => [...prev, newAsset])
    setAssets(prevState => mapAssets([...prevState, newAsset], crypto))
  }

  return <CryptoContext.Provider value={{loading, crypto, assets, addAsset}}>{children}</CryptoContext.Provider>
}

export default CryptoContext

export function useCrypto () {
  return useContext(CryptoContext)
}