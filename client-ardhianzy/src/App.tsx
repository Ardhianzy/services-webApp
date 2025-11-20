import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./styles/App.css";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import SectionNavLinks from "@/features/layout/components/SectionNavLinks";
import AppHeader from "@/features/layout/components/AppHeader";
// 
import TimelineOfThoughtSection from "@/features/home/components/TimelineOfThoughtSection";
// import HighlightSection from "@/features/home/components/HighlightSection";
import MagazineSection from "@/features/home/components/MagazineSection";
import MagazineDetailPage from "@/features/magazine/pages/MagazineDetailPage";
import MagazineComingSoonPage from "@/features/magazine/pages/MagazineComingSoonPage";
import ResearchSection from "@/features/home/components/ResearchSection";
import ResearchDetailPage from "@/features/research/pages/ResearchDetailPage";
import ResearchComingSoonPage from "@/features/research/pages/ResearchComingSoonPage";
import CourseSection from "@/features/home/components/CourseSection";
import MonologuesSection from "@/features/home/components/MonologuesSection";
import MonologuesComingSoonPage from "@/features/monologues/pages/MonologuesComingSoonPage";
import MonologuesDetailPage from "@/features/monologues/pages/MonologuesDetailPage";
import ReadingGuideSection from "@/features/home/components/ReadingGuideSection";
import ReadingGuideDetailPage from "@/features/reading-guides/pages/ReadingGuideDetailPage";
import ReadingGuideComingSoonPage from "@/features/reading-guides/pages/ReadingGuideComingSoonPage";
import IdeasTraditionGridSection from "@/features/home/components/IdeasTraditionGridSection";
import IdeaArticleDetailPage from "@/features/ideas-tradition/pages/IdeaArticleDetailPage";
import IdeasTraditionComingSoonPage from "@/features/ideas-tradition/pages/IdeasTraditionComingSoonPage";
import PopCultureReviewSection from "@/features/home/components/PopCultureReviewSection";
import PopCultureReviewDetailPage from "@/features/pop-cultures/pages/PopCultureReviewDetailPage";
import PopCultureReviewComingSoonPage from "@/features/pop-cultures/pages/PopCultureReviewComingSoonPage";
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
// import ReadPage from "@/features/articles/pages/ReadPage";
// import LoginPage from "@/features/auth/pages/LoginPage";
// import SignUpPage from "@/features/auth/pages/SignUpPage";
// import ProfilePage from "@/features/user/pages/ProfilePage";
// import ReadHistoryPage from "@/features/user/pages/ReadHistoryPage";

import AdminRoute from "@/routes/AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
// import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminArticlePage from "@/features/admin/pages/AdminArticlePage";
import AdminAddArticlePage from "@/features/admin/pages/AdminAddArticlePage";
import AdminEditArticlePage from "@/features/admin/pages/AdminEditArticlePage";
import AdminMagazinePage from "@/features/admin/pages/AdminMagazinePage";
import AdminAddMagazinePage from "@/features/admin/pages/AdminAddMagazinePage";
import AdminEditMagazinePage from "@/features/admin/pages/AdminEditMagazinePage";
import AdminResearchPage from "@/features/admin/pages/AdminResearchPage";
import AdminAddResearchPage from "@/features/admin/pages/AdminAddResearchPage";
import AdminEditResearchPage from "@/features/admin/pages/AdminEditResearchPage";
import AdminMonologuePage from "@/features/admin/pages/AdminMonologuePage";
import AdminAddMonologuePage from "@/features/admin/pages/AdminAddMonologuePage";
import AdminEditMonologuePage from "@/features/admin/pages/AdminEditMonologuePage";
import AdminShopPage from "@/features/admin/pages/AdminShopPage";
import AdminAddShopPage from "@/features/admin/pages/AdminAddShopPage";
import AdminEditShopPage from "@/features/admin/pages/AdminEditShopPage";
import AdminToTPage from "@/features/admin/pages/AdminToTPage";
import AdminAddToTPage from "@/features/admin/pages/AdminAddToTPage";
import AdminEditToTPage from "@/features/admin/pages/AdminEditToTPage";
import AdminToTMetaPage from "@/features/admin/pages/AdminToTMetaPage";
import AdminAddToTMetaPage from "@/features/admin/pages/AdminAddToTMetaPage";
import AdminEditToTMetaPage from "@/features/admin/pages/AdminEditToTMetaPage";
// import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";
// import AdminResearchShopCollectedPage from "@/features/admin/pages/AdminResearchShopCollectedPage";

import { ROUTES } from "@/app/routes";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const el = document.scrollingElement || document.documentElement;
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
    if (el) el.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [pathname, search]);
  return null;
}

function HomePage() {
  return (
    <>
      <Navbar />
      <section id="section1" className="section section1">
        <div className="main-content-container">
          <div className="map-wrapper">
            <TimelineOfThoughtSection />
          </div>
        </div>
      </section>

      <div id="below-map">
        <SectionNavLinks />
        {/* <HighlightSection /> */}
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
      </div>
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
        path={ROUTES.MAGAZINE_DETAIL}
        element={<MagazineDetailPage />}
      />
      <Route 
        path={ROUTES.MAGAZINE_COMING_SOON} 
        element={<MagazineComingSoonPage />} 
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
      <Route path={ROUTES.RESEARCH_DETAIL} element={<ResearchDetailPage />} />
      <Route path={ROUTES.RESEARCH_COMING_SOON} element={<ResearchComingSoonPage />} />
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
      <Route path={ROUTES.MONOLOGUES_DETAIL} element={<MonologuesDetailPage />} />
      <Route path={ROUTES.MONOLOGUES_COMING_SOON} element={<MonologuesComingSoonPage />} />
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
        path={ROUTES.IDEAS_TRADITION_DETAIL}
        element={
          <>
            <AppHeader />
            <IdeaArticleDetailPage />
            <Footer />
          </>
        }
      />
      <Route path={ROUTES.IDEAS_TRADITION_COMING_SOON} element={<IdeasTraditionComingSoonPage />} />
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
        path={ROUTES.POP_CULTURE_REVIEW_DETAIL}
        element={
          <>
            <AppHeader />
            <PopCultureReviewDetailPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.POP_CULTURE_REVIEW_COMING_SOON}
        element={<PopCultureReviewComingSoonPage />}
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
        path={ROUTES.READING_GUIDE_DETAIL}
        element={
          <>
            <AppHeader />
            <ReadingGuideDetailPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READING_GUIDE_COMING_SOON}
        element={<ReadingGuideComingSoonPage />}
      />
      {/* <Route
        path={ROUTES.READ}
        element={
          <>
            <AppHeader />
            <ReadPage />
            <Footer />
          </>
        }
      /> */}

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
          {/* /admin -> default ke list artikel */}
          <Route index element={<Navigate to="articles" replace />} />

          {/* Nanti: /admin/dashboard */}
          {/* <Route path="dashboard" element={<AdminDashboardPage />} /> */}

          {/* Sudah aktif: manajemen artikel */}
          <Route path="articles" element={<AdminArticlePage />} />
          <Route path="articles/add" element={<AdminAddArticlePage />} />
          <Route path="articles/:id" element={<AdminEditArticlePage />} />

          <Route path="magazines" element={<AdminMagazinePage />} />
          <Route path="magazines/add" element={<AdminAddMagazinePage />} />
          <Route path="magazines/:id" element={<AdminEditMagazinePage />} />

          <Route path="research" element={<AdminResearchPage />} />
          <Route path="research/add" element={<AdminAddResearchPage />} />
          <Route path="research/:id" element={<AdminEditResearchPage />} />

          <Route path="monologues" element={<AdminMonologuePage />} />
          <Route path="monologues/add" element={<AdminAddMonologuePage />} />
          <Route path="monologues/:id" element={<AdminEditMonologuePage />} />

          <Route path="shop" element={<AdminShopPage />} />
          <Route path="shop/add" element={<AdminAddShopPage />} />
          <Route path="shop/:id" element={<AdminEditShopPage />} />

          <Route path="tot/list" element={<AdminToTPage />} />
          <Route path="tot/add" element={<AdminAddToTPage />} />
          <Route path="tot/:id" element={<AdminEditToTPage />} />

          <Route path="meta-tot/list" element={<AdminToTMetaPage />} />
          <Route path="meta-tot/add" element={<AdminAddToTMetaPage />} />
          <Route path="meta-tot/:id" element={<AdminEditToTMetaPage />} />
        </Route>
      </Route>

      {/* ====== ADMIN LOGIN (PUBLIC) ====== */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

      {/* ====== FALLBACK ====== */}
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
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}