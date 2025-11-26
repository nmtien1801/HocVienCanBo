import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form'
import { Backdrop, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { CKEditorField } from '../../components/CKEditor/CkEditorField'
import { InputField } from '../../components/FormFields/InputField'
import { SelectField } from '../../components/FormFields/SelectField'
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
    <form className="space-y-6" onSubmit={handleFormSubmit} noValidate>
      {/* Thông tin chung */}
      <div className="bg-white shadow rounded p-4">
        <h6 className="font-semibold text-lg mb-4">Thông tin chung</h6>
        <div className="flex flex-wrap gap-4">
          {/* Language */}
          <div className="w-full lg:w-1/3">
            <SelectField
              name="languageId"
              label="Ngôn ngữ"
              control={control}
              optionList={languageOptions}
              onFieldChange={(value) => handleFetchData(value)}
              disabled={disabled}
            />
          </div>

          {/* Category */}
          <div className="w-full lg:w-1/3">
            <SelectField
              control={control}
              name="categoryId"
              label="Loại tin"
              optionList={[
                { label: '--- Chọn loại tin ---', value: null },
                ...(categoryList?.map((item) => ({
                  label: item?.categoryDetails?.[0]?.nameCategory,
                  value: item.categoryId,
                })) ?? []),
              ]}
              disabled={disabled}
            />
          </div>

          {/* Title */}
          <div className="w-full lg:w-2/3">
            <InputField
              control={control}
              name="titleByLanguageId"
              label="Tên chuyên mục"
              disabled={disabled}
              required
            />
            {errors.titleByLanguageId && (
              <p className="text-red-500 text-sm mt-1">{errors.titleByLanguageId.message}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="w-full lg:w-1/3">
            <SelectField
              control={control}
              name="isActive"
              label="Trạng thái"
              optionList={activeOptionList}
              disabled={disabled}
            />
          </div>

          {/* Short Description */}
          <div className="w-full">
            <InputField
              control={control}
              name="shortDescriptionByLanguageId"
              label="Mô tả"
              multiline
              rows={4}
              disabled={disabled}
              required
            />
            {errors.shortDescriptionByLanguageId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shortDescriptionByLanguageId.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hình ảnh */}
      <div className="bg-white shadow rounded p-4">
        <h6 className="font-semibold text-lg mb-4">Hình ảnh</h6>
        <div className="flex gap-4 items-start">
          <div className="w-36">
            {/* <UploadField
              control={control}
              name="imagePath"
              label="Hình ảnh thumbnail"
              disabled={disabled}
            /> */}
          </div>
        </div>
      </div>

      {/* Nội dung CKEditor */}
      <div className="bg-white shadow rounded p-4">
        <CKEditorField
          name="descriptionByLanguageId"
          control={control}
          label="Nội dung bản tin"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="px-4 py-2 border rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          disabled={disabled}
        >
          Đóng
        </button>

        {data && updatePermission ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={disabled}
          >
            Cập nhật
          </button>
        ) : !data && insertPermission ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={disabled}
          >
            Tạo
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
            disabled
          >
            {data ? 'Cập nhật' : 'Tạo'}
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </form>
  )
}
