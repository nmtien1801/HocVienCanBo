import React from 'react'
import { Box, Typography, FormHelperText } from '@mui/material'
import { useController } from 'react-hook-form'
import { TimeField as MuiTimeField } from '@mui/x-date-pickers'

export function TimeField({ name, control, label, required, disabled }) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control })

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <Box display="flex" alignItems="center">
        <MuiTimeField value={value} format="HH:mm" ampm={false} onChange={onChange} />
      </Box>
      {error && <FormHelperText>{error?.message}</FormHelperText>}
    </Box>
  )
}
