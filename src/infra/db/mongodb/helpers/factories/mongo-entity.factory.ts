import {
  Collection,
  Document,
  ObjectId,
  OptionalUnlessRequiredId,
} from 'mongodb'
import { ModelDefaultAttributesFactory } from './interfaces'

export class MongoEntityFactory<TSchema extends Document> {
  constructor(
    private readonly collection: Collection<TSchema>,
    private readonly modelDefaultAttributesFactory: ModelDefaultAttributesFactory<TSchema>
  ) {}

  public async create(
    partialEntity: Partial<TSchema> = {}
  ): Promise<TSchema & { _id: ObjectId }> {
    const finalInput = await this.mergeGivenAndDefaultAttributes(partialEntity)

    await this.collection.insertOne(
      finalInput as OptionalUnlessRequiredId<TSchema>
    )

    return finalInput
  }

  private async mergeGivenAndDefaultAttributes(
    partialEntity: Partial<TSchema> = {}
  ): Promise<TSchema & { _id: ObjectId }> {
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

  public static async createFactory<TSchema extends Document>(
    collection: Collection<TSchema>,
    modelDefaultAttributesFactory: ModelDefaultAttributesFactory<TSchema>
  ): Promise<MongoEntityFactory<TSchema>> {
    return new MongoEntityFactory(collection, modelDefaultAttributesFactory)
  }
}
