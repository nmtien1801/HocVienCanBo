import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

export function PasswordField({
  name,
  control,
  label,
  multiline = false,
  rows = 5,
  textFieldSize = 'small',
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false)
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {props.required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <TextField
        size={textFieldSize}
        fullWidth
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        inputRef={ref}
        variant="outlined"
        error={invalid}
        helperText={error?.message}
        type={showPassword ? 'text' : 'passWord'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle passWord visibility"
                  onClick={(e) => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...props}
      />
    </Box>
  )
}
