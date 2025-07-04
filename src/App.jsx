import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import HomePage from '@/components/pages/HomePage'
import BrowsePage from '@/components/pages/BrowsePage'
import PropertyDetailPage from '@/components/pages/PropertyDetailPage'
import MatchesPage from '@/components/pages/MatchesPage'
import CustomBuildPage from '@/components/pages/CustomBuildPage'
import ShowcaseProjectsPage from '@/components/pages/ShowcaseProjectsPage'
import MyAccountPage from '@/components/pages/MyAccountPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="custom-build" element={<CustomBuildPage />} />
          <Route path="showcase" element={<ShowcaseProjectsPage />} />
          <Route path="account" element={<MyAccountPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App