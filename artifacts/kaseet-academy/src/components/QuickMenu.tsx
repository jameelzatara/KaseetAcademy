import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface Props {
  open: boolean;
  onClose: () => void;
}

const GOLD = '#FFC107';
const NAVY = '#1A2533';

export default function QuickMenu({ open, onClose }: Props) {
  const [, navigate] = useLocation();

  const openAccount = () => {
    onClose();
    navigate('/sign-in');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
              width: '100%',
              height: '100%',
              border: 0,
              background: 'rgba(4, 9, 15, .72)',
              cursor: 'default',
            }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 901,
              display: 'grid',
              placeItems: 'center',
              padding: 16,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              role="dialog"
              aria-label="قائمة الحساب"
              dir="rtl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              style={{
                position: 'relative',
                width: 'min(330px, 100%)',
                padding: '24px 20px 20px',
                border: '1px solid rgba(255,193,7,.42)',
                borderRadius: 18,
                background: NAVY,
                boxShadow: '0 22px 60px rgba(0,0,0,.35)',
                pointerEvents: 'auto',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 14,
                  border: 0,
                  color: '#C7D1DF',
                  background: 'transparent',
                  font: '700 13px Tajawal, sans-serif',
                  cursor: 'pointer',
                }}
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={openAccount}
                style={{
                  width: '100%',
                  minHeight: 48,
                  border: 0,
                  borderRadius: 10,
                  color: NAVY,
                  background: GOLD,
                  font: '900 15px Tajawal, sans-serif',
                  cursor: 'pointer',
                }}
              >
                تسجيل الدخول / حسابي
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}