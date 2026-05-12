import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueApi } from '../api';
import { QueueStatusResponse } from '../types';
import { useLanguage } from '../i18n';

export default function WaitingRoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [status, setStatus] = useState<QueueStatusResponse | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const eid = Number(eventId);

  useEffect(() => {
    queueApi.join(eid).then(res => {
      setStatus(res.data.data);
      setJoined(true);
      if (res.data.data.hasAccess) {
        navigate(`/events/${eid}/seats`);
      }
    }).catch(err => setError(err.response?.data?.message || 'Failed to join queue'));
  }, [eid, navigate]);

  useEffect(() => {
    if (!joined) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await queueApi.status(eid);
        setStatus(res.data.data);
        if (res.data.data.hasAccess) {
          clearInterval(pollRef.current);
          navigate(`/events/${eid}/seats`);
        }
      } catch { /* ignore */ }
    }, 3000);

    return () => { if (pollRef.current !== undefined) clearInterval(pollRef.current); };
  }, [joined, eid, navigate]);

  const progressPercent = Math.max(2, status?.position && status?.totalInQueue ? (1 - status.position / status.totalInQueue) * 100 : 2);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center pt-16 pb-10 px-4 text-gray-900">
      
      <div className="bg-white border border-gray-200 rounded-xl max-w-[650px] w-full overflow-hidden shadow-xl animate-[fadeIn_0.5s_ease-out]">
        
        <div className="p-6 text-center border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">{t('queue.title')}</h1>
          <p className="text-gray-500 text-sm mt-2">{t('queue.subtitle')}</p>
        </div>

        <div className="py-10 px-8 text-center">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6 font-medium">{error}</div>}

          {status && !status.hasAccess && (
            <>
              <h2 className="text-2xl font-extrabold mb-8">{t('queue.inQueue')}</h2>
              
              <div className="relative h-10 mb-2">
                <div className="absolute bottom-2.5 transition-all duration-1000 ease-in-out text-4xl -translate-x-1/2" style={{ left: `${progressPercent}%` }}>
                  🚶
                </div>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mx-auto shadow-inner">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-in-out relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>

              <div className="text-lg font-bold mt-8 mb-3 text-gray-700">
                {t('queue.peopleAhead')} <span className="text-blue-600 text-3xl font-black ml-2">{status.position}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                {t('queue.doNotRefresh')}
              </p>
            </>
          )}

          {status?.hasAccess && (
            <div className="p-6 animate-[bounceIn_0.5s_ease-out]">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-green-500 mb-3">{t('queue.yourTurn')}</h2>
              <p className="text-gray-600 font-medium">{t('queue.redirecting')}</p>
            </div>
          )}

        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t('queue.smartQueue')}
        </div>
      </div>

    </div>
  );
}
