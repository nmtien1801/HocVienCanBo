import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'

export function SearchBox({ placeholder, onSearchChange }) {
  const handleSearchChange = debounce((e) => {
    onSearchChange?.(e.target.value)
  }, 600)
  const { t } = useTranslation()
  return (
    <TextField
      sx={{
        mr: 1,
        width: '100%',
        minWidth: '300px',
      }}
      size="small"
      placeholder={placeholder || t('Search...')}
      onChange={handleSearchChange}
      slotProps={{
        input: {
          'aria-label': t('Search...'),
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
