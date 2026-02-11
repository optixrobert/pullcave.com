import { getNextLiveEvent } from "@/app/actions/live"
import Link from "next/link"
import { Video, Calendar, Clock } from "lucide-react"

export default async function LiveBanner() {
  const nextLive = await getNextLiveEvent()

  if (!nextLive) return null

  const liveDate = new Date(nextLive.scheduledAt)
  const isToday = new Date().toDateString() === liveDate.toDateString()
  
  const dateStr = liveDate.toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
  const timeStr = liveDate.toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}>
      </div>

      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-sm md:text-base">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
            <Video className="w-5 h-5" />
            <span>Prossima Live</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-primary-foreground/30"></div>
          <span className="font-medium truncate max-w-[200px] sm:max-w-none">{nextLive.title}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 opacity-80" />
              <span>{isToday ? 'OGGI' : dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 opacity-80" />
              <span>{timeStr}</span>
            </div>
          </div>
          
          <Link 
            href={nextLive.link} 
            target="_blank"
            className="bg-background text-foreground hover:bg-background/90 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-sm whitespace-nowrap"
          >
            Partecipa
          </Link>
        </div>
      </div>
    </div>
  )
}
