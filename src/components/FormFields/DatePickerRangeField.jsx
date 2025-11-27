import { Box, TextField, Typography, Stack } from '@mui/material'
import { PRIMARY_COLOR } from 'constants/common'
import dayjs from 'dayjs'
import gregorian_vi_lowercase from 'helper/DatePickerLanguage'
import { useRef } from 'react'
import { useController } from 'react-hook-form'
import DatePicker, { getAllDatesInRange } from 'react-multi-date-picker'
import 'resource/css/react-multi-date-picker/style.css'
import '../style.css'

export function DatePickerRangeField({ name, control, onFieldChange, disabled = true }) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  })

  const datePickerRef = useRef(null)
  const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')
  const handleValueChange = (date) => {
    let allDates = getAllDatesInRange(date, true)
    let toDay = dayjs().startOf('day').toDate()
    let startDate =
      allDates.length > 0 && allDates[0] >= toDay
        ? formatDate(allDates[0])
        : toDay.format('YYYY-MM-DD')
    let endDate = ''

    if (allDates.length > 1) {
      endDate = formatDate(allDates[allDates.length - 1])
    }

    if (allDates.length === 1) {
      if (!value?.startDate && !value?.endDate) {
        endDate = ''
      } else if (value?.startDate && !value?.endDate) {
        endDate = startDate
      } else if (value?.startDate && value?.endDate) {
        endDate = ''
      }
    }

    onChange({
      startDate: startDate,
      endDate: endDate,
    })
    onFieldChange?.({startDate, endDate})
  }

  return (
    <DatePicker
      ref={datePickerRef}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '26px',
      }}
      value={value ? [dayjs(value.startDate).toDate(), dayjs(value.endDate).toDate()] : []}
      containerStyle={{
        width: '100%',
      }}
      minDate={dayjs().startOf('day').toDate()}
      disabledDay={(date) => {
        if (!value || !value.startDate) return false
        return date.isBefore(dayjs(value.startDate))
      }}
      mapDays={({ date, today }) => {
        if (date?.format('YYYY-MM-DD') === today?.format('YYYY-MM-DD')) {
          return {
            style: {
              color: 'white',
              backgroundColor: PRIMARY_COLOR,
              borderRadius: '50%',
            },
          }
        }

        if (date?.weekDay.index === 0 || date?.weekDay.index === 6) {
          return {
            style: {
              color: '#656A70',
            },
          }
        }

        return {}
      }}
      locale={gregorian_vi_lowercase}
      calendarPosition="bottom-center"
      onChange={(date) => handleValueChange(date)}
      render={
        <Stack direction="row" alignItems="flex-start" flexWrap="wrap" mx={-1}>
          <Box sx={{ width: { xs: '100%', lg: 1 / 2 } }}>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom variant="body2" fontWeight={600} color="text.secondary">
                Nhận phòng
              </Typography>
              <TextField
                InputProps={{ readOnly: true }}
                disabled={disabled}
                fullWidth
                size={'small'}
                value={
                  value && value.startDate
                    ? dayjs(value.startDate).format('DD/MM/YYYY')
                    : 'dd/mm/yyyy'
                }
              />
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', lg: 1 / 2 } }}>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom variant="body2" fontWeight={600} color="text.secondary">
                Trả phòng
              </Typography>
              <TextField
                InputProps={{ readOnly: true }}
                fullWidth
                disabled={disabled}
                size={'small'}
                value={
                  value && value.endDate ? dayjs(value.endDate).format('DD/MM/YYYY') : 'dd/mm/yyyy'
                }
              />
            </Box>
          </Box>
        </Stack>
      }
      range
      numberOfMonths={2}
      showOtherDays
    />
  )
}
