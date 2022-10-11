import {
  Collection,
  ObjectId,
  OptionalUnlessRequiredId,
  Document,
} from 'mongodb'
import { ModelAttributes } from '@/domain/models'
import { addIdToDocument } from '../mongo-document-helper'

export interface ModelWithOptionalId {
  id?: string
}

export interface ModelDefaultAttributesFactory<
  TModel extends ModelWithOptionalId
> {
  defaultAttributes(
    partialEntity?: Partial<TModel>
  ): ModelAttributes<TModel> | Promise<ModelAttributes<TModel>>
}

export class MongoEntityFactory<TModel extends ModelWithOptionalId> {
  constructor(
    private readonly collection: Collection<TModel>,
    private readonly modelDefaultAttributesFactory: ModelDefaultAttributesFactory<TModel>
  ) {}

  public async create(partialEntity: Partial<TModel> = {}): Promise<TModel> {
    const finalInput = await this.mergeGivenAndDefaultAttributes(partialEntity)
    await this.collection.insertOne(
      finalInput as OptionalUnlessRequiredId<TModel>
    )
    return addIdToDocument(finalInput) as TModel
  }

  private async mergeGivenAndDefaultAttributes(
    partialEntity: Partial<TModel> = {}
  ): Promise<ModelAttributes<TModel> & { _id?: ObjectId }> {
    const { id, ...accountInputWithoutId } = partialEntity
    const passedMongoId = new ObjectId(id)

    const defaultAttributes =
      await this.modelDefaultAttributesFactory.defaultAttributes()

    return {
      ...defaultAttributes,
      ...accountInputWithoutId,
      _id: passedMongoId,
    }
  }

  public static async createFactory<T extends Document>(
    collection: Collection<T>,
    modelDefaultAttributesFactory: ModelDefaultAttributesFactory<T>
  ): Promise<MongoEntityFactory<T>> {
    return new MongoEntityFactory(collection, modelDefaultAttributesFactory)
  }
}
