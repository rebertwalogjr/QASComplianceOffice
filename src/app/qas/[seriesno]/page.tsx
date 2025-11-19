export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params
  
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <p>Viewing series number: {params.seriesno}</p>
    </div>
  )
}