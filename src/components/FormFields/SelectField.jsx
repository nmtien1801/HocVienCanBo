import { FormControl, FormHelperText, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'
export function SelectField({ name, control, label, optionList, onFieldChange, ...props }) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  function handleChange(event) {
    onChange(event)
    onFieldChange?.(event.target.value)
  }

  return (
    <React.Fragment>
      <FormControl fullWidth size="small" error={invalid}>
        {label && (
          <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
            {label} {props.required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
        )}
        <Select
          value={`${value}` || ''}
          name={name}
          onChange={handleChange}
          onBlur={onBlur}
          inputRef={ref}
          {...props}
        >
          {optionList?.map((option, idx) => (
            <MenuItem value={option.value} key={idx}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error?.message}</FormHelperText>}
      </FormControl>
    </React.Fragment>
  )
}
