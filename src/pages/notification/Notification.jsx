import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ListInformation } from "../../redux/dashboardSlice.js";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { formatToISODate } from "../../utils/constants.js";

export default function Notification() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { listInformation } = useSelector((state) => state.dashboard);
    console.log('ssssssssss', listInformation);
    useEffect(() => {
        const fetchListInformation = async () => {
            let res = await dispatch(ListInformation());
            if (!res.payload) {
                toast.error(res.payload?.message);
            }
        };

        fetchListInformation();
    }, [dispatch]);

    const notifications = listInformation?.map(item => ({
        NewsID: item.NewsID,
        image: item.ImagesPath,
        title: item.Title,
        content: item.ShortDescription,
        date: formatToISODate(item.DateCreated),
    })) || [];

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Second Row - 2 columns */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Thông báo */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-normal text-gray-600">Thông báo</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {notifications.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className={`flex-shrink-0 w-24 h-14 flex items-center justify-center text-white text-[11px] font-bold rounded`}>
                                        <img
                                            src={item.image}
                                            alt="Thông báo"
                                            className="w-full h-full object-cover rounded cursor-pointer"
                                            onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm mb-1 cursor-pointer" onClick={() => navigate(`/notification-detail?id=${item.NewsID}`)}>{item.title}</h3>
                                        <p className="text-xs text-gray-500 italic leading-relaxed">Ngày: {item.date}</p>
                                        <p className="text-xs text-gray-500 italic leading-relaxed">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-right text-xs text-gray-500">
                    Copyright © 2023 by G&BSoft
                </div>
            </div>
        </div>
    );
}