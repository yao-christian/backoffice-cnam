import { format as formatterDate } from "date-fns";

export function formatDate(date: number | Date, format: string = "dd/MM/yyyy") {
  return formatterDate(date, format);
}

export function formatDateWithHour(
  date: number | Date,
  format: string = "dd/MM/yyyy hh:mm"
  // format: string = "dd/MM/yyyy hh:mm:ss"
) {
  return formatterDate(date, format);
}
