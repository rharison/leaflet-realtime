import axios from 'axios';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import socketIOClient from 'socket.io-client'
import ChangeView from './components/ChangeView';
import MyMakers from './components/MyMakers';
import { RemoveAccentsString } from './util/string'

import './App.css'

const exclude = ["chave", "hospital", "barbearia", "policia", "site", "marketing",
  "agencia", "publicidade", "decoracao", "grafica", "vidracaria", "creche", "assembleia",
  "associacao", "atelie", " eletrica ", "banco", "bercario", "mecanica", "mercearia",
  "puteiro", "cvc", "cabelereiro", "viagens", "veterinaria", "condominio", "residencial",
  "construtora", "ads", "detran", "sanitaria", "vigilancia", "equipe", "oracao",
  "congregacao", "jr ", " jr", "petshop", "pet shop", "estetica", "boutique", "atacado",
  "varejo", "acessorios", "clinica", "imoveis", "software", "contabilidade", "padaria",
  "lanchonete", "supermercado", "farmacia", "posto", "puc-", "restaurante", "secretaria",
  "senai", "bazar", "cabeleireiro", "system", "advogado", " cortes"
]

const endpoint = 'http://144.22.139.83/';
const socket = socketIOClient(endpoint, {path: "/socket/socket.io"});

function App() {
  const [locations, setLocations] = useState([])
  const [locationsBkp, setLocationsBkp] = useState([])

  const [position, setPosition] = useState([])

  const filterLocations = useCallback((locations) => {
    let newLocations = locations.filter(location=> location.locationInformation);
    newLocations = newLocations.filter(loc=> !exclude.some(ex=> RemoveAccentsString(loc.mainName).toLowerCase().includes(ex)))
    return newLocations
  },[])

  let oneRender = true;

  const getLocations = useCallback(async ()=>{
    const locations = await axios.get('http://144.22.139.83/http/locations');
    let newLocations = locations.data;

    console.log('>>>ALL',newLocations.length)
    newLocations = filterLocations(newLocations)

    console.log('>>>FILTERED',newLocations.length)

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

        const [locationFilter] = filterLocations([info])

        if(locationFilter){
          console.log('New location: ', locationFilter)
          setLocationsBkp(prev=> [...prev, locationFilter])
          setLocations(prev=> [...prev, locationFilter])
          setPosition([locationFilter.locationInformation.latitude, locationFilter.locationInformation.longitude])
        } else {
          console.log('Remove: ', info)
        }
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