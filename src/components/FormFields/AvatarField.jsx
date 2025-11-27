import { Avatar, Box, FormControl, FormHelperText } from '@mui/material'
import { uploadApi } from 'api/uploadApi'
import { useSnackbar } from 'notistack'
import { useController } from 'react-hook-form'

export function AvatarField({
  children,
  name,
  control,
  disabled,
  type = 'thumbnail',
  hotelId = 1,
  onUploadChange,
  ...props
}) {
  const { enqueueSnackbar } = useSnackbar()

  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  async function handleChange(e) {
    const file = e.target.files[0]

    if (!file) {
      enqueueSnackbar('Please select a file', {
        variant: 'error',
      })
      return
    }

    const formData = new FormData()

    formData.append('myFiles', file)

    try {
      const res = await uploadApi.uploadFile(type, formData)

      if (res) {
        onChange(res.nameImages)
        onUploadChange?.(res.nameImages)
      }
    } catch (error) {
      console.error(`${error}`)
    }
  }

  return (
    <FormControl component="label" fullWidth error={invalid} sx={{ height: '100%' }}>
      <Avatar
        sx={{
          width: '100%',
          height: '100%',
          border: '10px solid #ffff',
          boxShadow: (theme) => theme.shadows[10],
        }}
        alt="avatar"
        src={`${process.env.REACT_APP_API_URL}/api/file/${value}`}
      />

      <Box
        component="input"
        disabled={disabled}
        onChange={handleChange}
        type="file"
        sx={{ display: 'none' }}
      />
      {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  )
}
