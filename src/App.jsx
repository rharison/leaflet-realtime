import axios from 'axios';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import socketIOClient from 'socket.io-client'
import ChangeView from './components/ChangeView';
import MyMakers from './components/MyMakers';
import { RemoveAccentsString } from './util/string'

import './App.css'

const endpoint = 'http://192.168.1.102:4444/';
// const socket = socketIOClient(endpoint, {path: "/socket/socket.io"});
const socket = socketIOClient(endpoint);

function App() {
  const [locations, setLocations] = useState([])
  const [locationsBkp, setLocationsBkp] = useState([])

  const [position, setPosition] = useState([])

  let oneRender = true;

  const getLocations = useCallback(async ()=>{
    const locations = await axios.get('http://192.168.1.102:3333/locations');
    const newLocations = locations.data;
    console.log('>>>Total Places: ',newLocations.length)

    setLocations(newLocations)
    setLocationsBkp(newLocations)
  }, [])

  useLayoutEffect(()=>{
    if(oneRender){
      getLocations();
    }

  },[getLocations])

  useEffect(()=>{
    if(oneRender){
      oneRender = false

      socket.on('connect', (socket) => {
        console.log('connected')
      })

      socket.on("locations", (info) => {
        console.log('>>>New Location: ', info)
        setLocationsBkp(prev=> [...prev, info])
        setLocations(prev=> [...prev, info])
        setPosition([info.locationInformation.latitude, info.locationInformation.longitude])
      })

    }
  },[])

  const setNewLocations = useCallback((locations) =>setLocations(locations),[])

  return (
    <div className="App">
        <MapContainer center={[-14.4086569,-51.31668]} zoom={7} preferCanvas={false} className=".container">
            {position.length && <ChangeView center={position}/>}
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGhhbmRlciIsImEiOiJja2dlOTVhdHAwYnRkMnFwYXpucnB0d2J2In0.pKLtOp1h79JSsJ-0mY_ulg"
          />
          {locations && <MyMakers locations={locations} onChange={setNewLocations} OldLocation={locationsBkp}/>}
        </MapContainer>
    </div>
  )
}

export default App