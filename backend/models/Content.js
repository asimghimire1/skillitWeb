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

class Content {
    static async create(contentData) {
        const data = readData();
        if (!data.contents) data.contents = [];

        const newContent = {
            id: data.contents.length + 1,
            teacherId: contentData.teacherId,
            title: contentData.title,
            description: contentData.description,
            thumbnail: contentData.thumbnail || null,
            videoUrl: contentData.videoUrl || null,
            duration: contentData.duration || '0:00',
            category: contentData.category,
            tags: contentData.tags || [],
            status: contentData.status || 'draft', // draft, published, archived
            visibility: contentData.visibility || 'public', // public, private
            views: 0,
            likes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.contents.push(newContent);
        writeData(data);
        return newContent;
    }

    static async findById(id) {
        const data = readData();
        if (!data.contents) return null;
        return data.contents.find(c => c.id === parseInt(id));
    }

    static async findByTeacher(teacherId, status = null) {
        const data = readData();
        if (!data.contents) return [];

        let contents = data.contents.filter(c => c.teacherId === parseInt(teacherId));
        if (status) {
            contents = contents.filter(c => c.status === status);
        }
        return contents;
    }

    static async update(id, updateData) {
        const data = readData();
        if (!data.contents) return null;

        const contentIndex = data.contents.findIndex(c => c.id === parseInt(id));
        if (contentIndex !== -1) {
            data.contents[contentIndex] = {
                ...data.contents[contentIndex],
                ...updateData,
                updated_at: new Date().toISOString()
            };
            writeData(data);
            return data.contents[contentIndex];
        }
        return null;
    }

    static async incrementViews(id) {
        const data = readData();
        if (!data.contents) return null;

        const contentIndex = data.contents.findIndex(c => c.id === parseInt(id));
        if (contentIndex !== -1) {
            data.contents[contentIndex].views += 1;
            writeData(data);
            return data.contents[contentIndex];
        }
        return null;
    }

    static async delete(id) {
        const data = readData();
        if (!data.contents) return false;

        const contentIndex = data.contents.findIndex(c => c.id === parseInt(id));
        if (contentIndex !== -1) {
            data.contents.splice(contentIndex, 1);
            writeData(data);
            return true;
        }
        return false;
    }
}

module.exports = Content;
