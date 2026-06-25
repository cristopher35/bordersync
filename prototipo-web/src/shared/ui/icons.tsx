import type { ComponentType } from 'react'
import type { IconBaseProps } from 'react-icons'
import {
  FaCheck,
  FaXmark,
  FaLeaf,
  FaPaw,
  FaCar,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaClockRotateLeft,
  FaBoxArchive,
  FaCircleCheck,
  FaDownload,
  FaTriangleExclamation,
  FaFileLines,
  FaFilePdf,
  FaFileExcel,
  FaPassport,
  FaMagnifyingGlass,
  FaChartColumn,
  FaDesktop,
  FaUsers,
  FaGear,
  FaClipboardList,
  FaTrash,
  FaRegCalendar,
  FaRegCopy,
  FaRightFromBracket,
  FaChevronRight,
} from 'react-icons/fa6'

/**
 * Iconos del sistema (Font Awesome 6 vía react-icons). Se exponen con nombres
 * semánticos para desacoplar la UI de la librería concreta. El wrapper aplica
 * una alineación vertical consistente para que el icono calce con el texto.
 */
function styled(Comp: ComponentType<IconBaseProps>) {
  return function Icon({ className = '', ...rest }: IconBaseProps) {
    return <Comp aria-hidden className={`inline shrink-0 align-[-0.125em] ${className}`} {...rest} />
  }
}

export const IconCheck = styled(FaCheck)
export const IconX = styled(FaXmark)
export const IconLeaf = styled(FaLeaf)
export const IconPaw = styled(FaPaw)
export const IconCar = styled(FaCar)
export const IconPlus = styled(FaPlus)
export const IconEye = styled(FaEye)
export const IconEyeOff = styled(FaEyeSlash)
export const IconHistory = styled(FaClockRotateLeft)
export const IconArchive = styled(FaBoxArchive)
export const IconCircleCheck = styled(FaCircleCheck)
export const IconDownload = styled(FaDownload)
export const IconWarning = styled(FaTriangleExclamation)
export const IconDocument = styled(FaFileLines)
export const IconPdf = styled(FaFilePdf)
export const IconExcel = styled(FaFileExcel)
export const IconPassport = styled(FaPassport)
export const IconSearch = styled(FaMagnifyingGlass)
export const IconChart = styled(FaChartColumn)
export const IconDesktop = styled(FaDesktop)
export const IconUsers = styled(FaUsers)
export const IconGear = styled(FaGear)
export const IconClipboard = styled(FaClipboardList)
export const IconTrash = styled(FaTrash)
export const IconCalendar = styled(FaRegCalendar)
export const IconCopy = styled(FaRegCopy)
export const IconLogout = styled(FaRightFromBracket)
export const IconChevron = styled(FaChevronRight)
