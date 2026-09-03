/**
 * Shared message dialog — for simple "read and acknowledge" messages.
 * Render this conditionally from your own open/close state; it has no logic of its own.
 *
 * @param {string} title
 * @param {string} message
 * @param {string} okLabel
 * @param {() => void} onOk
 */
export default function MessageDialog({
  title = "Heads up",
  message = "Your interview analysis is ready to view.",
  okLabel = "OK",
  onOk = () => {},
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/40 px-4">
      <div className="w-full max-w-[400px] bg-white rounded-[8px] border border-[#D8D9D3] shadow-[0_12px_32px_rgba(20,33,61,0.18)] p-6">
        <p className="text-[17px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
          {title}
        </p>
        <p className="text-[14.5px] leading-relaxed text-[#6B7280] mt-2.5 mb-0">
          {message}
        </p>

        <div className="flex justify-end mt-6">
          <button
            onClick={onOk}
            autoFocus
            className="bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-5 py-2 rounded-[5px] transition-colors duration-150"
          >
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
