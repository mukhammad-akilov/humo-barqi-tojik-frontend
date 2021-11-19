export interface MaskedInputProps {
    mask: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onFocus?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    error: boolean,
    helperText: string,
}