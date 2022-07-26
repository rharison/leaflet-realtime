import { memo, useEffect } from "react"
import { useMap, useMapEvents } from 'react-leaflet';

const ChangeView = ({center}) =>{
    const map = useMapEvents({
		click(e) {
			map.setView(e.latlng, map.getZoom(), {animate: true})
		},
	})

    useEffect(()=>{
        if(!center.length) return null

        map.setView(center, 9, {animate: true })
    },[center])


}

export default memo(ChangeView)