import React, { useEffect, useContext, useState} from 'react';
import { StoreContext } from '../../store/StoreContext';
import httpsService  from '../../utils/httpService/httpService';
import {IBarkiTojikReposnse, IServicePreCheckResponse, IApiConfig, 
    IServiceInfoInfo, IServiceInfoResponse, IPaymentResponse, IApiErrorResponse} from '../../interfaces/interfaces';
// Styles
import styles from './Home.module.scss';
import {Button, Container, Box, Select, SelectChangeEvent, MenuItem, Typography, Divider,
    FormControl, InputLabel, TextField, Skeleton, LinearProgress, Snackbar} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
// Icons
import {Person, AccountBalanceWallet, Home as HomeIcon} from '@mui/icons-material';

const SnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


const Home = () : JSX.Element => {
    const {store, setStore} = useContext(StoreContext);
    // Account
    const [accountInfo, setAccountInfo] = useState<IServicePreCheckResponse>();
    const [account, setAccount] = useState<string>("");
    const [accountNotFound, setAccountNotFound] = useState<boolean>(false);
    // Service (Barki Tojik)
    const [selectedServiceId, setSelectedServiceId] = useState<number>();
    const [serviceInfo, setServiceInfo] = useState<IServiceInfoInfo>();
    const [barkiTojikList, setBarkiTojikList] = useState<IBarkiTojikReposnse>();
    // User input data
    const [amount, setAmount] = useState<number>(0);
    const [userAgreement, setUserAgreement] = useState<boolean>(false);
    // Loading
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingServiceInfo, setLoadingServiceInfo] = useState<boolean>(false);
    const [loadingPreCheck, setLoadingPreCheck] = useState<boolean>(false);
    const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
    // Tranfser pirce info
    const [transferFee, setTransferFee] = useState<number>(0);
    const [totalTransferPrice, setTotalTransferPrice] = useState<number>(0);

    const [snackbarMessage, setSnackbarMessage] = useState<{open: boolean, type: AlertColor | undefined, message: string}>({
        open: false,
        type: "success",
        message: "",
    })

    const validateForm = (): boolean => {
        const validate = (Number(amount) <= 0 || true);
        return validate;
    }

    const validateAmount = (amount: number) => {
        if(amount < serviceInfo!.min_sum) {
            setSnackbarMessage({
                open: true,
                message: `Сумма должна быть не меньше ${serviceInfo?.min_sum} ${serviceInfo?.cur_iso}`,
                type: "error",
            });
            setAmount(serviceInfo!.min_sum);
        } else if (amount > serviceInfo!.max_sum) {
            setSnackbarMessage({
                open: true,
                message: `Сумма должна быть не меньше ${serviceInfo?.max_sum} ${serviceInfo?.cur_iso}`,
                type: "error",
            });
            setAmount(serviceInfo!.max_sum);
        }
        
    }

    const calcTransferTotalPrice = () => {
        let fee: number | null = null;
        if(serviceInfo?.take_both) {
            fee = ((amount / 100) * serviceInfo.percentage) + serviceInfo.fixed_fee;
            setTransferFee(fee);
        } else if(amount <= serviceInfo!.fixed_amount) {
            fee = serviceInfo!.fixed_fee;
            setTransferFee(fee);
        } else {
            fee = (amount / 100) * serviceInfo!.percentage;
            setTransferFee(fee);
        }

        // Set total price and fee
        setTransferFee(fee);
        const totalPrice = (amount - fee) * serviceInfo!.buy;
        if(!isNaN(totalPrice)) {
            setTotalTransferPrice(totalPrice);
        }
    }

    const getServiceInfo = async(serviceId: number): Promise<void> => {
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
                url: `service/get_service_info/${serviceId}`,
                func: () => console.log("Test"),
            };
    
            const responseJson: IServiceInfoResponse = await httpsService<IServiceInfoResponse>(apiConfig);
            for (let info of responseJson.info) {
                if (info.card_type !== "MVM") {
                    continue;
                }
                setServiceInfo(info); 
                break;
            }
            setLoadingServiceInfo(false);
        } catch (error) {
            console.log(error);
            setLoadingServiceInfo(false);
        }
    }

    const servicePreCheck = async (account: string): Promise<void> => {
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
        
                const responseJson: IServicePreCheckResponse = await httpsService<IServicePreCheckResponse>(apiConfig);
                setAccountInfo(responseJson);
                setLoadingPreCheck(false);
            } catch (error) {
                console.log(error);
                setLoadingPreCheck(false);
                setAccountNotFound(true);
            }
        }
    };

    const handlePaymentSubmit = async(): Promise<void> => {
        try {
            setLoadingPayment(true);
            const unixTime: Number = Date.now();
           
            const apiData = {
                "payment_method" : serviceInfo?.card_type,
                "account": account,
                "amount": parseFloat(amount.toFixed(2)),
                "service_id": selectedServiceId,
                "transfer_type": "service_payment",
                "date_for_check": unixTime.toString(),
            };

            const apiConfig: IApiConfig = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                uuid: store?.uuid!,
                body: JSON.stringify(apiData),
                title: `${serviceInfo?.card_type}${account}${amount.toFixed(2)}service_payment${selectedServiceId}${unixTime}`,
                hashKey: store?.hashKey!,
                url: `cards/other/transfer_from_unknown`,
                func: () => console.log("Test"),
            };
    
            console.log("Testing", apiConfig.title, selectedServiceId);
            const responseJson: IPaymentResponse = await httpsService<IPaymentResponse>(apiConfig);
            console.log(responseJson);            
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
                setSelectedServiceId(responseJson.services_list[responseJson.default_index].service_id);
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
            servicePreCheck(account);
            getServiceInfo(selectedServiceId);
        }
    }, [selectedServiceId]);

    useEffect(() => {
        // Calculate transfer total price
        if(serviceInfo) {
            calcTransferTotalPrice();
        }
    }, [serviceInfo, amount]);

    return (
       <section>
           <Container>
                <Box mt={5}>
                    <Box
                        sx={{
                            maxWidth:"600px",
                            margin:"auto",
                        }}
                    >
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
                        <Box>
                            <Skeleton 
                                sx={{ margin: "auto" }}
                                variant="rectangular" 
                                animation="wave" 
                                height={35} 
                                width={100} 
                            />
                        </Box>
                    </Box> 
                </Box>
               {loading ?
                    <Box mt={5}>
                       
                    </Box>
                    :
                    <Box mt={5}>
                        <Box mb={4}>
                            <Typography variant="h4" component="h1" align="center">Оплата Барки Точик</Typography>
                        </Box>
                        <Box
                            sx={{
                                maxWidth:"600px",
                                margin:"auto",
                            }}
                        >
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
                                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => servicePreCheck(event.target.value)}
                                    id="account"
                                    label="Лицевой счет"
                                    value={account}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAccount(event.target.value)}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            </Box>
                            <Box mb={3}>
                                {loadingPreCheck &&
                                    <>
                                        <Skeleton animation="wave" />
                                        <Skeleton animation="wave" />
                                        <Skeleton animation="wave" />      
                                    </>
                                }
                                {(accountInfo && !loadingPreCheck && !accountNotFound) &&
                                    <>
                                        <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                            <Box component="span" sx={{fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px"}}><Person /> ФИО:</Box> {accountInfo.info?.surname}  
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom component="div" sx={{display: "flex", gap: "5px"}}>
                                            <Box component="span" sx={{fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px"}}><AccountBalanceWallet/> Баланс:</Box> {accountInfo.info?.balance} сомони
                                        </Typography>
                                        <Typography variant="subtitle1" component="div" sx={{display: "flex", gap: "5px"}}>
                                            <Box component="span" sx={{fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px"}}><HomeIcon/> Адрес:</Box> {accountInfo.info?.address}
                                        </Typography>
                                    </>
                                }
                                {accountNotFound &&
                                   <MuiAlert severity="error">Лицевой счет не найден</MuiAlert>
                                }
                            </Box>
                            <Box mb={3}>
                                <TextField
                                    required={true}
                                    fullWidth={true}
                                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => validateAmount(Number(event.target.value))}
                                    id="amount"
                                    label={serviceInfo?.amount_label}
                                    value={amount}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(event.target.value))}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            </Box>
                            {serviceInfo &&
                                <Box 
                                    sx={{
                                        p: 3,
                                        backgroundColor: theme => theme.palette.primary.main,
                                        color: theme => theme.palette.background.default,
                                        borderRadius: "4px"
                                    }}
                                    mb={3}
                                >
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        <Box component="span">Курс:</Box> 1 {serviceInfo.cur_iso} = {serviceInfo.buy} {serviceInfo.to_cur_iso}
                                    </Typography>
                                    <Typography variant="subtitle1" component="div">
                                        <Box component="span">Комиссия: {transferFee} {serviceInfo.cur_iso}</Box> 
                                    </Typography>
                                    <Box my={1}>
                                        <Divider />
                                    </Box>
                                    <Typography variant="subtitle1" component="div">
                                        <Box component="span" sx={{fontWeight: 700}}>Сумма к зачислению:</Box> {totalTransferPrice < 0 ? Number("0").toFixed(2) : totalTransferPrice.toFixed(2)} {serviceInfo.to_cur_iso}
                                    </Typography>
                                </Box>
                            }
                            {loadingPayment &&
                                <Box mb={2}>
                                    <LinearProgress />
                                </Box>
                            }
                            <Box textAlign="center">
                                <Button variant="contained" disabled={loadingPayment} onClick={handlePaymentSubmit}>
                                    Оплатить
                                </Button>
                            </Box>
                        </Box>
                    </Box>
            }
           </Container>
           <Snackbar open={snackbarMessage.open} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <SnackbarAlert onClose={handleCloseSnackbar} severity={snackbarMessage.type} sx={{ width: '100%' }}>
                    {snackbarMessage.message}
                </SnackbarAlert>
            </Snackbar>
       </section>
    );
};

export default Home;