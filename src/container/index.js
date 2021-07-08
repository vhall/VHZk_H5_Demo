import { publicInterface } from './repositories/public'

function bind (repositoryFactory, Interface) {
  return {
    ...Object.keys(Interface).reduce((prev, method) => {
      const resolveableMethod = async (...args) => {
        const repository = await repositoryFactory()
        return repository.default[method](...args)
      }
      return { ...prev, [method]: resolveableMethod }
    }, {})
  }
}

export default {
  get publicApi () {
    return bind(() => import('./repositories/public'), publicInterface)
  }
}
