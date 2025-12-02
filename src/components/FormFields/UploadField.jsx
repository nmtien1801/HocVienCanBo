import React, { useState } from "react";
import { Box, FormControl, FormHelperText, Stack, CircularProgress, Typography } from '@mui/material';
import ApiDashboard from '../../apis/ApiDashboard';
import { useController } from 'react-hook-form';
import { toast } from 'react-toastify';
import ImageLoader from "../../components/ImageLoader.jsx"; // Giữ nguyên import này

// Kích thước tệp tối đa (200KB)
const MAX_FILE_SIZE = 200 * 1024; 

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
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleChange(e) {
    const file = e.target.files?.[0]; 

    if (!file) {
      // Trường hợp người dùng mở hộp thoại nhưng không chọn tệp nào
      // Không cần thông báo lỗi, chỉ cần return
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Kích thước tệp phải nhỏ hơn ${MAX_FILE_SIZE / 1024}KB.`);
      // Xóa tệp khỏi input để cho phép chọn lại
      e.target.value = null; 
      return;
    }

    // Kiểm tra loại tệp (tùy chọn)
    if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn một tệp hình ảnh hợp lệ.');
        e.target.value = null; 
        return;
    }

    const formData = new FormData();
    formData.append('myFiles', file);

    setIsLoading(true);

    try {
      const res = await ApiDashboard.uploadApi.uploadFile(formData);

      if (res && res.nameImages) {
        onChange(res.nameImages);
        onUploadChange?.(res.nameImages);
        toast.success('Tải tệp lên thành công!');
      } else {
        toast.error('Tải tệp lên thất bại, không nhận được đường dẫn tệp.');
      }
    } catch (apiError) {
      console.error('Upload error:', apiError);
      toast.error('Lỗi khi tải tệp lên server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false); 
      e.target.value = null;
    }
  }

  const isInputDisabled = disabled || isLoading;

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
                cursor: isInputDisabled ? 'not-allowed' : 'pointer',
                border: value ? 'none' : '2px dashed #ccc',
                overflow: 'hidden',
                position: 'relative',
                opacity: isLoading ? 0.7 : 1, // Làm mờ khi đang tải
              }}
            >
              <ImageLoader
                imagePath={value || ''}
                alt={`Ảnh: ${value}`}
                className="w-full h-full object-cover rounded mx-auto border border-gray-200"
              />
              
              {/* Hiển thị placeholder nếu chưa có ảnh */}
              {!value && !isLoading && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    color: 'gray',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <Typography variant="body2">Chọn ảnh</Typography>
                </Stack>
              )}

              {/* Hiển thị trạng thái tải lên */}
              {isLoading && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 10,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="caption" sx={{ mt: 1 }}>Đang tải...</Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        {/* Thẻ input ẩn để kích hoạt hộp thoại chọn tệp */}
        <Box
          component="input"
          id={`upload-input-${name}`}
          disabled={isInputDisabled} // Sử dụng trạng thái kết hợp
          onChange={handleChange}
          type="file"
          accept="image/*" // Chỉ chấp nhận tệp hình ảnh
          sx={{ display: 'none' }}
        />
      </FormControl>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  );
}