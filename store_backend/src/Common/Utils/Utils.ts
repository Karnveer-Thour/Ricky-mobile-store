import moment from "moment";

// function that converts date to UTC
export const dateToUTC = (date = null) => {
    return (date ? moment(date) : moment()).utc().toDate();
};

// function that converts date of birth to age
export const birthToAge = (dateBirth: Date): number | null => {
    if (!dateBirth) {
        return null;
    }
    const today = new Date();
    const birthDate = new Date(dateBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
