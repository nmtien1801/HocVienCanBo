import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Save, Trash2, RotateCcw } from 'lucide-react';
import CKEditorField from '../../components/FormFields/CKEditor/CkEditorField';
import UploadField from '../../components/FormFields/UploadField';
import ApiNews from '../../apis/ApiNews' 
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom';

const tailwindInputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm";

export default function FormNotification() {
    const [searchParams] = useSearchParams();
    const idUpdate = searchParams.get('id');

    // 1. Xác định chế độ chỉnh sửa dựa trên ID
    const isEditMode = !!idUpdate;
    const [notificationId] = useState(idUpdate);

    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        defaultValues: {
            Title: '',
            status: true,
            ShortDescription: '',
            Description: '',
            ImagesPath: '',
            NewsID: notificationId || null,
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    // 2. Tải dữ liệu cũ nếu là chế độ chỉnh sửa
    useEffect(() => {
        if (isEditMode && notificationId) {
            fetchNotificationDetails(notificationId);
        }
    }, [notificationId, isEditMode]); 

    const fetchNotificationDetails = async (id) => {
        setIsLoading(true);
        try {
            const res = await ApiNews.getNewsByIDApi(id);
            if (res && res.data) {
                const data = res.data;
                setValue('Title', data.Title || '');
                setValue('status', data.StatusID === 1);
                setValue('ShortDescription', data.ShortDescription || '');
                setValue('Description', data.Description || '');
                setValue('ImagesPath', data.ImagesPath || '');
                setValue('NewsID', data.NewsID);
            } else {
                toast.error("Không tìm thấy thông báo hoặc lỗi tải dữ liệu.");
            }
        } catch (error) {
            console.error('Error fetching detail:', error);
            toast.error("Lỗi khi tải chi tiết thông báo.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Xử lý Form: Thêm mới hoặc Cập nhật
    const handleFormSubmit = handleSubmit(async (formValues) => {
        setIsLoading(true);
        try {
            // Kiểm tra validate cơ bản
            if (!formValues.Title.trim()) {
                toast.error('Vui lòng nhập tiêu đề');
                setIsLoading(false);
                return;
            }
            if (!formValues.ShortDescription.trim()) {
                toast.error('Vui lòng nhập mô tả ngắn');
                setIsLoading(false);
                return;
            }
            const content = formValues.Description.replace(/<[^>]*>/g, '').trim();
            if (!content) {
                toast.error('Vui lòng nhập nội dung');
                setIsLoading(false);
                return;
            }

            const apiPayload = {
                ...formValues,
                StatusID: formValues.status ? 1 : 0,
                ...(isEditMode && { NewsID: notificationId }),
            };

            let res;
            if (isEditMode) {
                // HÀM CẬP NHẬT
                res = await ApiNews.UpdateNewsApi(apiPayload);

                if (res && !res.message) {
                    toast.success(`Cập nhật thông báo thành công!`);
                } else {
                    toast.error(res.message);
                }
            } else {
                // HÀM THÊM MỚI
                res = await ApiNews.CreateNewsApi(apiPayload);

                if (res && !res.message) {
                    toast.success(`Thêm mới thông báo thành công!`);
                    reset();
                } else {
                    toast.error(res.message);
                }
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error(`Lỗi hệ thống khi ${isEditMode ? 'cập nhật' : 'tạo'} thông báo`);
        } finally {
            setIsLoading(false);
        }
    });

    // 4. Xử lý Xóa 
    const handleDelete = async () => {
        if (!isEditMode || !notificationId) return;

        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            setIsLoading(true);
            try {
                const res = await ApiNews.DeleteNewsApi(getValues());

                if (res && !res.message) {
                    toast.success(`Xóa thông báo thành công!`);
                    window.history.back(); // Quay về danh sách
                } else {
                    toast.error(res.message);
                }

            } catch (error) {
                console.error('Error deleting:', error);
                toast.error('Lỗi khi xóa thông báo.');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <h1 className="text-xl md:text-2xl text-gray-600">
                    {isEditMode ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
                </h1>

                {/* Main Content */}
                <div className="max-w-8xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 space-y-6">

                            {/* 1. Tiêu đề */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <label className="col-span-12 md:col-span-2 text-sm font-medium text-gray-700 md:pt-2.5">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-12 md:col-span-10">
                                    <Controller
                                        name="Title"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                className={tailwindInputClasses}
                                                placeholder="Nhập tiêu đề thông báo"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 2. Trạng thái - Checkbox */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <label className="col-span-12 md:col-span-2 text-sm font-medium text-gray-700 md:pt-2">
                                    Trạng thái
                                </label>
                                <div className="col-span-12 md:col-span-10">
                                    <div className="flex items-center h-full pt-1">
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    id="status-checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            )}
                                        />
                                        <label htmlFor="status-checkbox" className="ml-2 text-sm font-medium text-gray-700">
                                            Hiển thị
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Hình ảnh */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <label className="col-span-12 md:col-span-2 text-sm font-medium text-gray-700 md:pt-2.5">
                                    Hình ảnh
                                </label>
                                <div className="col-span-12 md:col-span-3">
                                    <UploadField
                                        name="ImagesPath"
                                        control={control}
                                        label="Chọn hình ảnh"
                                    />
                                </div>
                            </div>

                            {/* 4. Mô tả ngắn */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <label className="col-span-12 md:col-span-2 text-sm font-medium text-gray-700 md:pt-2.5">
                                    Mô tả ngắn <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-12 md:col-span-10">
                                    <Controller
                                        name="ShortDescription"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                rows={3}
                                                className={tailwindInputClasses + " resize-none"}
                                                placeholder="Nhập mô tả ngắn"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 5. Mô tả chi tiết */}
                            <div className="grid grid-cols-12 gap-6 items-start">
                                <label className="col-span-12 md:col-span-2 text-sm font-medium text-gray-700 md:pt-2.5">
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-12 md:col-span-10">
                                    <CKEditorField
                                        name="Description"
                                        control={control}
                                        label=""
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons*/}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">

                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleFormSubmit}
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {isEditMode ? 'Lưu lại' : 'Thêm mới'}
                            </button>

                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                disabled={isLoading}
                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Trở về danh sách
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
                    Copyright © 2023 by G&BSoft
                </footer>
            </div>
        </div>
    );
}