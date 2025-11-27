import { CKEditor } from '@ckeditor/ckeditor5-react'
import { FormControl, FormHelperText, Typography } from '@mui/material'
import { DecoupledEditor } from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import React, { useEffect, useRef, useState } from "react";
import { useController } from 'react-hook-form'
import './CKEditor.css'
import { editorConfig } from './editorConfig'
import ApiDashboard from '../../../apis/ApiDashboard'

const getImageLink = (path) => {
  if (!path) return ''
  return process.env.REACT_APP_API_URL + '/api/file/' + path
}
export default function CKEditorField({
  name,
  control,
  hotelId = 1,
  type = 'thumbnail',
  label,
  disabled = false,
  onChange,
}) {
  const editorContainerRef = useRef(null)
  const editorMenuBarRef = useRef(null)
  const editorToolbarRef = useRef(null)
  const editorRef = useRef(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)

  const {
    field: { value, onChange: controllerOnChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file
            .then((file) => {
              const formData = new FormData()

              formData.append('myFiles', file)

              ApiDashboard.uploadApi
                .uploadFile(formData)
                .then((res) => {
                  if (res) {
                    resolve({
                      default: getImageLink(res.nameImages),
                    })
                  }
                })
                .catch(reject)
            })
            .catch(reject)
        })
      },
    }
  }

  function uploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader)
    }
  }

  return (
    <FormControl fullWidth size="medium" error={invalid}>
      {label && (
        <Typography gutterBottom variant="body2" fontWeight={600} color="text.secondary">
          {label}
        </Typography>
      )}

      <div className="main-container">
        <div
          className="editor-container editor-container_document-editor editor-container_include-style"
          ref={editorContainerRef}
        >
          <div className="editor-container__menu-bar" ref={editorMenuBarRef} />

          <div className="editor-container__toolbar" ref={editorToolbarRef} />
          <div className="editor-container__editor-wrapper">
            <div className="editor-container__editor">
              <div ref={editorRef}>
                {isLayoutReady && (
                  <CKEditor
                    disabled={disabled}
                    onReady={(editor) => {
                      editorToolbarRef.current?.appendChild(editor.ui.view.toolbar.element)
                      editorMenuBarRef.current?.appendChild(editor.ui.view.menuBarView.element)
                    }}
                    onAfterDestroy={() => {
                      Array.from(editorToolbarRef.current?.children || []).forEach((child) =>
                        child.remove(),
                      )
                      Array.from(editorMenuBarRef.current?.children || []).forEach((child) =>
                        child.remove(),
                      )
                    }}
                    editor={DecoupledEditor}
                    config={{
                      ...editorConfig,
                      extraPlugins: [uploadAdapterPlugin],
                    }}
                    data={value}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      controllerOnChange(data)
                      onChange?.(data)
                    }}
                    onBlur={onBlur}
                    ref={ref}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {invalid && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  )
}
