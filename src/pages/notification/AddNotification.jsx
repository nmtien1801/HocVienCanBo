import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import CKEditorField from '../../components/FormFields/CKEditor/CkEditorField';
import { InputField } from '../../components/FormFields/InputField';
import { SelectField } from '../../components/FormFields/SelectField';
import UploadField from '../../components/FormFields/UploadField';
import { useForm } from 'react-hook-form';

// Đã loại bỏ languageOptions

const activeOptionList = [
    {
        label: 'Hiển thị', // Đổi tên cho rõ ràng hơn
        value: 1,
    },
    {
        label: 'Ẩn', // Đổi tên cho rõ ràng hơn
        value: 0,
    },
];

export default function AddNotification() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // 💖 CẬP NHẬT: Loại bỏ languageId khỏi defaultValues
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            title: '',
            isActive: 1, // Mặc định là Hiển thị
            shortDescription: '',
            description: '',
            imagePath: '',
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = handleSubmit(async (formValues) => {
        setIsLoading(true);
        try {
            // Validate form (Logic giữ nguyên)
            if (!formValues.title.trim()) {
                toast.error('Vui lòng nhập tiêu đề');
                setIsLoading(false);
                return;
            }

            if (!formValues.shortDescription.trim()) {
                toast.error('Vui lòng nhập mô tả ngắn');
                setIsLoading(false);
                return;
            }

            if (!formValues.description.trim()) {
                toast.error('Vui lòng nhập nội dung');
                setIsLoading(false);
                return;
            }

            // TODO: Call API to create notification
            console.log('Form values:', formValues);
            
            toast.success('Tạo thông báo thành công');
            reset();
            navigate('/manager-notification');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Lỗi khi tạo thông báo');
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/manager-notification')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                        title="Quay lại"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">Thêm thông báo mới</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* General Information Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chung</h2>
                        
                        {/* 💖 CẬP NHẬT: Loại bỏ grid và trường Ngôn ngữ. Trạng thái chiếm 100% */}
                        <div className="mb-4"> 
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái (Ẩn/Hiện)</label>
                            <div className="w-full md:w-1/2"> {/* Giữ trạng thái ở cột phải nếu cần, hoặc 100% */}
                                <SelectField
                                    name="isActive"
                                    control={control}
                                    optionList={activeOptionList}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                            <InputField
                                name="title"
                                control={control}
                                placeholder="Nhập tiêu đề thông báo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn *</label>
                            <InputField
                                name="shortDescription"
                                control={control}
                                multiline
                                rows={3}
                                placeholder="Nhập mô tả ngắn"
                            />
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hình thumbnail</label>
                            <div className="w-full md:w-48">
                                <UploadField
                                    name="imagePath"
                                    control={control}
                                    label="Chọn hình ảnh"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Nội dung</h2>
                        
                        <CKEditorField
                            name="description"
                            control={control}
                            label="Nội dung thông báo *"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/manager-notification')}
                            disabled={isLoading}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            Tạo thông báo
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 text-right text-xs text-gray-500">
                    Copyright © 2023 by G&BSoft
                </div>
            </div>
        </div>
    );
}