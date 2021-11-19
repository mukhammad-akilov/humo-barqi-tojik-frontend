export const normalizePhoneNumber = (phoneNumber: string): string => {
    phoneNumber = phoneNumber.replace(/-/g, "");
    phoneNumber = phoneNumber.replace(/ /g, "");
    phoneNumber = phoneNumber.trim();
    return phoneNumber;
};