import React, { useEffect, useRef, useState } from "react";
import { Box, FormControl, FormHelperText, Stack } from '@mui/material'
import ApiDashboard from '../../apis/ApiDashboard'
import { useController } from 'react-hook-form'
import { toast } from 'react-toastify'

// import { getImageLink } from 'utils/common'
const getImageLink = (path) => {
  if (!path) return ''
  return process.env.REACT_APP_API_URL + '/api/file/' + path
}

export default function UploadField({
  children,
  name,
  control,
  type = 'thumbnail',
  sx,
  disabled = false,
  onUploadChange,
  ...props
}) {
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
      toast.error('Please select a file')
      return
    }

    // if (file.size > 300 * 1024) {
    //   toast.error('File size must be less than 200KB')
    //   return
    // }

    const formData = new FormData()

    formData.append('myFiles', file)

    try {
      const res = await ApiDashboard.uploadApi.uploadFile(formData)

      if (res) {
        onChange(res.nameImages)
        onUploadChange?.(res.nameImages)
      }
    } catch (error) {
      console.error(`${error}`)
    }
  }

  return (
    <Box component="label" {...props}>
      <FormControl fullWidth error={invalid} sx={{ height: '100%', width: '100%', ...sx }}>
        {children ? (
          children
        ) : (
          <Box>
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                aspectRatio: '1/1',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <Box
                component="img"
                width="100%"
                height="100%"
                src={value ? getImageLink(value) : '/bg-main.jpg'}
                alt="img"
                sx={{ objectFit: 'cover' }}
              />
            </Stack>
          </Box>
        )}

        <Box
          component="input"
          disabled={disabled}
          onChange={handleChange}
          type="file"
          sx={{ display: 'none' }}
        />
      </FormControl>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  )
}
