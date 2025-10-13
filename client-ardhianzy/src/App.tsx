import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/App.css";

import { Navbar } from "@/components/common/Navbar";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import { Footer } from "@/components/common/Footer";
import AppHeader from "@/features/layout/components/AppHeader";

import TimelineOfThoughtHybrid from "@/features/home/components/TimelineOfThoughtHybrid";
import HighlightSection from "@/features/home/components/HighlightSection";
import MagazineSection from "@/features/home/components/MagazineSection";
import ResearchSection from "@/features/home/components/ResearchSection";
import CourseSection from "@/features/home/components/CourseSection";
import MonologuesSection from "@/features/home/components/MonologuesSection";
import ReadingGuideSection from "@/features/home/components/ReadingGuideSection";
import IdeasTraditionGridSection from "@/features/ideas-tradition/components/IdeasTraditionGridSection";
import PopCultureReviewSection from "@/features/home/components/PopCultureReviewSection";
import ShopsSection from "@/features/home/components/ShopsSection";
import LatestVideosSection from "@/features/home/components/LatestVideosSection";
import CommunitySection from "@/features/home/components/CommunitySection";

import MagazinePage from "@/features/magazine/pages/MagazinePage";
import ShopPage from "@/features/shop/pages/ShopPage";
import ResearchPage from "@/features/research/pages/ResearchPage";
import MonologuesPage from "@/features/monologues/pages/MonologuesPage";
import IdeasTraditionPage from "@/features/ideas-tradition/pages/IdeasTraditionPage";
import PopCultureReviewPage from "@/features/pop-cultures/pages/PopCultureReviewPage";
import ReadingGuidePage from "@/features/reading-guides/pages/ReadingGuidePage";
import ReadPage from "@/features/articles/pages/ReadPage";
import GuidePage from "@/features/reading-guides/pages/GuidePage";
// import LoginPage from "@/features/auth/pages/LoginPage";
// import SignUpPage from "@/features/auth/pages/SignUpPage";
// import ProfilePage from "@/features/user/pages/ProfilePage";
// import ReadHistoryPage from "@/features/user/pages/ReadHistoryPage";

// import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminArticlePage from "@/features/admin/pages/AdminArticlePage";
import AdminAddArticlePage from "@/features/admin/pages/AdminAddArticlePage";
import AdminEditArticlePage from "@/features/admin/pages/AdminEditArticlePage";
import AdminAddItemPage from "@/features/admin/pages/AdminAddItemPage";
import AdminListItemPage from "@/features/admin/pages/AdminListItemPage";
import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";
import AdminToTListPage from "@/features/admin/pages/AdminToTListPage";
import AdminToTAddPage from "@/features/admin/pages/AdminToTAddPage";
import AdminToTMetaListPage from "@/features/admin/pages/AdminToTMetaListPage";
import AdminToTMetaAddPage from "@/features/admin/pages/AdminToTMetaAddPage";
import AdminResearchShopCollectedPage from "@/features/admin/pages/AdminResearchShopCollectedPage";

import { ROUTES } from "@/app/routes";
// import { useAuth } from "@/features/auth/store";

// const philosophers = [
//   { id: 1, name: "F. Nietzsche", years: "1844–1900", lat: 51.3397, lng: 12.3731 },
//   { id: 2, name: "K. Marx", years: "1818–1883", lat: 49.0069, lng: 8.4037 },
// ];

function HomePage() {
  return (
    <>
      <Navbar />
      <section id="section1" className="section section1">
        <div className="main-content-container">
          <div className="map-wrapper">
            <TimelineOfThoughtHybrid
              // philosophers={philosophers}
              // onMarkerClick={(p) => console.log("clicked:", p)}
            />
          </div>
        </div>
      </section>

      <SectionNavLinks />
      <HighlightSection />
      <MagazineSection />
      <ResearchSection />
      <CourseSection />
      <MonologuesSection />
      <ReadingGuideSection />
      <IdeasTraditionGridSection />
      <PopCultureReviewSection />
      <ShopsSection />
      <LatestVideosSection />
      <CommunitySection />
      <Footer />
    </>
  );
}

function AppRoutes() {
  // const { user, logout } = useAuth();
  // const isLoggedIn = !!user;
  // const handleLogout = () => logout();

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />

      <Route
        path={ROUTES.MAGAZINE}
        element={
          <>
            <AppHeader />
            <MagazinePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.SHOP}
        element={
          <>
            <AppHeader />
            <ShopPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.RESEARCH}
        element={
          <>
            <AppHeader />
            <ResearchPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.MONOLOGUES}
        element={
          <>
            <AppHeader />
            <MonologuesPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.IDEAS_TRADITION}
        element={
          <>
            <AppHeader />
            <IdeasTraditionPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.POP_CULTURE_REVIEW}
        element={
          <>
            <AppHeader />
            <PopCultureReviewPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READING_GUIDE}
        element={
          <>
            <AppHeader />
            <ReadingGuidePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READ}
        element={
          <>
            <AppHeader />
            <ReadPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.GUIDE}
        element={
          <>
            <AppHeader />
            <GuidePage />
            <Footer />
          </>
        }
      />

      {/* <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <>
              <AppHeader />
              <ProfilePage />
              <Footer />
            </>
          </ProtectedRoute>
        }
      /> */}

      {/* <Route
        path={ROUTES.READ_HISTORY}
        element={
          <ProtectedRoute>
            <>
              <AppHeader />
              <ReadHistoryPage />
              <Footer />
            </>
          </ProtectedRoute>
        }
      /> */}

      {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} /> */}

      <Route path={ROUTES.LEGACY.IDEAS_TRADITION} element={<Navigate to={ROUTES.IDEAS_TRADITION} replace />} />
      <Route path={ROUTES.LEGACY.POP_CULTURE_REVIEW} element={<Navigate to={ROUTES.POP_CULTURE_REVIEW} replace />} />
      <Route path={ROUTES.LEGACY.READING_GUIDE} element={<Navigate to={ROUTES.READING_GUIDE} replace />} />


      <Route path={`${ROUTES.ADMIN.ROOT}/*`} element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="articles/list" element={<AdminArticlePage />} />
          <Route path="articles/add" element={<AdminAddArticlePage />} />
          <Route path="articles/edit/:id" element={<AdminEditArticlePage />} />
          <Route path="shop/list" element={<AdminListItemPage />} />
          <Route path="shop/add" element={<AdminAddItemPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="tot/list" element={<AdminToTListPage />} />
          <Route path="tot/add" element={<AdminToTAddPage />} />
          <Route path="tot-meta/list" element={<AdminToTMetaListPage />} />
          <Route path="tot-meta/add" element={<AdminToTMetaAddPage />} />
          <Route path="content" element={<AdminResearchShopCollectedPage />} />
        </Route>
      </Route>

      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}