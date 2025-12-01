// import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useRef, useState } from "react";
import { LoadingButton } from '@mui/lab'
import { Backdrop, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import CKEditorField from '../../components/FormFields/CKEditor/CkEditorField'
import { InputField } from '../../components/FormFields/InputField'
import { SelectField } from '../../components/FormFields/SelectField'
import UploadField from '../../components/FormFields/UploadField'
import { useForm } from 'react-hook-form'
// import * as yup from 'yup'

// const schema = yup.object({
//   titleByLanguageId: yup.string().required('Vui lòng nhập Tên bản tin!'),
//   shortDescriptionByLanguageId: yup.string().required('Vui lòng nhập mô tả loại tin tức!'),
// })
const languageOptions = [
  {
    value: 'vi-VN',
    label: (
      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        <Box
          component="img"
          sx={{
            width: 32,
            objectFit: 'cover',
            aspectRatio: '26/20',
          }}
          src={`https://flagpedia.net/data/flags/w702/vn.webp`}
          alt="vn"
        />
        <Typography>Vietnamese</Typography>
      </Stack>
    ),
  },
  {
    value: 'en-US',
    label: (
      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        <Box
          component="img"
          sx={{
            width: 32,
            objectFit: 'cover',
            aspectRatio: '26/20',
          }}
          src={`https://flagpedia.net/data/flags/w702/gb.webp`}
          alt="gb"
        />
        <Typography>English</Typography>
      </Stack>
    ),
  },
]

const activeOptionList = [
  {
    label: 'Hoạt động',
    value: 1,
    default: true,
  },
  {
    label: 'Ngừng hoạt động',
    value: 0,
  },
]

export default function ManagerNotify({
  author,
  data,
  categoryList,
  loading,
  onSubmit,
  onClose,
  updatePermission,
  insertPermission,
  handleFetchData,
}) {
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      categoryId: null,
      title: '',
      isActive: 1,
      shortDescription: '',
      description: '',
      imagePath: '',
      author,
      departmentId: null,
      languageId: data?.languageId ?? languageOptions[0].value,
    },
    // resolver: yupResolver(schema),
  })
  const disabled = loading

  useEffect(() => {
    let languageIdToMap = data?.languageId ?? languageOptions[0].value

    if (!data) {
      setValue('languageId', languageIdToMap)
      return
    }

    let detail = data.newsDetails?.find((x) => x.languagesId === languageIdToMap)
    let dataByLanguageId = {
      titleByLanguageId: detail?.title || '',
      shortDescriptionByLanguageId: detail?.shortDescription || '',
      descriptionByLanguageId: detail?.description || '',
      languageId: languageIdToMap,
    }

    if (data) {
      reset({
        ...data,
        ...data.newsDetails?.[0],
        isActive: data.isActive ? 1 : 0,
        ...dataByLanguageId,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleFormSubmit = handleSubmit((formValues) => {
    let detail = {
      title: formValues.titleByLanguageId,
      shortDescription: formValues.shortDescriptionByLanguageId,
      description: formValues.descriptionByLanguageId,
      languagesId: formValues.languageId,
    }

    const newValue = {
      categoryId: formValues.categoryId,
      imagePath: formValues.imagePath,
      departmentId: formValues.departmentId || null,
      restaurantId: 0,
      typeFoodId: 0,
      isActive: Boolean(formValues.isActive),

      order: 1,
      isHomepage: 1,
      isHot: 1,
      isLike: 1,
      isView: 1,
      isShare: 1,
      imageThumb: '.',
      imageBanner: '.',
      links: '.',

      newsDetail: {
        description1: '.',
        author: data?.author || author,
        linksDetail: '.',
        keyDescription: detail.title,
        keyWork: detail.title,
        ...detail,
      },
    }
    onSubmit?.(newValue)
  })

  return (
    <>
      <Stack spacing={3} component="form" noValidate onSubmit={handleFormSubmit}>
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Thông tin chung
          </Typography>

          <Paper sx={{ p: 2 }}>
            <Stack direction="row" flexWrap="wrap" alignItems="flex-start">
              <Box sx={{ width: { xs: '100%', lg: 1 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <SelectField
                    name="languageId"
                    label="Ngôn ngữ"
                    control={control}
                    optionList={languageOptions}
                    onFieldChange={(value) => handleFetchData(value)}
                  />
                </Box>
              </Box>

              {/* <Box sx={{ width: { xs: '100%', lg: 1 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <SelectField
                    control={control}
                    name="departmentId"
                    label="Bộ phận"
                    optionList={[
                      { label: '--- Chọn bộ phận (Tuyển dụng) ---', value: null },
                      ...(departmentList?.map((item) => ({
                        label: item.departmentName,
                        value: item.departmentId,
                      })) ?? []),
                    ]}
                  />
                </Box>
              </Box> */}

              <Box sx={{ width: { xs: '100%', lg: 1 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <SelectField
                    control={control}
                    name="categoryId"
                    label="Loại tin"
                    optionList={[
                      { label: '--- Chọn loại tin ---', value: null },
                      ...(categoryList?.map((item) => ({
                        label: item?.categoryDetails?.[0].nameCategory,
                        value: item.categoryId,
                      })) ?? []),
                    ]}
                  />
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', lg: 2 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <InputField
                    disabled={disabled}
                    control={control}
                    name="titleByLanguageId"
                    label="Tên chuyên mục"
                  />
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', lg: 1 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <SelectField
                    control={control}
                    name="isActive"
                    label="Trạng thái"
                    optionList={activeOptionList}
                  />
                </Box>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="flex-start">
              <Box sx={{ width: { xs: '100%', lg: 3 / 3 } }}>
                <Box sx={{ p: 1 }}>
                  <InputField
                    multiline
                    rows={4}
                    disabled={disabled}
                    control={control}
                    name="shortDescriptionByLanguageId"
                    label="Mô tả"
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Hình ảnh
          </Typography>

          <Paper sx={{ p: 2 }}>
            <Typography fontWeight={600} gutterBottom variant="body2" color="text.secondary">
              Hình thumbnail
            </Typography>
            <Box sx={{ width: 150 }}>
              <UploadField
                disabled={disabled}
                name="imagePath"
                control={control}
                label="Hình ảnh thumbnail"
              />
            </Box>
          </Paper>
        </Box>

        <Paper>
          <CKEditorField
            name="descriptionByLanguageId"
            control={control}
            label="Nội dung bản tin"
          />
        </Paper>

        <Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Box color="grey.500">
              <LoadingButton
                loading={loading}
                variant="outlined"
                color="inherit"
                disabled={disabled}
                onClick={() => onClose?.()}
              >
                Đóng
              </LoadingButton>
            </Box>

            <Box>
              {data && updatePermission ? (
                <LoadingButton type="submit" variant="contained" color="primary">
                  Cập nhật
                </LoadingButton>
              ) : !data && insertPermission ? (
                <LoadingButton type="submit" variant="contained" color="primary">
                  Tạo
                </LoadingButton>
              ) : (
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled
                >
                  {data ? 'Cập nhật' : 'Tạo'}
                </LoadingButton>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>
      <Backdrop
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          color: '#fff',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
