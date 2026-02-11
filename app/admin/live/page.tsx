import { getAllLiveEvents } from "@/app/actions/live"
import AdminLivePage from "@/components/admin/live-manager"

export default async function Page() {
  const events = await getAllLiveEvents()
  return <AdminLivePage events={events} />
}
