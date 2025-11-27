import { FormControl, FormHelperText, Typography } from '@mui/material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { useController } from 'react-hook-form'

export function DateTimePickerField({
  name,
  control,
  label,
  withTime = false,
  required = false,
  disabled = false,
  onlyYear = false,
  onChange,
  ...props
}) {
  const {
    field: { value, onChange: controllerOnChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  const Component = withTime ? DateTimePicker : DatePicker
  const format = onlyYear ? 'YYYY' : withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
  const views = onlyYear ? ['year'] : withTime ? ['year', 'month', 'day', 'hours', 'minutes'] : ['year', 'month', 'day'];
  return (
    <FormControl fullWidth size="small" error={invalid}>
      {label && (
        <Typography gutterBottom variant="body2" fontWeight={600} color="text.secondary">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      <Component
        sx={{
          '& input': {
            padding: '8.5px 0px 8.5px 14px',
          },
        }}
        disabled={disabled}
        value={value || null}
        onChange={(date) => {
          onChange?.(date)
          controllerOnChange(date)
        }}
        format={format}
        views={views}
        {...props}
      />
      {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  )
}
