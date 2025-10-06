// src/App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/App.css";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

// HOME (landing sections)
import TimelineOfThoughtSection from "@/features/home/components/TimelineOfThoughtSection";
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

// PUBLIC PAGES
import MagazinePage from "@/features/magazine/pages/MagazinePage";
import ShopPage from "@/features/shop/pages/ShopPage";
import ResearchPage from "@/features/research/pages/ResearchPage";
import MonologuesPage from "@/features/monologues/pages/MonologuesPage";
import IdeasTraditionPage from "@/features/ideas-tradition/pages/IdeasTraditionPage";
import PopCultureReviewPage from "@/features/pop-cultures/pages/PopCultureReviewPage";
import ReadingGuidePage from "@/features/reading-guides/pages/ReadingGuidePage";
import ReadPage from "@/features/articles/pages/ReadPage";
import GuidePage from "@/features/reading-guides/pages/GuidePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import ProfilePage from "@/features/user/pages/ProfilePage";
import ReadHistoryPage from "@/features/user/pages/ReadHistoryPage";

// ADMIN
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminArticlePage from "@/features/admin/pages/AdminArticlePage";
import AdminAddArticlePage from "@/features/admin/pages/AdminAddArticlePage";
import AdminAddItemPage from "@/features/admin/pages/AdminAddItemPage";
import AdminListItemPage from "@/features/admin/pages/AdminListItemPage";
import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";

import { ROUTES } from "@/app/routes";

const philosophers = [
  { id: 1, name: "F. Nietzsche", years: "1844–1900", lat: 51.3397, lng: 12.3731 },
  { id: 2, name: "K. Marx", years: "1818–1883", lat: 49.0069, lng: 8.4037 },
];

function HomePage() {
  return (
    <>
      <TimelineOfThoughtSection
        philosophers={philosophers}
        onMarkerClick={(p) => console.log("clicked:", p)}
      />
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
    </>
  );
}

function AppRoutes() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsAdminLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
  }, []);

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <HomePage />
            <Footer />
          </>
        }
      />

      <Route
        path={ROUTES.MAGAZINE}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <MagazinePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.SHOP}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ShopPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.RESEARCH}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ResearchPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.MONOLOGUES}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <MonologuesPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.IDEAS_TRADITION}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <IdeasTraditionPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.POP_CULTURE_REVIEW}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <PopCultureReviewPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READING_GUIDE}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ReadingGuidePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READ}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ReadPage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.GUIDE}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <GuidePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ProfilePage />
            <Footer />
          </>
        }
      />
      <Route
        path={ROUTES.READ_HISTORY}
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <ReadHistoryPage />
            <Footer />
          </>
        }
      />

      <Route path={ROUTES.LOGIN} element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />

      {/* Redirect dari rute lama (huruf besar) */}
      <Route path={ROUTES.LEGACY.IDEAS_TRADITION} element={<Navigate to={ROUTES.IDEAS_TRADITION} replace />} />
      <Route path={ROUTES.LEGACY.POP_CULTURE_REVIEW} element={<Navigate to={ROUTES.POP_CULTURE_REVIEW} replace />} />
      <Route path={ROUTES.LEGACY.READING_GUIDE} element={<Navigate to={ROUTES.READING_GUIDE} replace />} />

      {/* Admin Area (nested) */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
      <Route
        path={`${ROUTES.ADMIN.ROOT}/*`}
        element={
          <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
            <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="articles/list" element={<AdminArticlePage />} />
        <Route path="articles/add" element={<AdminAddArticlePage />} />
        <Route path="shop/list" element={<AdminListItemPage />} />
        <Route path="shop/add" element={<AdminAddItemPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default function App() {
  // Jadikan tema gelap default (paritas dengan App.jsx lama yang full hitam)
  useEffect(() => {
    document.documentElement.classList.add("dark");
    // kalau kamu pasang langsung di index.html <html class="dark">, efek ini boleh dihapus
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}