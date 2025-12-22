import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNewsByID, getNewsOther } from "../../redux/newSlice.js";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import ImageLoader from "../../components/ImageLoader.jsx";

export default function NotificationDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newDetail, setNewDetail] = useState(null);
    const { newsListOther } = useSelector((state) => state.news);

    useEffect(() => {
        const fetchNewsByID = async () => {
            const idNewDetail = searchParams.get('id');
            let res = await dispatch(getNewsByID({ newsID: idNewDetail }));

            setNewDetail(res.payload.data);
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        const fetchNewsOther = async () => {
            const idNewDetail = searchParams.get('id');
            let res = await dispatch(getNewsOther({ newsID: idNewDetail }));
            if (!res.payload || !res.payload.data) {
                toast.error(res.payload?.message);
            }
        };

        fetchNewsByID();
        fetchNewsOther();
    }, [dispatch, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-0xl mx-auto">
                {/* Second Row - 2 columns */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Thông báo */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-center font-bold">
                            <h2 className="text-lg font-normal text-gray-600 text-red-500 ">Thông báo sử dụng website tra cứu thông tin mới</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-500 text-sm mb-3" >{newDetail?.ShortDescription}</h3>
                                    <div
                                        className="text-xs text-gray-500 italic leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: newDetail?.Description }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông báo khác */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Thông báo khác</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {newsListOther.map((item, index) => {
                                const isLast = index === newsListOther.length - 1;

                                return (
                                    <div
                                        key={index}
                                        className={`flex gap-4 ${!isLast ? 'border-b border-dashed border-gray-400 pb-4 mb-4' : 'pb-2'} `}
                                    >
                                        <div className={`flex-shrink-0 w-24 h-14 flex items-center justify-center text-white text-[11px] font-bold rounded`}>
                                            <ImageLoader
                                                imagePath={item.ImagesPath || ''}
                                                alt="Thông báo"
                                                className="w-full h-full object-cover rounded cursor-pointer"
                                                onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm mb-1 cursor-pointer" onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}>{item.Title}</h3>
                                            <p className="text-xs text-gray-500 italic leading-relaxed">{item.ShortDescription}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-right text-xs text-gray-500">
                    Copyright © 2025 by G&BSoft
                </div>
            </div>
        </div>
    );
}