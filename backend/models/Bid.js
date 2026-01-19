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

class Bid {
    static async create(bidData) {
        const data = readData();
        if (!data.bids) data.bids = [];

        const newBid = {
            id: data.bids.length + 1,
            skillId: bidData.skillId,
            learnerId: bidData.learnerId,
            teacherId: bidData.teacherId,
            proposedPrice: bidData.proposedPrice,
            proposedDate: bidData.proposedDate,
            proposedTime: bidData.proposedTime,
            sessionType: bidData.sessionType || 'online', // online, in-person
            message: bidData.message || '',
            skillSwap: bidData.skillSwap || false,
            skillSwapDetails: bidData.skillSwapDetails || null,
            status: 'pending', // pending, accepted, countered, declined, completed, cancelled
            counterOffer: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.bids.push(newBid);
        writeData(data);
        return newBid;
    }

    static async findById(id) {
        const data = readData();
        if (!data.bids) return null;
        return data.bids.find(b => b.id === parseInt(id));
    }

    static async findByLearner(learnerId, status = null) {
        const data = readData();
        if (!data.bids) return [];

        let bids = data.bids.filter(b => b.learnerId === parseInt(learnerId));
        if (status) {
            bids = bids.filter(b => b.status === status);
        }
        return bids;
    }

    static async findByTeacher(teacherId, status = null) {
        const data = readData();
        if (!data.bids) return [];

        let bids = data.bids.filter(b => b.teacherId === parseInt(teacherId));
        if (status) {
            bids = bids.filter(b => b.status === status);
        }
        return bids;
    }

    static async updateStatus(id, status, counterOffer = null) {
        const data = readData();
        if (!data.bids) return null;

        const bidIndex = data.bids.findIndex(b => b.id === parseInt(id));
        if (bidIndex !== -1) {
            data.bids[bidIndex].status = status;
            data.bids[bidIndex].updated_at = new Date().toISOString();

            if (counterOffer) {
                data.bids[bidIndex].counterOffer = counterOffer;
            }

            writeData(data);
            return data.bids[bidIndex];
        }
        return null;
    }

    static async delete(id) {
        const data = readData();
        if (!data.bids) return false;

        const bidIndex = data.bids.findIndex(b => b.id === parseInt(id));
        if (bidIndex !== -1) {
            data.bids.splice(bidIndex, 1);
            writeData(data);
            return true;
        }
        return false;
    }
}

module.exports = Bid;
