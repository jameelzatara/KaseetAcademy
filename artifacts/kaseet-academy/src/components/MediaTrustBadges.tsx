import mediaLogos from '@assets/wajeez-media-logos.png';
import { F } from '../pages/shared/coursePageHelpers';

/**
 * Compact media-mention strip for Wajeez accreditation sections.
 * The supplied source image is cropped to its three logo marks so the strip
 * reads as supporting trust information rather than a separate promotion.
 */
export default function MediaTrustBadges() {
  return (
    <div
      dir="rtl"
      style={{
        margin: '22px 0',
        padding: '15px 18px',
        borderRadius: 15,
        border: '1px solid rgba(30,122,133,.24)',
        background: 'rgba(255,255,255,.58)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ minWidth: 190 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: F, fontSize: 12, fontWeight: 800, color: '#1e7a85' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e7a85' }} />
          حضور إعلامي لوجيز
        </div>
        <p style={{ fontFamily: F, fontSize: 12, color: '#56617A', margin: '5px 0 0', lineHeight: 1.65 }}>
          ذُكر اسم وجيز عبر جهات إعلامية مرموقة.
        </p>
      </div>

      <div style={{ flex: '1 1 285px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
        <img
          src={mediaLogos}
          alt="BBC، الوطن، وForbes Middle East"
          style={{ display: 'block', width: 'min(100%, 410px)', height: 'auto', maxHeight: 44, objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}