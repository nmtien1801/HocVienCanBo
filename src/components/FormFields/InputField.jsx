import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, Typography } from '@mui/material'
import { useController } from 'react-hook-form'

export function InputField({
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

  return (
    <Box>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {props.required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <TextField
        fullWidth
        size={textFieldSize}
        value={value || ''}
        onChange={onChange}
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
