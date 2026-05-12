import { Apple, Play } from 'lucide-react';
import { useLanguage } from '../i18n';

const FbIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const XIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>);
const YtIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#111"></polyline></svg>);
const IgIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#020b18] text-white pt-16 pb-8 border-t-[6px] border-[#026cdf]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 pb-12 border-b border-white/10">
          {/* Column 1 */}
          <div className="flex-1 lg:flex-[1.5]">
            <div className="text-3xl font-black text-white mb-8 tracking-tighter">
              <i className="italic">ticketrush</i>
              <span className="text-xs align-super ml-0.5 not-italic">®</span>
            </div>
            
            <div className="text-sm font-bold uppercase tracking-wider mb-4 text-white/80">{t('footer.letsConnect')}</div>
            <div className="flex gap-4 mb-8 items-center text-white/90">
              <a href="/" className="hover:text-white transition-colors"><FbIcon /></a>
              <a href="/" className="hover:text-white transition-colors"><XIcon /></a>
              <a href="/" className="hover:text-white transition-colors flex items-center gap-1"><span className="text-sm font-bold">BLOG</span></a>
              <a href="/" className="hover:text-white transition-colors"><YtIcon /></a>
              <a href="/" className="hover:text-white transition-colors"><IgIcon /></a>
            </div>
            
            <div className="text-sm font-bold uppercase tracking-wider mb-4 text-white/80">{t('footer.downloadApps')}</div>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button className="bg-transparent border border-white/30 text-white flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                <Apple size={28} />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase text-white/70 tracking-wider">{t('footer.downloadOn')}</div>
                  <div className="text-base font-bold">App Store</div>
                </div>
              </button>
              <button className="bg-transparent border border-white/30 text-white flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                <Play size={24} />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase text-white/70 tracking-wider">{t('footer.getItOn')}</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </button>
            </div>

            <div className="text-xs text-white/50 leading-relaxed max-w-sm">
              {t('footer.termsAgree')}<br/>
              {' '}<a href="/" className="text-white/70 hover:text-white underline transition-colors">{t('footer.termsOfUse')}</a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-wider mb-5 text-white/90">{t('footer.helpfulLinks')}</div>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.helpFaq')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.sell')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.myAccount')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.contactUs')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.giftCards')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.doNotSell')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.getStarted')}</a></li>
            </ul>

            <div className="text-sm font-bold uppercase tracking-wider mb-5 mt-10 text-white/90">{t('footer.aboutUs')}</div>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.blog')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.ticketingTruths')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.adChoices')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.careers')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.ticketYourEvent')}</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">{t('footer.innovation')}</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-wider mb-5 text-white/90">{t('footer.ourNetwork')}</div>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">Live Nation</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">House of Blues</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">Front Gate Tickets</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">TicketWeb</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">universe</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">NFL</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">NBA</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">NHL</a></li>
            </ul>

            <div className="text-sm font-bold uppercase tracking-wider mb-5 mt-10 text-white/90">{t('footer.friendsPartners')}</div>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">PayPal</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">Allianz</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">AWS</a></li>
              <li><a href="/" className="text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">Affiliates</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-xs font-medium text-white/50">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="/" className="hover:text-white transition-colors">{t('footer.ourPolicies')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="/" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="/" className="hover:text-white transition-colors">{t('footer.cookiePolicy')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="/" className="hover:text-white transition-colors">{t('footer.manageCookies')}</a>
          </div>
          <div className="text-center md:text-right">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
