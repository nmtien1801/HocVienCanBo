import { ApiManager } from "./ApiManager";

const ApiNews = {
    getNewsAllApi: (status, key, page, limit) => ApiManager.get(`/news/get-news-all?status=${status}&key=${key}&page=${page}&limit=${limit}`),
    getNewsByIDApi: (newsID) => ApiManager.get(`/news/get-news-by-newsid?newsID=${newsID}`),
    getNewsOtherApi: (newsID, page, limit) => ApiManager.get(`/news/get-news-other?newsID=${newsID}&page=${page}&limit=${limit}`),
}

export default ApiNews;
