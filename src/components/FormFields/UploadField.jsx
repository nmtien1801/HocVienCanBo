import React, { useEffect, useRef, useState } from "react";
import { Box, FormControl, FormHelperText, Stack } from '@mui/material'
import ApiDashboard from '../../apis/ApiDashboard'
import { useController } from 'react-hook-form'
import { toast } from 'react-toastify'

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
      toast.error('Vui lòng chọn một tệp hình ảnh hợp lệ.')
      return
    }

    const MAX_FILE_SIZE = 200 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Kích thước tệp phải nhỏ hơn 200KB.')
      return
    }

    const formData = new FormData()

    formData.append('myFiles', file)

    try {
      const res = await ApiDashboard.uploadApi.uploadFile(formData)

      // Giả định API trả về đối tượng { nameImages: 'path/to/image.jpg' }
      if (res && res.nameImages) {
        onChange(res.nameImages)
        onUploadChange?.(res.nameImages)
        toast.success('Tải tệp lên thành công!')
      } else {
        toast.error('Tải tệp lên thất bại, không nhận được đường dẫn tệp.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Lỗi khi tải tệp lên server.')
    }
  }

  return (
    <Box component="label" htmlFor={`upload-input-${name}`} {...props}>
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
                // Thêm viền để dễ nhìn khi chưa có ảnh
                border: value ? 'none' : '2px dashed #ccc',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                width="100%"
                height="100%"
                src={value ? getImageLink(value) : '/bg-main.jpg'}
                alt="img"
                sx={{
                  objectFit: 'cover',
                  display: value ? 'block' : 'none' // Ẩn img nếu chưa có value để thấy border dashed
                }}
              />
              {/* Hiển thị placeholder nếu chưa có ảnh */}
              {!value && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: '100%', height: '100%', color: 'gray' }}
                >
                  Chọn ảnh
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        {/* Thẻ input ẩn để kích hoạt hộp thoại chọn tệp */}
        <Box
          component="input"
          id={`upload-input-${name}`}
          disabled={disabled}
          onChange={handleChange}
          type="file"
          accept="image/*" // Chỉ chấp nhận tệp hình ảnh
          sx={{ display: 'none' }}
        />
      </FormControl>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  )
}