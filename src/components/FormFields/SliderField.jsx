import { FormControl, FormHelperText, Slider, Typography } from '@mui/material'
import { useController } from 'react-hook-form'

export function SliderField({ name, control, label, required }) {
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

      <Slider
        name={name}
        value={parseInt(value)}
        onChange={(_, value) => onChange(value)}
        valueLabelDisplay="on"
      />
      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  )
}
