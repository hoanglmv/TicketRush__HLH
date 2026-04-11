import { Apple, Play } from 'lucide-react';
import { useLanguage } from '../i18n';

const FbIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const XIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>);
const YtIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#111"></polyline></svg>);
const IgIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="tm-footer">
      <div className="tm-footer-container">
        
        {/* Column 1 */}
        <div className="tm-footer-col" style={{ flex: '1.2' }}>
          <div className="tm-footer-brand" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '32px', letterSpacing: '-0.5px' }}>
            <i style={{ fontStyle: 'italic' }}>ticketrush</i>
            <span style={{ fontSize: '0.8rem', verticalAlign: 'super', marginLeft: '2px', fontStyle: 'normal' }}>®</span>
          </div>
          
          <div className="tm-footer-title">{t('footer.letsConnect')}</div>
          <div className="tm-footer-socials" style={{ display: 'flex', gap: '20px', marginBottom: '32px', alignItems: 'center' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}><FbIcon /></a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}><XIcon /></a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>BLOG</span></a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}><YtIcon /></a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}><IgIcon /></a>
          </div>
          
          <div className="tm-footer-title">{t('footer.downloadApps')}</div>
          <div className="tm-footer-apps" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <button className="btn" style={{ background: 'transparent', border: '1px solid #ccc', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '4px', width: 'fit-content', cursor: 'pointer' }}>
              <Apple size={28} />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.65rem' }}>{t('footer.downloadOn')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>App Store</div>
              </div>
            </button>
            <button className="btn" style={{ background: 'transparent', border: '1px solid #ccc', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '4px', width: 'fit-content', cursor: 'pointer' }}>
              <Play size={24} />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.65rem' }}>{t('footer.getItOn')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Google Play</div>
              </div>
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.4' }}>
            {t('footer.termsAgree')}<br/>
            {' '}<a href="#" style={{ color: 'white', textDecoration: 'underline' }}>{t('footer.termsOfUse')}</a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="tm-footer-col" style={{ flex: 1 }}>
          <div className="tm-footer-title">{t('footer.helpfulLinks')}</div>
          <ul className="tm-footer-list">
            <li><a href="#">{t('footer.helpFaq')}</a></li>
            <li><a href="#">{t('footer.sell')}</a></li>
            <li><a href="#">{t('footer.myAccount')}</a></li>
            <li><a href="#">{t('footer.contactUs')}</a></li>
            <li><a href="#">{t('footer.giftCards')}</a></li>
            <li><a href="#">{t('footer.doNotSell')}</a></li>
            <li><a href="#">{t('footer.getStarted')}</a></li>
          </ul>

          <div className="tm-footer-title" style={{ marginTop: '40px' }}>{t('footer.aboutUs')}</div>
          <ul className="tm-footer-list">
            <li><a href="#">{t('footer.blog')}</a></li>
            <li><a href="#">{t('footer.ticketingTruths')}</a></li>
            <li><a href="#">{t('footer.adChoices')}</a></li>
            <li><a href="#">{t('footer.careers')}</a></li>
            <li><a href="#">{t('footer.ticketYourEvent')}</a></li>
            <li><a href="#">{t('footer.innovation')}</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="tm-footer-col" style={{ flex: 1 }}>
          <div className="tm-footer-title">{t('footer.ourNetwork')}</div>
          <ul className="tm-footer-list">
            <li><a href="#">Live Nation</a></li>
            <li><a href="#">House of Blues</a></li>
            <li><a href="#">Front Gate Tickets</a></li>
            <li><a href="#">TicketWeb</a></li>
            <li><a href="#">universe</a></li>
            <li><a href="#">NFL</a></li>
            <li><a href="#">NBA</a></li>
            <li><a href="#">NHL</a></li>
          </ul>

          <div className="tm-footer-title" style={{ marginTop: '40px' }}>{t('footer.friendsPartners')}</div>
          <ul className="tm-footer-list">
            <li><a href="#">PayPal</a></li>
            <li><a href="#">Allianz</a></li>
            <li><a href="#">AWS</a></li>
            <li><a href="#">Affiliates</a></li>
          </ul>
        </div>
      </div>

      <div className="tm-footer-bottom">
        <div className="tm-footer-bottom-links">
          <a href="#">{t('footer.ourPolicies')}</a> | <a href="#">{t('footer.privacyPolicy')}</a> | <a href="#">{t('footer.cookiePolicy')}</a> | <a href="#">{t('footer.manageCookies')}</a>
        </div>
        <div className="tm-footer-copyright">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
