import clsx from 'clsx'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '../../lib/currency'
import { UiButton } from '../ui/button'

// Re-export RoomTabs component and types for convenience
export { default as RoomTabs } from './RoomTabs'
export type { RoomTab, RoomTabsProps } from './RoomTabs'

// Animation constants
const ANIMATION_DURATION = 2000
const LETTER_DELAY = 100

export interface HeaderProps {
  className?: string
  totalPrice?: number
  currencySymbol?: string
  totalLabel?: string
  onCartClick?: () => void
  itemsInCart: number
  isLoading?: boolean
  isSticky?: boolean
}

const Header: React.FC<HeaderProps> = ({
  className,
  totalPrice = 0,
  currencySymbol = '€',
  totalLabel = 'Total:',
  onCartClick,
  itemsInCart,
  isLoading = false,
  isSticky = true,
}) => {
  const initialHRef = useRef<SVGSVGElement>(null)
  const fullTextRef = useRef<SVGSVGElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Format price using the new currency utility
  const formattedPrice = formatPrice(totalPrice, currencySymbol)

  useEffect(() => {
    // Only run animation once when component mounts
    if (hasAnimated || !initialHRef.current || !fullTextRef.current) return

    const initialH = initialHRef.current
    const fullText = fullTextRef.current
    const textPaths = fullText.querySelectorAll('.text-path')

    // Track timeouts for cleanup
    const timeouts: ReturnType<typeof setTimeout>[] = []

    // Set initial state - hide fullText completely (including its H)
    fullText.style.opacity = '0'

    // Animate the H rotation
    initialH.style.animation = 'rotate3D 2s ease-in-out forwards'

    // After rotation, hide initialH and show fullText with letter animation
    const mainTimeout = setTimeout(() => {
      // Hide the animated H and show the full text
      initialH.style.opacity = '0'
      fullText.style.opacity = '1'

      // Animate letters appearing one by one (starting from 'o', since H is already visible)
      textPaths.forEach((path, index) => {
        const timeout = setTimeout(() => {
          ;(path as SVGElement).style.opacity = '1'
        }, LETTER_DELAY * index)
        timeouts.push(timeout)
      })
      setHasAnimated(true)
    }, ANIMATION_DURATION)

    // Cleanup function
    return () => {
      clearTimeout(mainTimeout)
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return (
    <header className={clsx('bg-black text-white shadow-md', isSticky && 'sticky top-0 z-50', className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 3D Animated Logo Container */}
          <div className="logo-container">
            {/* Initial H that rotates */}
            <svg
              ref={initialHRef}
              id="initialH"
              height="35"
              viewBox="0 0 190 200"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMid meet"
              className="transform-gpu"
            >
              <path
                className="h-path fill-white opacity-100"
                d="M0.780029 195.68V0H43.57V78.82H145.57V0H188.36V195.68H145.6V119H43.6V195.65L0.780029 195.68Z"
              />
            </svg>

            {/* Full text SVG */}
            <svg ref={fullTextRef} id="fullText" viewBox="0 0 1474 201" xmlns="http://www.w3.org/2000/svg" className="">
              {/* H (initial visible) */}
              <path
                className="h-path fill-white opacity-100"
                d="M0.780029 195.68V0H43.57V78.82H145.57V0H188.36V195.68H145.6V119H43.6V195.65L0.780029 195.68Z"
              />

              {/* Rest of the letters */}
              <path
                className="text-path fill-white opacity-0"
                d="M342.21 177C329.337 192.88 309.807 200.82 283.62 200.82C257.433 200.82 237.893 192.88 225 177C212.14 161.12 205.71 142.003 205.71 119.65C205.71 97.65 212.14 78.6066 225 62.52C237.86 46.4333 257.39 38.3766 283.59 38.35C309.777 38.35 329.307 46.4066 342.18 62.52C355.053 78.6333 361.483 97.6766 361.47 119.65C361.49 142.03 355.07 161.147 342.21 177ZM310.33 155C316.57 146.713 319.693 134.937 319.7 119.67C319.707 104.403 316.583 92.6533 310.33 84.42C304.083 76.18 295.133 72.06 283.48 72.06C271.827 72.06 262.853 76.18 256.56 84.42C250.28 92.66 247.137 104.41 247.13 119.67C247.123 134.93 250.267 146.707 256.56 155C262.86 163.28 271.833 167.42 283.48 167.42C295.127 167.42 304.077 163.28 310.33 155Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M362.91 73.05V44.67H384.16V0H423.6V44.64H448.34V73.02H423.6V153.56C423.6 159.813 424.39 163.703 425.97 165.23C427.55 166.757 432.397 167.527 440.51 167.54C441.73 167.54 443.01 167.54 444.36 167.47C445.71 167.4 447.04 167.36 448.36 167.26V197.04L429.49 197.74C410.657 198.407 397.793 195.143 390.9 187.95C386.42 183.39 384.18 176.353 384.18 166.84V73.05H362.91Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M569.1 46.36C579.844 51.2132 588.978 59.033 595.43 68.9C601.829 78.3399 605.985 89.1179 607.58 100.41C608.647 107.41 609.083 117.493 608.89 130.66H497.89C498.51 145.947 503.823 156.667 513.83 162.82C519.91 166.64 527.243 168.55 535.83 168.55C544.903 168.55 552.277 166.217 557.95 161.55C561.361 158.638 564.152 155.071 566.16 151.06H606.84C605.773 160.107 600.85 169.29 592.07 178.61C578.41 193.43 559.297 200.84 534.73 200.84C514.437 200.84 496.543 194.59 481.05 182.09C465.557 169.59 457.803 149.257 457.79 121.09C457.79 94.69 464.79 74.4467 478.79 60.36C492.79 46.2733 510.957 39.23 533.29 39.23C546.537 39.2233 558.473 41.6 569.1 46.36ZM509.48 80.78C503.853 86.5933 500.317 94.4567 498.87 104.37H567.52C566.787 93.8033 563.247 85.7767 556.9 80.29C550.553 74.8033 542.677 72.0633 533.27 72.07C523.043 72.07 515.113 74.9733 509.48 80.78V80.78Z"
              />
              <path className="text-path fill-white opacity-0" d="M665.58 195.68H625.73V0H665.58V195.68Z" />
              <path
                className="text-path fill-white opacity-0"
                d="M786.89 43.27H829.67L774.67 195.68H732.67L678 43.27H722.75L754.49 155.69L786.89 43.27Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M940.11 46.36C950.855 51.2158 959.992 59.0349 966.45 68.9C972.841 78.3428 976.994 89.1198 978.59 100.41C979.67 107.41 980.11 117.493 979.91 130.66H868.91C869.523 145.947 874.833 156.667 884.84 162.82C890.933 166.64 898.267 168.55 906.84 168.55C915.92 168.55 923.297 166.217 928.97 161.55C932.377 158.637 935.166 155.07 937.17 151.06H977.86C976.78 160.107 971.853 169.29 963.08 178.61C949.433 193.43 930.323 200.84 905.75 200.84C885.463 200.84 867.567 194.59 852.06 182.09C836.553 169.59 828.8 149.257 828.8 121.09C828.8 94.69 835.8 74.4467 849.8 60.36C863.8 46.2733 881.967 39.23 904.3 39.23C917.54 39.2233 929.477 41.6 940.11 46.36ZM880.5 80.78C874.873 86.5933 871.333 94.4567 869.88 104.37H938.54C937.807 93.8033 934.267 85.7767 927.92 80.29C921.573 74.8033 913.693 72.0633 904.28 72.07C894.06 72.07 886.133 74.9733 880.5 80.78V80.78Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M1080.57 39.7C1081.08 39.75 1082.23 39.82 1084 39.91V80.74C1081.48 80.46 1079.25 80.28 1077.29 80.18C1075.33 80.08 1073.75 80.04 1072.54 80.04C1056.5 80.04 1045.73 85.26 1040.24 95.7C1037.16 101.58 1035.62 110.623 1035.62 122.83V195.68H995.49V43.27H1033.49V69.84C1039.64 59.68 1045 52.7333 1049.56 49C1057.02 42.76 1066.72 39.6367 1078.65 39.63C1079.43 39.63 1080.06 39.66 1080.57 39.7Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M1134.1 147C1134.95 154.08 1136.78 159.113 1139.58 162.1C1144.55 167.433 1153.73 170.1 1167.12 170.1C1174.98 170.1 1181.23 168.933 1185.87 166.6C1190.51 164.267 1192.84 160.773 1192.87 156.12C1192.95 154.07 1192.47 152.037 1191.48 150.239C1190.5 148.44 1189.04 146.944 1187.27 145.91C1183.53 143.577 1169.63 139.577 1145.58 133.91C1128.25 129.617 1116.05 124.253 1108.98 117.82C1101.89 111.493 1098.34 102.36 1098.35 90.42C1098.35 76.3533 1103.88 64.26 1114.95 54.14C1126.02 44.02 1141.59 38.9633 1161.68 38.97C1180.74 38.97 1196.27 42.7666 1208.27 50.36C1220.27 57.9533 1227.16 71.0733 1228.94 89.72H1189.09C1188.53 84.6 1187.08 80.5466 1184.75 77.56C1180.35 72.1533 1172.87 69.45 1162.31 69.45C1153.64 69.45 1147.45 70.8 1143.73 73.5C1140.04 76.21 1138.2 79.37 1138.2 83.01C1138.09 85.0619 1138.59 87.1001 1139.64 88.8674C1140.69 90.6346 1142.24 92.0518 1144.09 92.94C1148.01 95.08 1161.88 98.7466 1185.69 103.94C1201.57 107.673 1213.47 113.313 1221.39 120.86C1229.31 128.407 1233.23 137.96 1233.14 149.52C1233.14 164.633 1227.51 176.967 1216.25 186.52C1204.99 196.073 1187.57 200.85 1164 200.85C1140 200.85 1122.28 195.793 1110.83 185.68C1099.38 175.567 1093.67 162.673 1093.7 147H1134.1Z"
              />
              <path
                className="text-path fill-white opacity-0"
                d="M1357.62 46.36C1368.38 51.2038 1377.54 59.0246 1384 68.9C1390.39 78.3428 1394.54 89.1198 1396.14 100.41C1397.22 107.41 1397.66 117.493 1397.46 130.66H1286.46C1287.07 145.947 1292.38 156.667 1302.39 162.82C1308.48 166.64 1315.82 168.55 1324.39 168.55C1333.46 168.55 1340.84 166.217 1346.51 161.55C1349.92 158.637 1352.71 155.07 1354.71 151.06H1395.4C1394.32 160.107 1389.39 169.29 1380.62 178.61C1366.97 193.43 1347.86 200.84 1323.29 200.84C1303 200.84 1285.11 194.59 1269.6 182.09C1254.09 169.59 1246.34 149.257 1246.35 121.09C1246.35 94.69 1253.35 74.4467 1267.35 60.36C1281.35 46.2733 1299.52 39.23 1321.85 39.23C1335.08 39.2233 1347 41.6 1357.62 46.36ZM1298 80.78C1292.37 86.5933 1288.83 94.4567 1287.38 104.37H1356.04C1355.31 93.8033 1351.77 85.7767 1345.42 80.29C1339.07 74.8033 1331.2 72.0633 1321.79 72.07C1311.57 72.07 1303.64 74.9733 1298 80.78Z"
              />
              <path className="text-path fill-white opacity-0" d="M1473.62 152.09H1430.04V195.67H1473.62V152.09Z" />
            </svg>
          </div>

          {/* Cart and Price */}
            <div className="text-right min-w-0 flex-shrink-0">
              <p className="text-xs text-neutral-300 whitespace-nowrap">{totalLabel}</p>
              <p className="text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">{formattedPrice}</p>
            </div>
        </div>
      </div>
    </header>
  )
}

export default Header
export { Header as ABS_Header }
