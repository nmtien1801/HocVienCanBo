import { FormControl, FormControlLabel, Switch, Typography } from '@mui/material'
import { useController } from 'react-hook-form'

export function StatusField({
  name,
  control,
  label,
  disabled = false,
  color = 'success',
  required,
  ...others
}) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  })

  return (
    <FormControl>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <FormControlLabel
        control={<Switch disabled={disabled} color={color} checked={value} onChange={onChange} />}
        {...others}
      />
    </FormControl>
  )
}
