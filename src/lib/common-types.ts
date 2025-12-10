type Status = "Active" | "Inactive"

type PrimaryStatus = "Open" | "Accepted" | "Cancelled" | "Closed" | "For Closing"

type SecondaryStatus = "New" | "Verified" | "Approved" | "Request for Hold" | "On-Hold" | "Accepted" | "Cancelled" | "Closed" | "For Closing"

type HolidayType = "Regular" | "Special"

export type {Status, PrimaryStatus, SecondaryStatus, HolidayType}