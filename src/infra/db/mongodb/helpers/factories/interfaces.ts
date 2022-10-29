import { ModelAttributes } from '@/domain/models'

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
