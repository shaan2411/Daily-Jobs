const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const notifications = await Notification.find({ recipient: req.user?.userId })
            .populate('sender', 'name')
            .populate('job', 'title')
            .sort({ createdAt: -1 })
            .limit(20);
            
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const count = await Notification.countDocuments({ 
            recipient: req.user?.userId, 
            isRead: false 
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });
        await Notification.updateMany({ recipient: req.user?.userId }, { isRead: true });
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });
        await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user?.userId });
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getNotificationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'name')
            .populate('job', 'title')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
