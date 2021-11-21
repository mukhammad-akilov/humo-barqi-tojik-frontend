export interface MaskedInputProps {
    mask: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
    value: string,
    error: boolean,
    helperText: string,
}