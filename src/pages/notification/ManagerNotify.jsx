import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form'
import { Backdrop, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import CkEditorField from '../../components/CKEditor/CkEditorField'

// import { UploadField } from '../../components/FormFields/UploadField'

export const activeOptionList = [
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

export const languageOptions = [
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
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: null,
      titleByLanguageId: '',
      isActive: 1,
      shortDescriptionByLanguageId: '',
      descriptionByLanguageId: '',
      imagePath: '',
      author,
      departmentId: null,
      languageId: data?.languageId ?? languageOptions[0].value,
    },
  })

  useEffect(() => {
    const languageIdToMap = data?.languageId ?? languageOptions[0].value

    if (!data) {
      setValue('languageId', languageIdToMap)
      return
    }

    const detail = data.newsDetails?.find((x) => x.languagesId === languageIdToMap)
    const dataByLanguageId = {
      titleByLanguageId: detail?.title || '',
      shortDescriptionByLanguageId: detail?.shortDescription || '',
      descriptionByLanguageId: detail?.description || '',
      languageId: languageIdToMap,
    }

    reset({
      ...data,
      ...data.newsDetails?.[0],
      isActive: data.isActive ? 1 : 0,
      ...dataByLanguageId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleFormSubmit = handleSubmit((formValues) => {
    const detail = {
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

  const disabled = loading

  return (
    <CkEditorField />
  )
}
