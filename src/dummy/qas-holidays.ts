import Holiday from "@/lib/holiday";

const holidays: Holiday[] = [
  {
    id: "2025-01-01-new-years-day",
    name: "New Year’s Day",
    holidayType: "Regular",
    date: new Date("2025-01-01"),
    status: "Active"
  },
  {
    id: "2025-04-09-araw-ng-kagitingan",
    name: "Araw ng Kagitingan (Day of Valor)",
    holidayType: "Regular",
    date: new Date("2025-04-09"),
    status: "Active"
  },
  {
    id: "2025-04-17-maundy-thursday",
    name: "Maundy Thursday",
    holidayType: "Regular",
    date: new Date("2025-04-17"),
    status: "Active"
  },
  {
    id: "2025-04-18-good-friday",
    name: "Good Friday",
    holidayType: "Regular",
    date: new Date("2025-04-18"),
    status: "Active"
  },
  {
    id: "2025-05-01-labor-day",
    name: "Labor Day",
    holidayType: "Regular",
    date: new Date("2025-05-01"),
    status: "Active"
  },
  {
    id: "2025-06-12-independence-day",
    name: "Independence Day",
    holidayType: "Regular",
    date: new Date("2025-06-12"),
    status: "Active"
  },
  {
    id: "2025-08-25-national-heroes-day",
    name: "National Heroes Day",
    holidayType: "Regular",
    date: new Date("2025-08-25"), // Last Monday of August 2025
    status: "Active"
  },
  {
    id: "2025-11-30-bonifacio-day",
    name: "Bonifacio Day",
    holidayType: "Regular",
    date: new Date("2025-11-30"),
    status: "Active"
  },
  {
    id: "2025-12-25-christmas-day",
    name: "Christmas Day",
    holidayType: "Regular",
    date: new Date("2025-12-25"),
    status: "Active"
  },
  {
    id: "2025-12-30-rizal-day",
    name: "Rizal Day",
    holidayType: "Regular",
    date: new Date("2025-12-30"),
    status: "Active"
  },

  // Special (Non-Working) Days — Proclamation No. 727
  {
    id: "2025-01-29-chinese-new-year",
    name: "Chinese New Year",
    holidayType: "Special",
    date: new Date("2025-01-29"),
    status: "Active"
  },
  {
    id: "2025-04-19-black-saturday",
    name: "Black Saturday",
    holidayType: "Special",
    date: new Date("2025-04-19"),
    status: "Active"
  },
  {
    id: "2025-07-27-iglesia-ni-cristo-founding",
    name: "Iglesia ni Cristo Founding Anniversary",
    holidayType: "Special",
    date: new Date("2025-07-27"),
    status: "Active"
  }, // Proclamation No. 729 — nationwide special non-working day
  {
    id: "2025-08-21-ninoy-aquino-day",
    name: "Ninoy Aquino Day",
    holidayType: "Special",
    date: new Date("2025-08-21"),
    status: "Active"
  },
  {
    id: "2025-10-31-all-saints-eve",
    name: "All Saints’ Day Eve",
    holidayType: "Special",
    date: new Date("2025-10-31"),
    status: "Active"
  },
  {
    id: "2025-11-01-all-saints-day",
    name: "All Saints’ Day",
    holidayType: "Special",
    date: new Date("2025-11-01"),
    status: "Active"
  },
  {
    id: "2025-12-08-immaculate-conception",
    name: "Feast of the Immaculate Conception of Mary",
    holidayType: "Special",
    date: new Date("2025-12-08"),
    status: "Active"
  },
  {
    id: "2025-12-24-christmas-eve",
    name: "Christmas Eve",
    holidayType: "Special",
    date: new Date("2025-12-24"),
    status: "Active"
  },
  {
    id: "2025-12-31-last-day-of-the-year",
    name: "Last Day of the Year",
    holidayType: "Special",
    date: new Date("2025-12-31"),
    status: "Active"
  }
]

export default holidays