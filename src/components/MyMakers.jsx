import { memo } from "react"
import { Popup, useMap, CircleMarker, useMapEvents } from 'react-leaflet';
import PixiOverlay from "react-leaflet-pixi-overlay";

const prepareArray = (locations) =>{
	return locations.map( ({mainName, locationInformation}, index) => {
		return {
			id: `${mainName.replace(/\s/g,'').trim()}-${index}`,
			iconColor: "#01549D",
			customIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">\n<path d="M4 8C6.20914 8 8 6.20914 8 4C8 1.79086 6.20914 0 4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8Z" fill="#0D71C9"/>\n</svg>',
			position: [locationInformation.latitude, locationInformation.longitude],
			tooltip: mainName,
		}
	})
}

const MyMakers = ({ locations, onChange, OldLocation }) => {

	const map = useMapEvents({
		moveend() {
			locations = OldLocation.filter(({ locationInformation }) => map.getBounds().contains({ lat: locationInformation.latitude, lng: locationInformation.longitude }))
			console.log('Points', locations.length)
			onChange(locations)
		},
	})

	return (
		<PixiOverlay markers={prepareArray(locations)} />
	)

	// return locations.map(({ mainName, locationInformation }, index) => {
	// 	return (
	// 		<CircleMarker key={`${mainName}-${index}`} center={[locationInformation?.latitude, locationInformation?.longitude]} radius={1}>
	// 			<Popup>{mainName}</Popup>
	// 		</CircleMarker>
	// 	)
	// })
}

export default memo(MyMakers)