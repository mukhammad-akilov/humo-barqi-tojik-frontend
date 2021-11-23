import {useEffect, useContext, useState} from 'react';
import {Dialog, DialogTitle, DialogContent, Button, Box, TextField, LinearProgress} from "@mui/material";
import { StoreContext } from '../../store/StoreContext';

const CaptchaModal = (): JSX.Element => {
    const {store} = useContext(StoreContext);

    // Form validation
    const [notValidateField, setNotValidateField] = useState<{captchaCode: boolean}>({
      captchaCode: false,
    });
    const [captchaCode, setCaptchaCode] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    const validateForm = (): boolean => {
      const validate = (captchaCode === "" || submitting);
      return validate;
  };

  const resendRequest = async (): Promise<void> => {
      setSubmitting(true);
      if(typeof store?.captcha?.function === "function") {
        store.captcha.function(captchaCode);
      }
  };

  useEffect(() => {
      if(store?.captcha?.show) {
          setCaptchaCode("");
          setNotValidateField({
            captchaCode: false
          });
      }
  }, [store?.captcha?.show]);

  useEffect(() => {
      setSubmitting(false);
  }, [store?.captcha?.image]);

    return (
      <>
        {store?.captcha?.show &&
           <Dialog open={store.captcha.show} fullWidth={true} maxWidth="sm">
           <DialogTitle sx={{textAlign: "center"}}>Введите код из картинки</DialogTitle>
           <DialogContent>
               {store?.captcha?.image &&
                 <Box mb={3}>
                      <img src={store.captcha.image} className="mx-auto" />
                 </Box>
               }
              <Box mb={3}>
                <TextField
                    required={true}
                    fullWidth={true}
                    id="captcha-code"
                    label="Введите код"
                    value={captchaCode}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCaptchaCode(event.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    error={notValidateField.captchaCode && captchaCode === ""}
                    helperText={notValidateField.captchaCode && captchaCode === "" ? "Поле обязательно для заполнения" : ""}
                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => setNotValidateField(prevState => ({...prevState, captchaCode: true}))}
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => setNotValidateField(prevState => ({...prevState, captchaCode: false}))}
                />
              </Box>
              {submitting &&
                <Box mb={2}>
                    <LinearProgress />
                </Box>
              }
              <Box sx={{textAlign: "center"}}>
                  <Button 
                    variant="contained" 
                    disabled={validateForm()} 
                    onClick={resendRequest}
                  >
                      Отправить
                  </Button>
              </Box>
           </DialogContent>
         </Dialog>
        }
      </>
    );
};

export default CaptchaModal;