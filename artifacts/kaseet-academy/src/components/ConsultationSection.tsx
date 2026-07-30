export default function ConsultationSection() {
  return (
    <section
      className="relative overflow-hidden w-full"
      style={{
        backgroundColor: '#2C374B',
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          rgba(255,255,255,0.035) 0px,
          rgba(255,255,255,0.035) 1px,
          transparent 1px,
          transparent 20px
        )`,
      }}
    >
      <div
        className="relative mx-auto w-full flex flex-col md:flex-row items-stretch gap-0"
        style={{ maxWidth: 1200 }}
      >
        {/* ── RIGHT COLUMN (RTL start): heading + description + consultant photo ── */}
        <div
          className="flex-1 flex flex-col justify-center text-right px-8 md:px-12 py-10 md:py-14"
          style={{ minWidth: 0 }}
        >
          {/* Mini label */}
          <span
            className="block mb-3 font-bold"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 13,
              color: '#FFC107',
              letterSpacing: '0.04em',
            }}
          >
            استشارة مجانية
          </span>

          {/* Heading */}
          <h2
            className="font-black text-white mb-4 leading-snug"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 'clamp(22px,2.6vw,34px)',
              lineHeight: 1.4,
            }}
          >
            احجز استشارتك المجانية مع المستشارة التعليمية
          </h2>

          {/* Description */}
          <p
            className="text-[rgba(252,251,251,0.72)] leading-relaxed mb-6"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 'clamp(13px,1.3vw,15px)',
              lineHeight: 1.85,
              maxWidth: 400,
            }}
          >
            محتار في اختيار المسار الأنسب لصوتك أو حضورك الإعلامي؟ تواصل معنا لتحديد مستواك وبناء خطتك التدريبية — بدون أي التزام.
          </p>

          {/* Consultant avatar + label */}
          <div className="flex items-center gap-3 justify-end">
            <span
              className="font-bold text-[rgba(252,251,251,0.85)] text-sm"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              المستشارة التعليمية
            </span>
            {/* Circular avatar placeholder with gold ring */}
            <div
              className="relative flex-none"
              style={{ width: 64, height: 64 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #FFC107 0%, #e8a000 100%)',
                  padding: 2,
                }}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden flex items-end justify-center"
                  style={{
                    background: 'linear-gradient(160deg, #3a4a63 0%, #2c374b 100%)',
                  }}
                >
                  {/* Silhouette */}
                  <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                    <circle cx="32" cy="23" r="13" fill="rgba(255,193,7,0.5)" />
                    <ellipse cx="32" cy="60" rx="22" ry="16" fill="rgba(255,193,7,0.4)" />
                  </svg>
                </div>
              </div>
              {/* Gold ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '2px solid #FFC107',
                  boxShadow: '0 0 12px rgba(255,193,7,0.35)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          className="hidden md:block self-stretch flex-none"
          style={{ width: 1, background: 'rgba(255,255,255,0.10)', margin: '32px 0' }}
        />

        {/* ── LEFT COLUMN (RTL end): stats + CTA ── */}
        <div
          className="flex-none flex flex-col justify-center text-right px-8 md:px-12 py-10 md:py-14 gap-6"
          style={{ width: 'clamp(260px,34%,400px)' }}
        >
          {/* Stats row */}
          <div className="flex items-start gap-6 justify-end flex-row-reverse">
            {[
              { num: '40+', lbl: 'دفعة' },
              { num: '600+', lbl: 'مدرب' },
              { num: '100%', lbl: 'رضا المتدربين' },
            ].map(({ num, lbl }) => (
              <div key={lbl} className="text-center">
                <div
                  className="font-black text-[#FFC107] leading-none"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(22px,2.2vw,28px)', direction: 'ltr' }}
                >
                  {num}
                </div>
                <div
                  className="text-[rgba(252,251,251,0.65)] mt-1"
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12 }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/962XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full rounded-full font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 15,
              padding: '13px 24px',
              background: '#111827',
              color: '#FFC107',
              border: '1px solid rgba(255,193,7,0.25)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
              textDecoration: 'none',
            }}
          >
            {/* WhatsApp icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
              <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.18 1.6 6L0 24l6.3-1.56A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.24-1.44l-.37-.22-3.87.96.99-3.75-.24-.38A10 10 0 0 1 2 12C2 6.48 6.48 2 12 2c2.68 0 5.19 1.04 7.08 2.92A9.95 9.95 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.47-7.52c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.5-.68-.51h-.58c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.69.25-1.28.17-1.42-.07-.13-.27-.2-.57-.35z"/>
            </svg>
            احجز استشارة عبر واتساب
          </a>

          {/* Explore link */}
          <a
            href="#"
            className="text-center text-[rgba(252,251,251,0.60)] hover:text-[rgba(252,251,251,0.85)] transition-colors duration-150"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            استكشف البرامج والمسارات
          </a>
        </div>
      </div>
    </section>
  );
}
