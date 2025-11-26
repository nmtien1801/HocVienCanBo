import CheckIcon from '@mui/icons-material/Check'
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material'
import { useController } from 'react-hook-form'

export function MultiSelectField({
  name,
  control,
  label,
  optionList = [],
  size = 'small',
  disabled,
  onFieldChange,
  required,
  haveSelectAllOption = false,
}) {
  optionList = haveSelectAllOption
    ? [{ label: 'Tất cả', value: '@SELECT-ALL' }].concat(optionList)
    : optionList

  const {
    field: { value, onChange, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  return (
    <FormControl fullWidth size={size} error={Boolean(invalid)}>
      {label && (
        <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <Autocomplete
        sx={{
          '.MuiButtonBase-root.MuiChip-root': {
            borderRadius: '4px',
            color: 'white',
            bgcolor: 'primary.main',

            '.MuiSvgIcon-root': {
              fill: 'white',
            },
          },
        }}
        multiple
        size={size}
        disabled={disabled}
        options={optionList}
        getOptionLabel={(option) => option?.label || ''}
        value={
          (Array.isArray(optionList) &&
            optionList.length > 0 &&
            optionList.filter(
              (option) => option?.value !== '@SELECT-ALL' && value && value.includes(option?.value),
            )) ||
          []
        }
        onChange={(_, newValue) => {
          let values = newValue.map((option) => option.value)
          if (haveSelectAllOption && newValue.find((x) => x.value === '@SELECT-ALL')) {
            values = optionList
              .filter((x) => x.value !== '@SELECT-ALL')
              .map((option) => option.value)
          }

          onChange(values)
          onFieldChange?.(values)
        }}
        isOptionEqualToValue={(option, value) => option.value === value}
        filterSelectedOptions
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option.value}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              color: value && value.includes(option.value) ? 'text.disabled' : 'text.primary', // Disable label color
            }}
          >
            <span>{option.label}</span> <Box flexGrow={1} />
            {value && value.includes(option.value) && <CheckIcon />}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            variant="outlined"
            error={Boolean(error)}
            helperText={error ? error.message : null}
          />
        )}
      />
      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  )
}
