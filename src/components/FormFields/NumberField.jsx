import { Box, TextField, Typography } from '@mui/material'
import { useController } from 'react-hook-form'

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function NumberField({
  name,
  control,
  label,
  multiline = false,
  rows = 5,
  textFieldSize = 'small',
  onFieldChange,
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
    const formattedValue = formatNumber(parseInt(rawValue))
    onChange(rawValue)

    onFieldChange?.(formattedValue)
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
        value={value ? formatNumber(parseInt(value, 10)) : ''}
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
