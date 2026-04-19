import { IRepository } from '../shared/interfaces/IRepository';
import { UserModel, IUser } from './UserModel';

export class UserRepository implements IRepository<IUser> {
    public async create(data: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(data);
        return user.save();
    }

    public async findById(id: string): Promise<IUser | null> {
        return UserModel.findById(id);
    }

    public async findAll(): Promise<IUser[]> {
        return UserModel.find();
    }

    public async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result !== null;
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }
}
