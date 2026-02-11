import { getWheelPrizes } from "@/app/actions/admin/wheel"
import WheelManager from "./wheel-manager"

export default async function WheelPage() {
  const prizes = await getWheelPrizes()
  return (
    <div className="p-8">
      <WheelManager initialPrizes={prizes} />
    </div>
  )
}
