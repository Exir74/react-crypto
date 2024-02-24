import {Button, Drawer, Layout, Modal, Select, Space} from "antd";
import {useEffect, useState} from "react";
import CoinInfoModal from "../CoinInfoModal.jsx";
import AddAssetForm from "../AddAssetForm.jsx";
import {useCrypto} from "../../context/crypto-context.jsx";

const headerStyle = {
  width: '100%',
  textAlign: 'center',
  height: 60,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
export default function AppHeader() {
  const {crypto} = useCrypto()
  const [select, setSelect] = useState(false);
  const [modal, setModal] = useState(false)
  const [coin, setCoin] = useState(null)
  const [drawer, setDrawer] = useState(false  )
  useEffect(() => {
    const keypress = event => {
      if (event.key === '/') {
        setSelect((prev) => !prev)
      }
    }
    document.addEventListener('keypress', keypress)
    return () => document.removeEventListener("keypress", keypress)
  }, []);

  function handleSelect(value) {
    console.log(value)
    setModal(true)
    setCoin(crypto.find(c => c.id === value))
  }

  return (
    <Layout.Header style={headerStyle}>
      <Select
        onSelect={handleSelect}
        style={{
          width: '250px',
        }}
        open={select}
        onClick={() => setSelect((prev) => !prev)}
        value='press / to open'
        options={crypto.map(coin => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{width: '20px'}}
              src={option.data.icon}
              alt={option.data.name} />
            {option.data.label}
          </Space>
        )}
      />
      <Button type="primary"
              onClick={() => setDrawer(true)}
      >Add Asset</Button>
      <Modal
        open={modal}
        onCancel={() => setModal(false)}
        footer={null}
      >
        <CoinInfoModal
          coin={coin} />
      </Modal>
      <Drawer
        width={'600px'}
        title="Add Asset"
        onClose={() => setDrawer(false)}
        open={drawer}
        destroyOnClose
      >
        <AddAssetForm onClose={()=> setDrawer(false)}/>
      </Drawer>
    </Layout.Header>
  )
}