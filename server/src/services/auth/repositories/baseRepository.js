class BaseRepository {
    constructor(model) {
        this.model = model;
        if (!model) {
            throw new Error("BaseRepository requires a valid model");
        }
    }

    async create(data) {
        throw new Error("Method not implemented");
    }

    async findById(id) {
        throw new Error("Method not implemented");
    }

    async findByUsername(username) {
        throw new Error("Method not implemented");
    }

    async findByEmail(email) {
        throw new Error("Method not implemented");
    }

    async findAll() {
        throw new Error("Method not implemented");
    }
}

export default BaseRepository;
