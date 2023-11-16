import RequestService from "./requestService"
import {URL_API} from "@/constants/common";

const baseUrl = URL_API + "/test"

export default {
    get(url: string) {
        return RequestService.get(`${baseUrl}${url}`)
    }
}