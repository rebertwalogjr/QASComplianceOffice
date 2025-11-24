

export default function AuditTrail() {
  return (
    <>
      {/* <div className=" bg-background border rounded-md overflow-y-auto"> */}
        {Array.from({ length: 31 }).map((_, index) => (
          <div key={index} className="p-2 border-b">
            Item {index + 1}
          </div>
        ))}
      {/* </div> */}
    </>
  )
}