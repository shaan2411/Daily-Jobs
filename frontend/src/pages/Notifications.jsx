import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, Trash2, Calendar, MessageSquare, ChevronRight, Inbox } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated with your job applications and system status.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Syncing alert history...</div>
        ) : notifications.length === 0 ? (
          <div className="card-base py-20 text-center">
            <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
              <Inbox size={32} />
            </div>
            <p className="text-gray-500 font-medium italic">No recent activity detected</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`card-base flex items-start gap-4 transition-all relative group cursor-pointer ${
                !notif.isRead ? 'border-brand-primary/30 bg-blue-50/20' : 'opacity-80'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.type === 'application' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-brand-primary'
              }`}>
                {notif.type === 'application' ? <MessageSquare size={18} /> : <Bell size={18} />}
              </div>
              
              <div className="flex-1 space-y-1 pr-8">
                <div className="flex items-center space-x-2">
                  <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                    {notif.message}
                  </p>
                  {!notif.isRead && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>}
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center"><Clock size={12} className="mr-1" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => deleteNotification(e, notif._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
