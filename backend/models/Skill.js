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

class Skill {
    static async create(skillData) {
        const data = readData();
        if (!data.skills) data.skills = [];

        const newSkill = {
            id: data.skills.length + 1,
            teacherId: skillData.teacherId,
            title: skillData.title,
            description: skillData.description,
            category: skillData.category,
            priceMin: skillData.priceMin,
            priceMax: skillData.priceMax,
            duration: skillData.duration,
            level: skillData.level,
            skillType: skillData.skillType || 'online', // online, in-person, both
            thumbnail: skillData.thumbnail || null,
            tags: skillData.tags || [],
            status: 'active', // active, paused, archived
            rating: 0,
            totalReviews: 0,
            totalSessions: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.skills.push(newSkill);
        writeData(data);
        return newSkill;
    }

    static async findById(id) {
        const data = readData();
        if (!data.skills) return null;
        return data.skills.find(s => s.id === parseInt(id));
    }

    static async findByTeacher(teacherId) {
        const data = readData();
        if (!data.skills) return [];
        return data.skills.filter(s => s.teacherId === parseInt(teacherId));
    }

    static async getAll(filters = {}) {
        const data = readData();
        if (!data.skills) return [];

        let skills = data.skills;

        // Apply filters
        if (filters.category) {
            skills = skills.filter(s => s.category === filters.category);
        }
        if (filters.minPrice) {
            skills = skills.filter(s => s.priceMin >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            skills = skills.filter(s => s.priceMax <= parseFloat(filters.maxPrice));
        }
        if (filters.skillType) {
            skills = skills.filter(s => s.skillType === filters.skillType || s.skillType === 'both');
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            skills = skills.filter(s =>
                s.title.toLowerCase().includes(searchLower) ||
                s.description.toLowerCase().includes(searchLower)
            );
        }

        return skills;
    }

    static async update(id, updateData) {
        const data = readData();
        if (!data.skills) return null;

        const skillIndex = data.skills.findIndex(s => s.id === parseInt(id));
        if (skillIndex !== -1) {
            data.skills[skillIndex] = {
                ...data.skills[skillIndex],
                ...updateData,
                updated_at: new Date().toISOString()
            };
            writeData(data);
            return data.skills[skillIndex];
        }
        return null;
    }

    static async delete(id) {
        const data = readData();
        if (!data.skills) return false;

        const skillIndex = data.skills.findIndex(s => s.id === parseInt(id));
        if (skillIndex !== -1) {
            data.skills.splice(skillIndex, 1);
            writeData(data);
            return true;
        }
        return false;
    }
}

module.exports = Skill;
