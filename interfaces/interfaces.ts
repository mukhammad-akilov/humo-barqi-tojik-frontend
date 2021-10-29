 // Humo Intiqol
 interface Default {
    card_type: string;
    amount_label: string;
    cur_iso: string;
    from_cur_iso: string;
    to_cur_iso: string;
    buy: number;
    sell: number;
    fixed_fee: number;
    fixed_amount: number;
    percentage: number;
    take_both: boolean;
    min_sum: number;
    max_sum: number;
}

 interface WithPrefix {
    card_type: string;
    amount_label: string;
    cur_iso: string;
    from_cur_iso: string;
    to_cur_iso: string;
    buy: number;
    sell: number;
    fixed_fee: number;
    fixed_amount: number;
    percentage: number;
    take_both: boolean;
    min_sum: number;
    max_sum: number;
    receiver_card_reg_exp: string;
}

export interface IKortiMilliResponse {
    default: Default[];
    with_prefix: WithPrefix[];
}

// Barki Tojik services list
interface IBarkiTojikServicesList {
    service_id: number;
    service_name: string;
    image_name: string;
    has_pre_check: boolean;
    fee: number;
}

export interface IBarkiTojikReposnse {
    default_index: number;
    services_list: IBarkiTojikServicesList[];
}

// Fetch API configs
interface IApiConfigHeaders {
    [key: string]: string
}


export interface IApiConfig {
    method: string;
    headers: IApiConfigHeaders;
    url: string;
    body?: BodyInit;
    hashKey: string;
    uuid: string;
    title: string;
    func: () => void;
}

export interface IApiConfigBody {
    [key: string]: string | number | undefined
}

// Service precheck
export interface IServicePreCheckResponse {
    info: {
        surname: string;
        address: string;
        balance: string;
        date?: string;
        info?: string;
    };
}

// Service info
export interface IServiceInfoInfo {
    amount_label: string;
    buy: number;
    card_type: string;
    cur_iso: string;
    fixed_amount: number;
    fixed_fee: number;
    from_cur_iso: string;
    max_sum: number;
    min_sum: number;
    percentage: number;
    sell: number;
    take_both: boolean;
    to_cur_iso: string;
}

export interface IServiceInfoField {
    id: number;
    vendor_service_id: number;
    decl_name_title: string;
    decl_name_tooltip: string;
    reg_exp: string;
    keyboard_type_name: string;
    sort_id: number;
    read_only: boolean;
    required: boolean;
    default_value: string;
}

export interface IServiceInfoResponse {
    info: IServiceInfoInfo[];
    fields: IServiceInfoField[];
    has_pre_check: boolean;
    service_name: string;
}

// Payment 
export interface IPaymentResponse {
    payment_url: string;
    reason: string,
    trans_id: number;
}