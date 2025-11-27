import { FormControl, FormHelperText, Typography } from '@mui/material'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

const defaultCenter = [10.8231, 106.6297]

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
})

const center = [10.8231, 106.6297]

const LocationMarker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(center)

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      onLocationSelected({
        link: `https://www.google.com/maps?q=${lat},${lng}&z=18&output=embed`,
        lat,
        lng,
      })
    },
  })

  return position === null ? null : <Marker position={position} icon={customIcon} />
}

export const MapComponent = ({ name, control, required, label }) => {
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  return (
    <FormControl fullWidth size="small" error={invalid}>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <MapContainer
        center={value?.lat && value?.lng ? [value.lat, value.lng] : defaultCenter}
        zoom={13}
        style={{
          height: '92px',
          width: '100%',
          border: '1px solid',
          borderColor: '#CED4DA',
          borderRadius: '4px',
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelected={onChange} />
      </MapContainer>

      {error && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  )
}

export default MapComponent
