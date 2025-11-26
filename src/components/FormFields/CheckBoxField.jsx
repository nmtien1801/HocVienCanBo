import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

export function MultiCheckBoxField({
  name,
  control,
  label,
  optionList = [],
  divider,
  onFieldChange,
}) {
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  function handleChange(e) {
    const targetValue = e.target.value
    const isChecked = e.target.checked
    const newValue = [...value]

    if (isChecked && !newValue.includes(targetValue)) {
      newValue.push(targetValue)
    } else {
      newValue.splice(newValue.indexOf(targetValue), 1)
    }

    onChange(newValue)
    onFieldChange?.(newValue)
  }

  return (
    <FormControl fullWidth size="small" sx={{ m: 1 }}>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
      <Stack spacing={0.5} className={'checkbox-wrapper'}>
        {Array.isArray(optionList) &&
          optionList.length > 0 &&
          optionList?.map((option, idx) => (
            <Box
              key={idx}
              sx={{
                '.divider__checkbox': {
                  display: 'none',
                },

                '&:last-child .divider__checkbox': {
                  display: 'block',
                },
              }}
            >
              {divider && <Divider sx={{ my: 1 }} />}

              <FormControlLabel
                control={
                  <Checkbox
                    name={name}
                    checked={value?.includes(option.value?.toString())}
                    onChange={handleChange}
                    value={option.value}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: '20px' },
                    }}
                  />
                }
                label={option.label}
              />
              {divider && <Divider className="divider__checkbox" sx={{ my: 1 }} />}
            </Box>
          ))}
      </Stack>
      {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  )
}

export function CheckBoxField({ label, optionList = [], divider, selectedValue, onFieldChange }) {
  function handleChange(e) {
    const targetValue = e.target.value

    onFieldChange?.(targetValue)
  }

  return (
    <FormControl fullWidth size="small" sx={{ m: 1 }}>
      <FormLabel>{label}</FormLabel>
      <Stack spacing={0.5} className={'checkbox-wrapper'}>
        {Array.isArray(optionList) &&
          optionList.length > 0 &&
          optionList?.map((option, idx) => (
            <Box
              key={idx}
              sx={{
                '.divider__checkbox': {
                  display: 'none',
                },

                '&:last-child .divider__checkbox': {
                  display: 'block',
                },
              }}
            >
              {divider && <Divider sx={{ my: 1.5 }} />}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={`${selectedValue}` === `${option.value}`}
                    onChange={handleChange}
                    value={option.value}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: '20px' },
                    }}
                  />
                }
                label={option.label}
              />
              {divider && <Divider className="divider__checkbox" sx={{ my: 1.5 }} />}
            </Box>
          ))}
      </Stack>
    </FormControl>
  )
}

export function SingleCheckBoxField({
  name,
  control,
  label,
  isBoolean,
  onFieldChange,
  disabled = false,
}) {
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  function handleChange(e) {
    const isChecked = e.target.checked
    onChange(isBoolean ? isChecked : isChecked ? 1 : 0)
    onFieldChange?.(isBoolean ? isChecked : isChecked ? 1 : 0)
  }

  return (
    <FormControl fullWidth size="medium">
      <FormControlLabel
        control={
          <Checkbox
            disabled={disabled}
            name={name}
            checked={Boolean(value)}
            onChange={handleChange}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: '20px' },
            }}
          />
        }
        label={label}
      />

      {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  )
}
