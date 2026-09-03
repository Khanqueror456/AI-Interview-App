/**
 * Shared loading screen. Purely presentational.
 *
 * @param {string} title
 * @param {string} subtitle
 */
export default function LoadingScreen({
  title = "Getting your session ready",
  subtitle = "This usually takes a few seconds.",
}) {
  return (
    <div className="min-h-[560px] flex items-center justify-center bg-[#EDEEEA]">
      <div className="flex flex-col items-center gap-7">
        <div className="flex items-end gap-[5px] h-14">
          {[
            "bg-[#14213D] [animation-delay:0s]",
            "bg-[#E8A33D] [animation-delay:0.12s]",
            "bg-[#14213D] [animation-delay:0.24s]",
            "bg-[#E8A33D] [animation-delay:0.36s]",
            "bg-[#14213D] [animation-delay:0.48s]",
          ].map((cls, i) => (
            <span
              key={i}
              className={`w-[6px] rounded-[3px] animate-[wave_1.1s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:h-8 ${cls}`}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-[19px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
            {title}
          </p>
          <p className="text-sm text-[#6B7280] mt-1 m-0">{subtitle}</p>
        </div>
      </div>

      {/* Keyframe for the waveform bars — add to your global CSS instead if you prefer not to inline it */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 14px; }
          50% { height: 52px; }
        }
      `}</style>
    </div>
  );
}
