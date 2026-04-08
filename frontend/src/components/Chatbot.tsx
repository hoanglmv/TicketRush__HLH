import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Chào bạn! Tôi là AI Assistant của TicketRush. Bạn muốn tìm vé xem Concert hay Thể thao hôm nay?", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateMockAIResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('concert') || lower.includes('nhạc') || lower.includes('âm nhạc')) {
      return "Chúng tôi đang có rất nhiều Concert hot! Bạn hãy gõ tên ca sĩ hoặc chọn mục Concerts trên thanh menu nhé.";
    } else if (lower.includes('sport') || lower.includes('thể thao') || lower.includes('bóng đá')) {
      return "Vé thể thao đang mở bán với rất nhiều giải đấu lớn. Bạn muốn xem môn thể thao nào?";
    } else if (lower.includes('vé') || lower.includes('ticket')) {
      return "Để mua vé, bạn hãy vào trang Sự kiện, chọn vị trí ngồi và hoàn tất thanh toán siêu tốc với TicketRush!";
    } else if (lower.includes('hello') || lower.includes('chào') || lower.includes('hi')) {
      return "Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tìm vé sự kiện gì?";
    } else {
      return "Cảm ơn bạn đã quan tâm! Để biết thêm chi tiết, bạn có thể thử tìm kiếm bằng thanh Search hoặc xem các mục nổi bật nha.";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Indicate bot is thinking
    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, text: "...", sender: 'bot' }]);

    try {
      const response = await fetch('http://localhost:8080/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await response.json();
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? { ...msg, text: data.reply } : msg
      ));
    } catch (error) {
       setMessages(prev => prev.map(msg => 
        msg.id === loadingId ? { ...msg, text: "Xin lỗi, hiện tại không thể kết nối tới server AI." } : msg
      ));
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--accent-gradient)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)', cursor: 'pointer',
          zIndex: 9999, transition: 'transform 0.3s',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
      >
        <MessageCircle size={28} />
      </div>

      <div style={{
        position: 'fixed', bottom: '30px', right: '30px',
        width: '350px', height: '500px', backgroundColor: 'var(--bg-card)',
        borderRadius: '16px', border: '1px solid var(--border-color)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', zIndex: 10000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)',
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--accent-gradient)', padding: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'white', fontWeight: 600
        }}>
          <div className="flex align-center gap-sm">
            <MessageCircle size={20} /> AI Assistant Demo
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m) => (
            <div key={m.id} style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              background: m.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-input)',
              color: 'white', padding: '10px 14px', borderRadius: '14px',
              maxWidth: '85%', fontSize: '0.95rem',
              borderBottomRightRadius: m.sender === 'user' ? '4px' : '14px',
              borderBottomLeftRadius: m.sender === 'bot' ? '4px' : '14px',
            }}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} style={{ borderTop: '1px solid var(--border-color)', padding: '12px', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bạn muốn tìm sự kiện nào..."
            style={{
              flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
              color: 'white', borderRadius: '20px', padding: '10px 16px', outline: 'none'
            }}
          />
          <button type="submit" style={{
            background: 'var(--accent-gradient)', border: 'none', width: '40px', height: '40px',
            borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
