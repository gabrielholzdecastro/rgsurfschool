import { SelectHTMLAttributes } from "react";
import { Select } from "./Select";

interface TimeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    minTime?: string;
    maxTime?: string;
    intervalMinutes?: number;
}

export function TimeSelect({
    label,
    error,
    minTime = "06:00",
    maxTime = "20:00",
    intervalMinutes = 30,
    ...props
}: TimeSelectProps) {
    const generateTimeOptions = () => {
        const options = [];
        let [currentHour, currentMinute] = minTime.split(":").map(Number);
        const [endHour, endMinute] = maxTime.split(":").map(Number);

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute <= endMinute)
        ) {
            const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString);

            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }
        }
        return options;
    };

    const times = generateTimeOptions();

    return (
        <Select label={label} error={error} {...props}>
            <option value="">Selecione um horário...</option>
            {times.map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
            ))}
        </Select>
    );
}
