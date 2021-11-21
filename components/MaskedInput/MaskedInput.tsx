// Input mask
import InputMask from "react-input-mask";
import { MaskedInputProps } from "./MaskedInput.props";
import { TextField, InputAdornment} from "@mui/material";

const MaskedInput = ({mask, onChange, onBlur, onFocus, value, error, helperText, ...props}: MaskedInputProps): JSX.Element => {

    return (
        <>
           <div>
                <InputMask 
                    mask={mask} 
                    onChange={onChange} 
                    value={value} 
                    onBlur={onBlur}
                    onFocus={onFocus}
                    maskPlaceholder=""
                >
                    <TextField
                        required={true}
                        fullWidth={true}
                        id="phone-number"
                        label="Номер телефона"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">(+992)</InputAdornment>,

                        }}
                        error={error}
                        helperText={helperText}
                        {...props}
                    />
                </InputMask>
           </div>
        </>
    );
};

export default MaskedInput;