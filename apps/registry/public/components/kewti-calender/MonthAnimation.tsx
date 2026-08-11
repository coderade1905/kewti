import React from "react"
import Meskerem from "./MonthAnimations/meskerem"
import Tikimt from "./MonthAnimations/tkimt"
import Hidar from "./MonthAnimations/hidar"
import Tahsas from "./MonthAnimations/tahsas"
import Tir from "./MonthAnimations/tir"
import Yekatit from "./MonthAnimations/yekatit"
import Megabit from "./MonthAnimations/megabit"
import Miazia from "./MonthAnimations/miazia"
import Genbot from "./MonthAnimations/genbot"
import Sene from "./MonthAnimations/sene"
import Hamle from "./MonthAnimations/hamle"
import Nehase from "./MonthAnimations/nehase"
import Puagme from "./MonthAnimations/puagme"

const MonthAnimation: React.FC<{ month: number }> = ({ month }) => {
  const renderAnimation = () => {
    switch (month) {
      case 1: // Meskerem – Adey Abeba (yellow)
        return <Meskerem />

      case 2: // Tikimt – Golden Wheat Waving
        return <Tikimt />

      case 3: // Hidar – Hidar Sitatan
        return <Hidar />

      case 4: // Tahsas – Genna (Simple Christmas Star)
        return <Tahsas />

      case 5: // Tir – Timket Lomi
        return <Tir />

      case 6: // Yekatit – Adwa war
        return <Yekatit />

      case 7: // Megabit – Food
        return <Megabit />

      case 8: // Miazia – Marriage
        return <Miazia />

      case 9: // Genbot – Full Sun
        return <Genbot />

      case 10: // Sene – Seed Sprouting (Arrival of the Kiremt Rains & Growth)
        return <Sene />

      case 11: // Hamle – Cloud
        return <Hamle />

      case 12: // Nehase – Rain with Lightning bolt
        return <Nehase />

      case 13: // Pagume – Adey Abeba Bud (About to bloom)
        return <Puagme />
      default:
        return (
          <div className="h-full w-full animate-pulse rounded-full bg-neutral-200/30" />
        )
    }
  }

  return <div className="h-full w-full">{renderAnimation()}</div>
}

export default MonthAnimation
