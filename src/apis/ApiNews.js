import { ApiManager } from "./ApiManager";

const ApiNews = {
    getNewsAllApi: (status, key, page, limit) => ApiManager.get(`/news/get-news-all?status=${status}&key=${key}&page=${page}&limit=${limit}`),
    getNewsByIDApi: (newsID) => ApiManager.get(`/news/get-news-by-newsid?newsID=${newsID}`),
    getNewsOtherApi: (newsID, page, limit) => ApiManager.get(`/news/get-news-other?newsID=${newsID}&page=${page}&limit=${limit}`),
    CreateNewsApi: (model) => ApiManager.post(`/news/create-news`, model),
    DeleteNewsApi: (model) => ApiManager.post(`/news/delete-news`, model),
    UpdateNewsApi: (model) => ApiManager.post(`/news/update-news`, model),
}

export default ApiNews;
