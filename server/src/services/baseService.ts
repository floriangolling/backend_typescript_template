import {
  Attributes,
  CreationAttributes,
  FindOptions,
  FindOrCreateOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions,
} from "sequelize";

class BaseService<T extends Model> {
  model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(opts = {} as FindOptions<T> | undefined) {
    return this.model.findAll(opts);
  }

  async findOne(opts = {} as FindOptions<T> | undefined) {
    return this.model.findOne(opts);
  }

  async findById(id: number, opts = {} as Omit<FindOptions<T>, "where"> | undefined) {
    return this.model.findByPk(id, opts);
  }

  async findOrCreate(opts: FindOrCreateOptions<Attributes<T>, CreationAttributes<T>>) {
    return this.model.findOrCreate(opts);
  }

  async create(data: CreationAttributes<T>) {
    return this.model.create(data);
  }

  async update(data: Partial<T>, opts: UpdateOptions<Attributes<T>>) {
    return this.model.update(data, opts);
  }

  async delete(where: WhereOptions<T>) {
    return this.model.destroy({ where });
  }

  async count(where: WhereOptions<T> = {}) {
    return this.model.count({ where });
  }
}

export default BaseService;
