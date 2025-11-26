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

const LocationMarker = ({ onLocationSelected, disabled, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || defaultCenter)

  useMapEvents({
    click(e) {
      if (disabled) return

      const { lat, lng } = e.latlng
      const newLocation = {
        link: `https://www.google.com/maps?q=${lat},${lng}&z=18&output=embed`,
        lat,
        lng,
      }
      setPosition([lat, lng])
      onLocationSelected(newLocation)
    },
  })

  return position === null ? null : <Marker position={position} icon={customIcon} />
}

export const MapField = ({ name, control, required, label, disabled = false }) => {
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  return (
    <FormControl
      fullWidth
      size="small"
      error={invalid}
      sx={{
        '.leaflet-control-attribution': {
          display: 'none !important',
        },
      }}
    >
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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker
          disabled={disabled}
          initialPosition={value?.lat && value?.lng ? [value.lat, value.lng] : defaultCenter}
          onLocationSelected={onChange}
        />
      </MapContainer>

      {error && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  )
}
