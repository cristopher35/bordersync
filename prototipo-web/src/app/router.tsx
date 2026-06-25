import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RoleGuard } from '@/shared/session/RoleGuard'

import { LoginPage } from '@/features/auth/presentation/LoginPage'
import { RegisterPage } from '@/features/auth/presentation/RegisterPage'

import { PublicStatusPage } from '@/features/traveler/presentation/PublicStatusPage'
import { TravelerLayout } from '@/features/traveler/presentation/TravelerLayout'
import { TravelerDashboard } from '@/features/traveler/presentation/TravelerDashboard'
import { NewTramitePage } from '@/features/traveler/presentation/NewTramitePage'
import { TramiteDetailPage } from '@/features/traveler/presentation/TramiteDetailPage'
import { ConsultaPage } from '@/features/traveler/presentation/ConsultaPage'
import { MyActivityPage } from '@/features/traveler/presentation/MyActivityPage'

import { CustomsLayout } from '@/features/customs/presentation/CustomsLayout'
import { ValidationQueuePage } from '@/features/customs/presentation/ValidationQueuePage'
import { FiscalizacionPage } from '@/features/customs/presentation/FiscalizacionPage'
import { ReportesPage } from '@/features/customs/presentation/ReportesPage'
import { CustomsHistoryPage } from '@/features/customs/presentation/CustomsHistoryPage'

import { SanitaryLayout } from '@/features/sanitary/presentation/SanitaryLayout'
import { ReviewPage } from '@/features/sanitary/presentation/ReviewPage'
import { SanitaryHistoryPage } from '@/features/sanitary/presentation/SanitaryHistoryPage'

import { MigrationLayout } from '@/features/migration/presentation/MigrationLayout'
import { MigrationReviewPage } from '@/features/migration/presentation/MigrationReviewPage'
import { MigrationHistoryPage } from '@/features/migration/presentation/MigrationHistoryPage'

import { AdminLayout } from '@/features/admin/presentation/AdminLayout'
import { AdminDashboard } from '@/features/admin/presentation/AdminDashboard'
import { UsersPage } from '@/features/admin/presentation/UsersPage'
import { ParametersPage } from '@/features/admin/presentation/ParametersPage'
import { AuditPage } from '@/features/admin/presentation/AuditPage'

/**
 * Composition root de las rutas. Cada feature expone sus páginas; el router las
 * compone bajo un layout por rol protegido con RoleGuard (RBAC).
 */
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/registro', element: <RegisterPage /> },
  { path: '/estado/:id', element: <PublicStatusPage /> },

  {
    path: '/viajero',
    element: (
      <RoleGuard allow="viajero">
        <TravelerLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <TravelerDashboard /> },
      { path: 'nuevo', element: <NewTramitePage /> },
      { path: 'tramite/:id', element: <TramiteDetailPage /> },
      { path: 'consulta', element: <ConsultaPage /> },
      { path: 'actividad', element: <MyActivityPage /> },
    ],
  },

  {
    path: '/aduanas',
    element: (
      <RoleGuard allow="aduanas">
        <CustomsLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <ValidationQueuePage /> },
      { path: 'fiscalizacion', element: <FiscalizacionPage /> },
      { path: 'reportes', element: <ReportesPage /> },
      { path: 'historial', element: <CustomsHistoryPage /> },
    ],
  },

  {
    path: '/sag',
    element: (
      <RoleGuard allow="sag">
        <SanitaryLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <ReviewPage /> },
      { path: 'historial', element: <SanitaryHistoryPage /> },
    ],
  },

  {
    path: '/pdi',
    element: (
      <RoleGuard allow="pdi">
        <MigrationLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <MigrationReviewPage /> },
      { path: 'historial', element: <MigrationHistoryPage /> },
    ],
  },

  {
    path: '/admin',
    element: (
      <RoleGuard allow="admin">
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'usuarios', element: <UsersPage /> },
      { path: 'parametros', element: <ParametersPage /> },
      { path: 'auditoria', element: <AuditPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
])
