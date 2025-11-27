import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

export function SortField({
  label,
  optionList,
  hideOptionAll = false,
  defaultValue = '',

  onChange,
}) {
  const [value, setValue] = useState(defaultValue)

  function handleChange(e) {
    const value = e.target.value
    setValue(value)

    if (hideOptionAll && value === 'all') {
      return onChange?.('')
    }

    onChange?.(value)
  }

  return (
    <FormControl
      fullWidth
      size="small"
      sx={{
        minWidth: 200,
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select value={value} label={label} onChange={handleChange}>
        {!hideOptionAll && <MenuItem value="all">All</MenuItem>}
        {optionList?.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
