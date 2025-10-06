import { useEffect, useRef, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";

type UserProfileProps = {
  handleLogout?: () => void;
};

export default function UserProfile({ handleLogout }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar area avatar + menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);
  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    }
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="flex items-center justify-center">
      <button
        type="button"
        onClick={toggleDropdown}
        onKeyDown={onKeyDown}
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        className="p-0 m-0 bg-transparent border-0 cursor-pointer"
      >
        <img
          src="/assets/default-profile-icon.png"
          alt="User Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#F5F5F5] select-none"
          draggable={false}
        />
      </button>

      {isDropdownOpen && <ProfileDropdown handleLogout={handleLogout} />}
    </div>
  );
}