import { NavLink, Link } from "react-router-dom";
import { Bell } from "lucide-react";

/**
 * Shared navbar. Purely presentational — wire up auth/handlers via props.
 * Active link styling comes from react-router's NavLink, driven by the current URL,
 * so no activeHref prop is needed anymore.
 *
 * @param {{ label: string, to: string }[]} links
 * @param {{ name: string, initials: string }} user
 * @param {() => void} onCtaClick - primary CTA ("Start practice")
 * @param {() => void} onBellClick
 * @param {string} logoText
 */
export default function Navbar({
  links = [
    { label: "Dashboard", to: "/" },
    { label: "Practice", to: "/interviews/create" },
    { label : "Interviews", to: "/interviews"},
    { label: "Resumes", to: "/resumes" },
  ],
  user = { name: "Jordan Smith", initials: "JS" },
  onCtaClick = () => {},
  onBellClick = () => {},
  logoText = "cadence",
}) {
  return (
    <nav className="flex items-center justify-between h-16 px-7 bg-white border-b border-[#D8D9D3]">
      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="text-[21px] font-semibold text-[#14213D] tracking-tight font-['Lora',_Georgia,_serif] no-underline"
        >
          {logoText}
        </Link>

        <ul className="flex gap-7 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "relative inline-block py-[22px] text-[14.5px] font-medium no-underline transition-colors duration-150",
                    "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#E8A33D]",
                    "after:origin-left after:transition-transform after:duration-150",
                    isActive
                      ? "text-[#14213D] after:scale-x-100"
                      : "text-[#6B7280] hover:text-[#14213D] after:scale-x-0 hover:after:scale-x-100",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-[18px]">
        <button
          onClick={onBellClick}
          aria-label="Notifications"
          className="p-1.5 rounded-md text-[#6B7280] hover:text-[#14213D] hover:bg-[#EDEEEA] transition-colors duration-150"
        >
          <Bell size={19} strokeWidth={1.8} />
        </button>

        <button
          onClick={onCtaClick}
          className="bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-[18px] py-[9px] rounded-[5px] transition-colors duration-150"
        >
          Start practice
        </button>

        <div className="w-[34px] h-[34px] rounded-full bg-[#E8A33D] text-[#14213D] text-[13px] font-semibold flex items-center justify-center">
          {user.initials}
        </div>
      </div>
    </nav>
  );
}
