import hmacSHA256 from 'crypto-js/hmac-sha256';
import {IApiConfig, IApiErrorResponse} from "../../interfaces/interfaces";

const generateHashSum = (title: string, uuid: string, hashKey: string): string => {
    const hashSum = hmacSHA256(`${title}${uuid}`, hashKey).toString();
    return hashSum;
};


const httpsService = async <T>(apiConfig: IApiConfig): Promise<T> => {
    try {
        // Set custom headers
        apiConfig.headers.uuid = apiConfig.uuid;
        apiConfig.headers.version = "1.0.0";
        apiConfig.headers.platform = "BARKI_TOJIK";
        apiConfig.headers.hash_sum = generateHashSum(apiConfig.title, apiConfig.uuid, apiConfig.hashKey);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${apiConfig.url}`, 
            {"method": apiConfig.method, "headers": apiConfig.headers, "body": apiConfig.body}
        );

        let isImage = false;
        let captchaUrl = "";
        let responseJson: T | undefined = undefined;
        // let responseJson: T;


        if(response.headers.get("Content-Type") === "image/png") {
            const blobFile = await response.blob();
            captchaUrl = window.URL.createObjectURL(blobFile);
            isImage = true;
        } else {
            responseJson = await response.json();
        }
        
        if(response.ok) {
            if(responseJson) {
                return responseJson;
            } else {
                const error = {
                    message: "Ошибка во время получения данных",
                };
                throw error;
            }
            // return responseJson;
            // if(responseJson) {
            //     return responseJson;
            // }
        } else {
            const error = {
                message: "Возникла ошибка во время запроса на сервер",
                apiResponseStatusCode: response.status,
                apiResponse: isImage ? captchaUrl : responseJson,
            };

            throw error;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
    
};

export default httpsService;