import { Box, TextField, Typography } from '@mui/material'
import { useController } from 'react-hook-form'

export function PhoneField({
  name,
  control,
  label,
  multiline = false,
  rows = 5,
  textFieldSize = 'small',
  ...props
}) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  function handleChange(e) {
    const rawValue = e.target.value.replace(/\D/g, '')

    onChange(rawValue)
  }

  return (
    <Box>
      {label && (
        <Typography gutterBottom variant="body2" fontWeight={600} color="text.secondary">
          {label} {props.required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <TextField
        fullWidth
        size={textFieldSize}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        inputRef={ref}
        variant="outlined"
        error={invalid}
        multiline={multiline}
        rows={rows}
        helperText={error?.message}
        {...props}
      />
    </Box>
  )
}
