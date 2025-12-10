import { Status, HolidayType } from "./common-types"

type Holiday = {
  id: string,
  name: string,
  holidayType: HolidayType,
  date: Date,
  status: Status
}

export default Holiday