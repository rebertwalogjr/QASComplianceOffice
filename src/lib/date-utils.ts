export const formatLongDate = ( input: Date | string | undefined ) => {
  if (!input) return ""
  const d = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return ""

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(d)
}