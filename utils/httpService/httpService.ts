import { v4 as uuidv4 } from 'uuid';
import hmacSHA256 from 'crypto-js/hmac-sha256';

interface IApiConfigHeaders {
    [key: string]: string
}

export interface IApiConfig {
    method: string;
    headers: IApiConfigHeaders;
    url: string;
    hashKey: string;
    uuid: string;
    title: string;
    func: () => void;
}


const generateHashSum = (title: string, uuid: string, hashKey: string): string => {
    console.log(title, uuid, hashKey);
    const hashSum = hmacSHA256(`${title}${uuid}`, hashKey).toString();
    console.log("Hash sum", hashSum);
    return hashSum;
};


const httpsService = async <T>(apiConfig: IApiConfig): Promise<T | undefined> => {
    try {
        // Set custom headers
        apiConfig.headers.uuid = apiConfig.uuid;
        apiConfig.headers.version = "1.0.0";
        // apiConfig.headers.platform = "BARKI_TOJIK";
        apiConfig.headers.platform = "WEB-HUMO.TJ";
        apiConfig.headers.hash_sum = generateHashSum(apiConfig.title, apiConfig.uuid, apiConfig.hashKey);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiConfig.url}`, {"method": apiConfig.method, "headers": apiConfig.headers});
        return undefined;
    } catch (error) {
        console.log(error);
    }
    
};

export default httpsService;