import { type FC } from "react";

// const SearchIcon: FC = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 14 14"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     aria-hidden="true"
//   >
//     <path
//         d="M10.2077 8.9493C10.8354 8.04411 11.2284 6.96024 11.2284 5.79585C11.2284 2.89923 8.84183 0.512695 5.94521 0.512695C3.04859 0.512695 0.662052 2.89923 0.662052 5.79585C0.662052 8.69247 3.04859 11.079 5.94521 11.079C7.1096 11.079 8.19347 10.686 9.09866 10.0583L12.3367 13.2963C12.5594 13.519 12.9158 13.519 13.1385 13.2963C13.3611 13.0736 13.3611 12.7172 13.1385 12.4945L10.2077 8.9493ZM5.94521 9.57919C3.86439 9.57919 2.16187 7.87667 2.16187 5.79585C2.16187 3.71503 3.86439 2.01251 5.94521 2.01251C8.02603 2.01251 9.72855 3.71503 9.72855 5.79585C9.72855 7.87667 8.02603 9.57919 5.94521 9.57919Z"
//         fill="white"
//         fillOpacity="0.5"
//       />
//   </svg>
// );

// const ArrowDownIcon: FC = () => (
//   <svg
//     width="19"
//     height="19"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     aria-hidden="true"
//   >
//     <path
//       d="M6 9L12 15L18 9"
//       stroke="#F5F5F5"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

const AdminHeader: FC = () => {
  return (
    <header
      className="flex items-center justify-between py-5 text-white font-['Roboto',sans-serif]"
    >
      <div>
        <h1 className="m-0 font-medium text-[36px] leading-[42px]">
          Welcome back, Admin
        </h1>
        <p className="mt-2 text-[16px] leading-[19px] font-normal text-[#B1B1B1]">
          here's what happened to your website during today
        </p>
      </div>

      <div className="flex items-center gap-[30px]">
        {/* <label
          className="flex items-center gap-[9px] rounded-[30px] border border-[#FFFCFC] px-[15px] py-[7px]"
          aria-label="Search"
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="what are you looking for..."
            className="w-[150px] bg-transparent text-white/50 placeholder:text-white/50 text-[12px] focus:outline-none font-['Roboto',sans-serif]"
          />
        </label> */}

        {/* <div className="flex items-center gap-[10px]">
          <img
            src="/assets/icon/Ardhianzy_Logo_2.png"
            alt="Admin avatar"
            className="h-[28px] w-[28px] object-cover rounded-full bg-[#D9D9D9]"
          />
          <span className="text-white text-[16px] leading-[19px] font-normal">
            Admin Ardhianzy
          </span>
        </div> */}
      </div>
    </header>
  );
};

export default AdminHeader;