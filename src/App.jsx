

import React, { useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import socketIOClient from "socket.io-client";
import './App.css'

const endpoint = 'http://localhost:4444';
const socket = socketIOClient(endpoint);
let a = 0;

function renderMarkers(data) {
 return (
  <Marker position={[data.locationInformation.latitude, data.locationInformation.longitude]}>
    <Popup>
        {data.mainName}
    </Popup>
  </Marker>
 )
}

function ChangeView({ center, zoom }) {
    const map = useMap();

  map.setView(center, zoom);
  return null;
}

function App() {
  const [positions, setPositions] = React.useState([-14.4086569,-51.31668]);
  const [data, setData] = React.useState([]);

  let a = false
  useEffect(() => {
      async function getData() {
        const resonse = await fetch('http://localhost:3333/locations')
        const data = await resonse.json()

        return data
      }
      getData().then(data => {
          console.log(data)
          setData(data)
      })

      if(a){
        socket.on("locations", (info) => {
          console.log('New location: ', info)
          setData(prevData => {
            let test = [ ...prevData, info ]
            return test
          })
          setPositions([info.locationInformation.latitude, info.locationInformation.longitude])
        })
      }

      a=true
  }, []);
  return (
    <div className="App">

      <div className='container'>
        <MapContainer center={positions} zoom={3}>
        <ChangeView center={positions} zoom={5} />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {data.map(renderMarkers)}
        </MapContainer>
      </div>

    </div>
  )
}

export default App
