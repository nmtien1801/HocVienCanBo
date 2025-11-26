import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

export function AutocompleteField({ name, control, label, optionList, onFieldChange, ...props }) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <Autocomplete
      options={optionList}
      getOptionLabel={(option) => option.label || ''}
      value={optionList.find((opt) => opt.value === value) || null}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.value : '')
        onFieldChange?.(newValue ? newValue.value : '')
      }}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error?.message}
          size="small"
        />
      )}
      {...props}
    />
  )
}
