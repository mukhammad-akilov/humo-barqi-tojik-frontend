import { v4 as uuidv4 } from 'uuid';
import hmacSHA256 from 'crypto-js/hmac-sha256';

interface apiConfig {
    title: string;
    callback: () => void;
}

const httpsService = (apiConfig: apiConfig, url: string, title: string, func: () => void) => {
    try {
        console.log("Testing");
    } catch (error) {
        throw error;
    }
};

export default httpsService;