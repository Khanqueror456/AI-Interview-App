import { PhoneOff } from "lucide-react";

/**
 * Shared error screen. Purely presentational — pass in your retry/navigation logic.
 *
 * @param {string} title
 * @param {string} body
 * @param {() => void} onReconnect
 * @param {() => void} onBack
 */
export default function ErrorScreen({
  title = "Some error occured",
  body = "We lost your interview feed partway through. Your answers up to this point have been saved.",
  onReconnect = () => {},
  onBack = () => {},
}) {
  return (
    <div className="min-h-[560px] flex items-center justify-center bg-[#EDEEEA]">
      <div className="flex flex-col items-center gap-[18px] max-w-[380px] text-center px-5">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F4] border border-[#D8D9D3] flex items-center justify-center mb-1.5">
          <PhoneOff size={24} strokeWidth={1.8} className="text-[#C24444]" />
        </div>

        <p className="text-xl font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
          {title}
        </p>
        <p className="text-[14.5px] leading-relaxed text-[#6B7280] m-0">{body}</p>

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={onReconnect}
            className="bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-4 py-[9px] rounded-[5px] transition-colors duration-150"
          >
            Reconnect
          </button>
          <button
            onClick={onBack}
            className="bg-transparent border border-[#D8D9D3] hover:border-[#6B7280] hover:bg-[#F7F7F4] text-[#14213D] text-sm font-medium px-4 py-[9px] rounded-[5px] transition-colors duration-150"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
