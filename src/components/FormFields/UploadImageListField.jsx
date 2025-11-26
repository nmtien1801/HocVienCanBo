import { Close } from '@mui/icons-material'
import { Box, FormControl, FormHelperText, IconButton, Stack } from '@mui/material'
import { uploadApi } from 'api/uploadApi'
import uploadImg from 'assets/images/upload.png'
import { useEffect, useState } from 'react'
import { useController } from 'react-hook-form'
import { toast } from 'react-toastify'

export function UploadImageListField({
  children,
  name,
  control,
  type = 'thumbnail',
  sx,
  disabled = false,
  onUploadChange,
  ...props
}) {
  const [imageList, setImageList] = useState([])

  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setImageList(
        value.map((item) => ({
          imagePath: item.imagePath,
          nameImage: item.nameImage,
          // isActive: item.isActive,
          extension: item.extension,
        })),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  async function handleChange(e) {
    const file = e.target.files[0]

    if (!file) {
      toast.error('Please select a file', {
        variant: 'error',
      })
      return
    }

    const formData = new FormData()

    formData.append('myFiles', file)

    try {
      const res = await uploadApi.uploadFile(formData)

      if (res) {
        if (imageList.length === 5) {
          toast.error('Số lượng hình vượt quá 5', {
            variant: 'error',
          })
          return
        }

        const newImageList = [
          ...imageList,
          {
            imagePath: res.imagePath,
            nameImage: res.nameImages,
            // isActive: res.isActive,
            extension: res.extension,
          },
        ]

        setImageList(newImageList)

        onChange(newImageList)
        onUploadChange?.(newImageList)
      }
    } catch (error) {
      console.error(`${error}`)
    }
  }

  const newDisabled = Boolean(imageList.length === 5) || disabled
  function handleRemove(path) {
    let newImageList = [...imageList]
    const idx = newImageList.findIndex((item) => item.nameImage === path)

    if (idx !== -1) {
      newImageList.splice(idx, 1)
      setImageList(newImageList)
      onChange(newImageList)
    }
  }

  return (
    <Box>
      <Box {...props} sx={sx}>
        <FormControl fullWidth error={invalid}>
          <Stack direction="row" spacing={2}>
            {Array.isArray(imageList) &&
              imageList.length > 0 &&
              imageList.map((item, idx) => (
                <Box key={idx}>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      position: 'relative',
                      width: 120,
                      aspectRatio: '1/1',
                      borderRadius: '4px',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      width="100%"
                      height="100%"
                      src={
                        `${process.env.REACT_APP_API_URL}/api/file/${item.nameImage}` || uploadImg
                      }
                      alt="img"
                      sx={{ objectFit: 'cover' }}
                    />

                    <IconButton
                      color="inherit"
                      disabled={disabled}
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(item.nameImage)
                      }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        zIndex: 1,
                        p: 0.25,
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Stack>
                </Box>
              ))}

            <Box component="label">
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: 120,
                  aspectRatio: '1/1',
                  borderRadius: '4px',
                  cursor: newDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <Box
                  component="img"
                  width="100%"
                  height="100%"
                  src={uploadImg}
                  alt="img"
                  sx={{ objectFit: 'cover' }}
                />

                <Box
                  component="input"
                  disabled={newDisabled}
                  onChange={handleChange}
                  type="file"
                  sx={{ display: 'none' }}
                />
              </Stack>
            </Box>
          </Stack>
        </FormControl>
        {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
      </Box>
    </Box>
  )
}
