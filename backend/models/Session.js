const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data.json');

const readData = () => {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

class Session {
    static async create(sessionData) {
        const data = readData();
        if (!data.sessions) data.sessions = [];

        const newSession = {
            id: data.sessions.length + 1,
            bidId: sessionData.bidId || null,
            skillId: sessionData.skillId,
            teacherId: sessionData.teacherId,
            learnerId: sessionData.learnerId,
            title: sessionData.title,
            scheduledDate: sessionData.scheduledDate,
            scheduledTime: sessionData.scheduledTime,
            duration: sessionData.duration || 60,
            sessionType: sessionData.sessionType || 'online',
            price: sessionData.price,
            status: 'scheduled', // scheduled, in-progress, completed, cancelled, rescheduled
            meetingLink: sessionData.meetingLink || null,
            location: sessionData.location || null,
            notes: sessionData.notes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.sessions.push(newSession);
        writeData(data);
        return newSession;
    }

    static async findById(id) {
        const data = readData();
        if (!data.sessions) return null;
        return data.sessions.find(s => s.id === parseInt(id));
    }

    static async findByTeacher(teacherId, status = null) {
        const data = readData();
        if (!data.sessions) return [];

        let sessions = data.sessions.filter(s => s.teacherId === parseInt(teacherId));
        if (status) {
            sessions = sessions.filter(s => s.status === status);
        }
        return sessions.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    }

    static async findByLearner(learnerId, status = null) {
        const data = readData();
        if (!data.sessions) return [];

        let sessions = data.sessions.filter(s => s.learnerId === parseInt(learnerId));
        if (status) {
            sessions = sessions.filter(s => s.status === status);
        }
        return sessions.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    }

    static async updateStatus(id, status) {
        const data = readData();
        if (!data.sessions) return null;

        const sessionIndex = data.sessions.findIndex(s => s.id === parseInt(id));
        if (sessionIndex !== -1) {
            data.sessions[sessionIndex].status = status;
            data.sessions[sessionIndex].updated_at = new Date().toISOString();
            writeData(data);
            return data.sessions[sessionIndex];
        }
        return null;
    }

    static async update(id, updateData) {
        const data = readData();
        if (!data.sessions) return null;

        const sessionIndex = data.sessions.findIndex(s => s.id === parseInt(id));
        if (sessionIndex !== -1) {
            data.sessions[sessionIndex] = {
                ...data.sessions[sessionIndex],
                ...updateData,
                updated_at: new Date().toISOString()
            };
            writeData(data);
            return data.sessions[sessionIndex];
        }
        return null;
    }
}

module.exports = Session;
