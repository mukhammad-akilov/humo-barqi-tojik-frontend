import React, { useEffect, useContext, useState} from 'react';
import { StoreContext } from '../../store/StoreContext';
import dynamic from 'next/dynamic'
import httpsService  from '../../utils/httpService/httpService';
import { normalizePhoneNumber } from '../../utils/utils';
import {IBarkiTojikReposnse, IServicePreCheckResponse, IApiConfig, 
    IServiceInfoInfo, IServiceInfoResponse, IPaymentResponse, IApiErrorResponse} from '../../interfaces/interfaces';
// Styles
import styles from './Home.module.scss';
import {Button, Container, Box, Select, SelectChangeEvent, MenuItem, Typography, Divider,
    FormControl, InputLabel, TextField, Skeleton, LinearProgress, Snackbar, InputAdornment, IconButton, Link} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor} from '@mui/material/Alert';

// Dynamic load input mask (non SSR)
const InputMask  = dynamic(
    () => import('../MaskedInput/MaskedInput'),
    { ssr: false }
  )
// Icons
import {Person,  Receipt, Home as HomeIcon, Help as HelpIcon, GraphicEq, Event} from '@mui/icons-material';

import VerifiedLogos from '../VerifiedLogos/VerifiedLogos';

// Modals
import ReceiptModal from './modals/ReceiptModal/ReceiptModal';

const SnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


const Home = () : JSX.Element => {
    const {store, setStore} = useContext(StoreContext);
     // Form validation
     const [notValidateField, setNotValidateField] = useState<{account: boolean, amount: boolean, phoneNumber: boolean}>({
        account: false,
        amount: false,
        phoneNumber: false,
    });
    // Account
    const [accountInfo, setAccountInfo] = useState<IServicePreCheckResponse>();
    const [account, setAccount] = useState<string>("");
    const [accountNotFound, setAccountNotFound] = useState<boolean>(false);
    // Service (Barki Tojik)
    const [selectedServiceId, setSelectedServiceId] = useState<number>();
    const [selectedSerivePaymentInfo, setSelectedServicePaymentInfo] = useState<IServiceInfoInfo>();
    const [selectedSerivePaymentInfoId, setSelectedServicePaymentInfoId] = useState<string>("");
    const [servicePaymentMethods, setServicePaymentMethods] = useState<Array<IServiceInfoInfo>>([]);
    const [barkiTojikList, setBarkiTojikList] = useState<IBarkiTojikReposnse>();
    // User input data
    const [amount, setAmount] = useState<string>("");
    const [userAgreement, setUserAgreement] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    // Loading
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingServiceInfo, setLoadingServiceInfo] = useState<boolean>(false);
    const [loadingPreCheck, setLoadingPreCheck] = useState<boolean>(false);
    const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
    // Tranfser pirce info
    const [transferFee, setTransferFee] = useState<number>(0);
    const [totalTransferPrice, setTotalTransferPrice] = useState<number>(0);

    // Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState<{open: boolean, type: AlertColor | undefined, message: string}>({
        open: false,
        type: "success",
        message: "",
    })
    // Modals
    const [openReceiptModal, setOpenReceiptModal] = useState<boolean>(false);

    const handleAmountChnage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const price = event.target.value.trim();
        const regex = /^(0{1}|([1-9]([0-9]+)?))(\.\d{1,2})?$/gim;
        const result = regex.test(price);
        if(result || (price.endsWith('.') && !price.startsWith(".") && price[price.lastIndexOf(".") - 1] !== ".") || price === "") {
            setAmount(price);
        }
    }

    const validateForm = (): boolean => {
        const validate = (Number(amount) <= 0 || loadingPayment || loadingPreCheck || account === "" || accountNotFound === true 
        || (selectedSerivePaymentInfoId === "WEB_KM" && (phoneNumber === "" || normalizePhoneNumber(phoneNumber).length !== 9)));
        return validate;
    }


    const phoneNumberFieldHelperText = (): string => {
        let helperText: string = "";

       if (notValidateField.phoneNumber && phoneNumber === "") {
            helperText = "Поле обязательно для заполнения";
       } else if (notValidateField.phoneNumber && normalizePhoneNumber(phoneNumber).length !== 9) {
            helperText = "Введите правильный номер телефона";
       } else {
           helperText = "";
       }

       return helperText;
    }

    const validateAmount = (amount: string) => {
        if(amount && parseFloat(amount) < selectedSerivePaymentInfo!.min_sum) {
            setSnackbarMessage({
                open: true,
                message: `Сумма должна быть не меньше ${selectedSerivePaymentInfo?.min_sum} ${selectedSerivePaymentInfo?.cur_iso}`,
                type: "error",
            });
            setAmount(selectedSerivePaymentInfo!.min_sum.toString());
        } else if (amount && parseFloat(amount) > selectedSerivePaymentInfo!.max_sum) {
            setSnackbarMessage({
                open: true,
                message: `Сумма должна быть не меньше ${selectedSerivePaymentInfo?.max_sum} ${selectedSerivePaymentInfo?.cur_iso}`,
                type: "error",
            });
            setAmount(selectedSerivePaymentInfo!.max_sum.toString());
        }
    }

    const calcTransferTotalPrice = () => {
        let fee: number | null = null;
        if(selectedSerivePaymentInfo?.take_both) {
            fee = ((Number(amount) / 100) * selectedSerivePaymentInfo.percentage) + selectedSerivePaymentInfo.fixed_fee;
            setTransferFee(fee);
        } else if(Number(amount) <= selectedSerivePaymentInfo!.fixed_amount) {
            fee = selectedSerivePaymentInfo!.fixed_fee;
            setTransferFee(fee);
        } else {
            fee = (Number(amount) / 100) * selectedSerivePaymentInfo!.percentage;
            setTransferFee(fee);
        }

        // Set total price and fee
        setTransferFee(fee);
        const totalPrice = (parseFloat(amount) - fee) * selectedSerivePaymentInfo!.buy;
        if(!isNaN(totalPrice)) {
            setTotalTransferPrice(totalPrice);
        } else {
            setTotalTransferPrice(0);
        }
    }

    const getServiceInfo = async(): Promise<void> => {
        try {
            setLoadingServiceInfo(true);
           
            const apiConfig: IApiConfig = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                uuid: store?.uuid!,
                title: `get_service_info`,
                hashKey: store?.hashKey!,
                url: `service/get_service_info/${selectedServiceId}`,
                func: () => console.log("Test"),
            };
    
            const responseJson: IServiceInfoResponse = await httpsService<IServiceInfoResponse>(apiConfig);
            setServicePaymentMethods(responseJson.info);
            for (let info of responseJson.info) {
                if (info.card_type !== "WEB_KM") {
                    continue;
                }
                setSelectedServicePaymentInfo(info);
                setSelectedServicePaymentInfoId(info.card_type);
                break;
            }
            setLoadingServiceInfo(false);
        } catch (error) {
            console.log(error);
            setLoadingServiceInfo(false);
        }
    }

    const servicePreCheck = async (captchaCode: string = ""): Promise<void> => {
        if(account.trim() !== "") {
            try {
                setLoadingPreCheck(true);
                setAccountNotFound(false);

                const apiData = {
                    "account" : account,
                    "service_id": selectedServiceId
                };
    
                const apiConfig: IApiConfig = {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(apiData),
                    uuid: store?.uuid!,
                    title: `${account}0.00${selectedServiceId}`,
                    hashKey: store?.hashKey!,
                    url: "service/precheck",
                    func: () => console.log("Test"),
                };
        
                if (captchaCode) {
                    apiConfig.headers["verification_code"] = captchaCode;
                }
                
                const responseJson: IServicePreCheckResponse = await httpsService<IServicePreCheckResponse>(apiConfig);
                setAccountInfo(responseJson);
                setLoadingPreCheck(false);
                // Close captcha modal
                setStore && setStore({
                    ...store,
                    captcha: {
                        show: false,
                        image: "",
                        ...store?.captcha
                    }
                });
            } catch (error: any) {
                console.log(error);
                setLoadingPreCheck(false);
                // Set captcha settings
                if(error.apiResponseStatusCode === 429 && setStore) {
                    setStore({
                        ...store,
                        captcha : {
                            show: true,
                            function: servicePreCheck,
                            image: error.apiResponse,
                        }
                    })   
                } else {
                    setAccountNotFound(true);
                     // Close captcha modal
                    setStore && setStore({
                        ...store,
                        captcha: {
                            show: false,
                            image: "",
                            ...store?.captcha
                        }
                    });
                }
            }
        }
    };

    const handlePaymentSubmit = async(): Promise<void> => {
        try {
            setLoadingPayment(true);
            const unixTime: Number = Date.now();
           
            const apiData = {
                "payment_method" : selectedSerivePaymentInfo?.card_type,
                "account": account,
                "amount": parseFloat(parseFloat(amount).toFixed(2)),
                "service_id": selectedServiceId,
                "transfer_type": "service_payment",
                "date_for_check": unixTime.toString(),
                "phone": normalizePhoneNumber(phoneNumber)
            };
            
            const apiConfig: IApiConfig = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                uuid: store?.uuid!,
                body: JSON.stringify(apiData),
                title: `${selectedSerivePaymentInfo?.card_type}${account}${parseFloat(amount).toFixed(2)}service_payment${selectedServiceId}${unixTime}${normalizePhoneNumber(phoneNumber)}`,
                hashKey: store?.hashKey!,
                url: `cards/other/transfer_from_unknown`,
                func: () => console.log("Test"),
            };
    
            const responseJson: IPaymentResponse = await httpsService<IPaymentResponse>(apiConfig);
            // Redirect to payment website
            window.location.href = responseJson.payment_url;
        } catch (error) {
            console.log(error);
            setLoadingPayment(false);
        }
    }

    useEffect(() => {
        const getBarkiTojikList = async (): Promise<void> => {
            try {
                setLoading(true);

                const apiConfig: IApiConfig = {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                    uuid: store?.uuid!,
                    title: "get_barki_tojik",
                    hashKey: store?.hashKey!,
                    url: "service/barki_tojik_list",
                    func: () => console.log("Test"),
                };
        
                const responseJson: IBarkiTojikReposnse = await httpsService<IBarkiTojikReposnse>(apiConfig);
                // Check if service exists in LocalStorage
                const localStorageService = localStorage.getItem("selected-service");
                if(localStorageService) {
                    const localStorageServiceJson = JSON.parse(localStorageService);
                    setSelectedServiceId(localStorageServiceJson.id);
                } else {
                    setSelectedServiceId(responseJson.services_list[responseJson.default_index].service_id);
                }
                setBarkiTojikList(responseJson);
                setLoading(false);   
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        getBarkiTojikList();
    }, []);

    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarMessage({...snackbarMessage, open: false});
      };

    useEffect(() => {
        if(selectedServiceId) {
            console.log("Testing", selectedServiceId);
            servicePreCheck();
            getServiceInfo();
            // Save selected service id to LocalStorage
            localStorage.setItem("selected-service", JSON.stringify({
                id: selectedServiceId
              }));
        }
    }, [selectedServiceId]);

    useEffect(() => {
        // Calculate transfer total price
        if(selectedSerivePaymentInfo) {
            calcTransferTotalPrice();
        }
    }, [selectedSerivePaymentInfo, amount]);

    useEffect(() => {
        if(selectedSerivePaymentInfoId) {
            for (let info of servicePaymentMethods) {
                if (info.card_type !== selectedSerivePaymentInfoId) {
                    continue;
                }
                setSelectedServicePaymentInfo(info);
                break;
            }
        }
    }, [selectedSerivePaymentInfoId]);

    return (
       <section>
           <Container>
                <Box my={5}>
                    <Box mb={4}>
                        <Typography variant="h4" component="h1" align="center">Оплата Барки Точик</Typography>
                    </Box>
                    <Box
                        sx={{
                            maxWidth:"600px",
                            margin:"auto",
                        }}
                    >
                        {loading ?
                            <>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={50} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={50} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={50} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={50} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={150} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" height={150} />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton 
                                        sx={{ margin: "auto" }}
                                        variant="rectangular" 
                                        animation="wave" 
                                        height={35} 
                                        width={100} 
                                    />
                                </Box>
                                <Box mb={3}>
                                    <Skeleton variant="rectangular" animation="wave" />
                                </Box>
                            </>
                            :
                            <>
                                <Box mb={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Город</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedServiceId?.toString()}
                                            label="Город"
                                            onChange={(event: SelectChangeEvent) => setSelectedServiceId(Number(event.target.value))}
                                        >
                                            {barkiTojikList?.services_list.map(service => (
                                                <MenuItem key={service.service_id} value={service.service_id}>{service.service_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box mb={3}>
                                    <TextField
                                        required={true}
                                        fullWidth={true}
                                        id="account"
                                        label="Лицевой счет"
                                        value={account}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAccount(event.target.value)}
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setOpenReceiptModal(true)}
                                                        edge="end"
                                                    >
                                                        <HelpIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) 
                                        }}
                                        error={notValidateField.account && account === ""}
                                        helperText={notValidateField.account && account === "" ? "Поле обязательно для заполнения" : ""}
                                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {servicePreCheck(event.target.value); setNotValidateField(prevState => ({...prevState, account: true}))}}
                                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => setNotValidateField(prevState => ({...prevState, account: false}))}
                                    />
                                </Box>
                                <Box mb={3}>
                                    {loadingPreCheck &&
                                        <>
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" /> 
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" />          
                                        </>
                                    }
                                    {(accountInfo && !loadingPreCheck && !accountNotFound) &&
                                        <>
                                            <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}><Person /> ФИО:</Box> {accountInfo.info?.surname}  
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}>
                                                    <Receipt /> {parseFloat(accountInfo.info?.balance) >= 0 ? "Предоплата" : "Задолженность"}:
                                                </Box> {accountInfo.info?.balance} сомони
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}><HomeIcon/> Адрес:</Box> {accountInfo.info?.address}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}><GraphicEq /> Предыдущий показатель:</Box> {accountInfo.info?.previous}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}><GraphicEq /> Текущий показатель:</Box> {accountInfo.info?.present}
                                            </Typography>
                                            <Typography variant="subtitle1" component="div" sx={{display: "flex", gap: "5px"}}>
                                                <Box component="span" sx={{fontWeight: 700, display: "inline-flex",  gap: "3px"}}><Event/> Дата:</Box> {accountInfo.info?.date}
                                            </Typography>
                                        </>
                                    }
                                    {accountNotFound &&
                                        <MuiAlert severity="error">Лицевой счет не найден</MuiAlert>
                                    }
                                </Box>
                                <Box mb={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="payment-type-label">Способ оплаты</InputLabel>
                                        <Select
                                            labelId="payment-type-label"
                                            id="payment-type-select"
                                            value={selectedSerivePaymentInfoId}
                                            label="Способ оплаты"
                                            onChange={(event: SelectChangeEvent) => setSelectedServicePaymentInfoId(event.target.value)}
                                        >
                                            <MenuItem value="WEB_KM">Корти Милли</MenuItem>
                                            <MenuItem value="MVM">Visa/MasterCard/Мир (РФ)</MenuItem>
                                            <MenuItem value="HALYK">Visa/MasterCard(СНГ)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box mb={3}>
                                    <TextField
                                        required={true}
                                        fullWidth={true}
                                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {validateAmount(event.target.value); setNotValidateField(prevState => ({...prevState, amount: true}))}}
                                        id="amount"
                                        label={selectedSerivePaymentInfo?.amount_label}
                                        value={amount}
                                        onChange={handleAmountChnage}
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        error={notValidateField.amount && amount === ""}
                                        helperText={notValidateField.amount && amount === "" ? "Поле обязательно для заполнения" : ""}
                                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => setNotValidateField(prevState => ({...prevState, amount: false}))}
                                    />
                                </Box>
                                {selectedSerivePaymentInfoId === "WEB_KM" &&
                                     <Box mb={3}>
                                        <InputMask 
                                            mask="99-999-99-99" 
                                            value={phoneNumber} 
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(event.target.value)}
                                            error={notValidateField.phoneNumber && (phoneNumber === "" || normalizePhoneNumber(phoneNumber).length !== 9)}
                                            helperText={phoneNumberFieldHelperText()}
                                            onFocus={(event: React.FocusEvent<HTMLInputElement>) => setNotValidateField(prevState => ({...prevState, phoneNumber: false}))}
                                            onBlur={(event: React.FocusEvent<HTMLInputElement>) => {setNotValidateField(prevState => ({...prevState, phoneNumber: true}))}}
                                        />
                                    </Box>
                                }
                                {selectedSerivePaymentInfo &&
                                    <Box 
                                        sx={{
                                            p: 3,
                                            backgroundColor: theme => theme.palette.primary.main,
                                            color: theme => theme.palette.background.default,
                                            borderRadius: "4px"
                                        }}
                                        mb={3}
                                    >
                                        {selectedSerivePaymentInfoId === "MVM" &&
                                            <Typography variant="subtitle1" gutterBottom component="div">
                                                <Box component="span">Курс:</Box> 1 {selectedSerivePaymentInfo.cur_iso} = {selectedSerivePaymentInfo.buy} {selectedSerivePaymentInfo.to_cur_iso}
                                            </Typography>
                                        }
                                        <Typography variant="subtitle1" component="div">
                                            <Box component="span">Комиссия: {transferFee.toLocaleString()} {selectedSerivePaymentInfo.cur_iso}</Box> 
                                        </Typography>
                                        <Box my={1}>
                                            <Divider />
                                        </Box>
                                        <Typography variant="subtitle1" component="div">
                                            <Box component="span" sx={{fontWeight: 700}}>Сумма к зачислению:</Box> {totalTransferPrice < 0 ? Number("0").toFixed(2) : totalTransferPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {selectedSerivePaymentInfo.to_cur_iso}
                                        </Typography>
                                    </Box>
                                }
                                {loadingPayment &&
                                    <Box mb={2}>
                                        <LinearProgress />
                                    </Box>
                                }
                                <Box textAlign="center" mb={3}>
                                    <Button variant="contained" disabled={validateForm()} onClick={handlePaymentSubmit}>
                                        Продолжить
                                    </Button>
                                </Box>
                                <Box mb={3}>
                                    <Typography variant="body1" textAlign="center">
                                        Нажимая кнопку "Продолжить", вы соглашаетесь с правилами и условиями <Link href="https://humo.tj/upload/iblock/dc2/dc26594eebfa8d5b5b6a68e4f1bd3c73.pdf" target="_blank">публичной оферты</Link>.
                                    </Typography>
                                </Box>
                            </>
                        }
                        <VerifiedLogos />
                    </Box>
                </Box>
           </Container>
           <Snackbar open={snackbarMessage.open} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <SnackbarAlert onClose={handleCloseSnackbar} severity={snackbarMessage.type} sx={{ width: '100%' }}>
                    {snackbarMessage.message}
                </SnackbarAlert>
            </Snackbar>
            <ReceiptModal open={openReceiptModal} onClose={() => setOpenReceiptModal(false)} />
       </section>
    );
};

export default Home;